package com.openland.react.animations

import android.graphics.PointF
import android.util.Log
import android.view.animation.LinearInterpolator
import androidx.interpolator.view.animation.FastOutSlowInInterpolator
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.uimanager.PixelUtil
import com.facebook.react.uimanager.UIManagerModule
import com.facebook.react.uimanager.UIManagerModuleListener
import android.view.ViewAnimationUtils
import android.animation.Animator
import android.animation.ValueAnimator
import android.annotation.SuppressLint
import android.view.View
import com.openland.react.animations.hacks.*


class RNOAnimatedViewManager(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), UIManagerModuleListener {

    private var views = mutableMapOf<String, RNOAnimatedView>()
    private var pending = mutableListOf<RNOAnimationTransactionSpec>()

    override fun getName(): String {
        return "RNOAnimatedViewManager"
    }

    override fun initialize() {
        super.initialize()
        // Subscribe for mount events to catch right time to start animation
        val uiManager = reactApplicationContext.getNativeModule(UIManagerModule::class.java)
        uiManager.addUIManagerListener(this)

        // Register in view view manager
        RNOAnimatedViewViewManager.sharedInstance.registerViewManager(this)
    }

    /**
     * Register animated view
     * [UI THREAD]
     */
    fun registerView(key: String, view: RNOAnimatedView) {
        this.views[key] = view
        resolvePendingAnimations()
    }


    /**
     * Entry point for animations
     * [BACKGROUND THREAD]
     */
    @ReactMethod
    fun animate(spec: String) {
        val resolved = parseAnimationSpec(spec)

        // Put transaction to pending list to start on next frame
        synchronized(this.pending) {
            pending.add(resolved)
        }
    }

    /**
     * Catch view updates to put animations
     * [BACKGROUND THREAD]
     */
    override fun willDispatchViewUpdates(uiManager: UIManagerModule) {
        uiManager.addUIBlock {
            resolvePendingAnimations()
        }
    }

    /**
     * Trying to find animations that can be started
     */
    private fun resolvePendingAnimations() {
        val pend = synchronized(this.pending) { this.pending.toTypedArray() }
        if (pend.isNotEmpty()) {
            val toRemove = mutableListOf<RNOAnimationTransactionSpec>()
            for (resolved in pend) {
                var resolvedView = mutableMapOf<String, RNOAnimatedView>()
                var hasAllViews = true
                for (a in resolved.animations) {
                    val view = views[a.viewKey]
                    if (view == null) {
                        if (!a.optional) {
                            hasAllViews = false
                            Log.d("ANIMATIONS", "Unable to find " + a.viewKey)
                        }
                    } else {
                        resolvedView[a.viewKey] = view
                    }
                }
                for (a in resolved.valueSets) {
                    val view = views[a.viewKey]
                    if (view == null) {
                        if (!a.optional) {
                            hasAllViews = false
                            Log.d("ANIMATIONS", "Unable to find " + a.viewKey)
                        }
                    } else {
                        resolvedView[a.viewKey] = view
                    }
                }

                if (hasAllViews) {
                    toRemove.add(resolved)
                    doAnimations(resolved, resolvedView)
                }

            }
            if (toRemove.isNotEmpty()) {
                synchronized(this.pending) {
                    for (r in toRemove) {
                        this.pending.remove(r)
                    }
                }
            }
        }
    }

    @SuppressLint("NewApi")
    private fun doAnimations(spec: RNOAnimationTransactionSpec, views: Map<String, RNOAnimatedView>) {
        for (s in spec.valueSets) {
            val view = views[s.viewKey]
            if (view != null) {
                when {
                    s.property == "opacity" -> {
                        view.alpha = s.value
                    }
                    s.property == "scale" -> {
                        view.scaleX = s.value
                        view.scaleY = s.value
                    }
                    s.property == "translateX" -> {
                        view.translationX = PixelUtil.toPixelFromDIP(s.value)
                    }
                    s.property == "translateY" -> {
                        view.translationY = PixelUtil.toPixelFromDIP(s.value)
                    }
                    s.property == "backgroundColor" && s.valueColor != null -> {
                        view.backgroundColor = s.valueColor as Int
                    }
                }
            }
        }
        var maxDuration = 0.0f
        for (a in spec.animations) {
            val view = views[a.viewKey]
            if (view != null) {

                if (a.type == RNOAnimationType.timing) {

                    when {
                        a.property == "opacity" -> {
                            view.alpha = a.from
                        }
                        a.property == "scale" -> {
                            view.scaleX = a.from
                            view.scaleY = a.from
                        }
                        a.property == "translateX" -> {
                            view.translationX = PixelUtil.toPixelFromDIP(a.from)
                        }
                        a.property == "translateY" -> {
                            view.translationY = PixelUtil.toPixelFromDIP(a.from)
                        }
                        a.property == "backgroundColor" && a.fromColor != null -> {
                            view.backgroundColor = a.fromColor as Int
                        }
                    }

                    val duration = if (a.duration != null) {
                        maxDuration = Math.max(a.duration!!, maxDuration)
                        (a.duration!! * 1000).toLong()
                    } else {
                        maxDuration = Math.max(spec.duration, maxDuration)
                        (spec.duration * 1000).toLong()
                    }

                    val inter = when {
                        a.easing.type === RNOEasingType.linear -> LinearInterpolator()
                        a.easing.type === RNOEasingType.material -> FastOutSlowInInterpolator()
                        a.easing.type === RNOEasingType.bezier -> CubicBezierInterpolator(PointF(a.easing.bezier!![0], a.easing.bezier!![1]), PointF(a.easing.bezier!![2], a.easing.bezier!![3]))
                        else -> // Fallback to linear
                            LinearInterpolator()
                    }

                    if (a.property == "backgroundColor" && a.toColor != null) {
                        val animator = ValueAnimator.ofArgb(a.fromColor as Int, a.toColor as Int)
                        animator.duration = duration
                        animator.interpolator = inter
                        animator.addUpdateListener {
                            view.backgroundColor = it.animatedValue as Int;
                        }
                        animator.start()
                    } else {
                        val rnAnim: Animator? = MakeAnimationsRenderThreadFast.fastAnimate(a.property, a.to, view)
                        if (rnAnim != null) {
                            rnAnim.duration = duration
                            rnAnim.interpolator = inter
                            rnAnim.start()
                        } else {
                            val fAnim = MakeAnimationsFast.fastAnimate(view)
                            fAnim.duration = duration
                            fAnim.interpolator = inter

                            when {
                                a.property == "opacity" -> {
                                    fAnim.alpha(a.to)
                                }
                                a.property == "scale" -> {
                                    fAnim.scaleX(a.to)
                                    fAnim.scaleY(a.to)
                                }
                                a.property == "translateX" -> {
                                    fAnim.translationX(PixelUtil.toPixelFromDIP(a.to))
                                }
                                a.property == "translateY" -> {
                                    fAnim.translationY(PixelUtil.toPixelFromDIP(a.to))
                                }
                            }
                        }
                    }
                } else if (a.type == RNOAnimationType.circular) {

                    // Set duration
                    val duration: Long
                    if (a.duration != null) {
                        duration = (a.duration!! * 1000).toLong()
                        maxDuration = Math.max(a.duration!!, maxDuration)
                    } else {
                        duration = (spec.duration * 1000).toLong()
                        maxDuration = Math.max(spec.duration, maxDuration)
                    }


                    // Create Animator
                    val animator = ViewAnimationUtils.createCircularReveal(view,
                            PixelUtil.toPixelFromDIP(a.centerX).toInt(),
                            PixelUtil.toPixelFromDIP(a.centerY).toInt(),
                            PixelUtil.toPixelFromDIP(a.from),
                            PixelUtil.toPixelFromDIP(a.to)
                    )
                    animator.duration = duration
                    animator.addListener(object : Animator.AnimatorListener {
                        override fun onAnimationRepeat(animation: Animator?) {

                        }

                        override fun onAnimationEnd(animation: Animator?) {
                            if (a.to == 0.0f) {
                                view.visibility = View.INVISIBLE
                            } else {
                                view.visibility = View.VISIBLE
                            }
                        }

                        override fun onAnimationCancel(animation: Animator?) {

                        }

                        override fun onAnimationStart(animation: Animator?) {

                        }

                    })
                    animator.setupEndValues()
                    animator.start()
                }
            }
        }

        if (spec.transactionKey != null) {
            if (spec.animations.size == 0) {
                onCompleted(spec.transactionKey!!)
            } else {
                runOnUIThread {
                    runOnUIThreadDelayed((maxDuration * 1000).toInt()) {
                        onCompleted(spec.transactionKey!!)
                    }
                }
            }
        }
    }

    private fun onCompleted(key: String) {
        Log.d("RNAnimationView", "Animation completed: $key")
        val map = WritableNativeMap()
        map.putString("key", key)
        this.reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("react_s_animation_completed", map)
    }
}