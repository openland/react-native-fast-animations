package com.openland.react.animations.hacks

import android.util.Log
import android.view.View
import android.view.ViewPropertyAnimator
import java.lang.reflect.Constructor
import java.lang.reflect.Field

object MakeAnimationsFast {

    private var backendField: Field? = null
    private var animatorClazz: Class<*>? = null
    private var animatorConstructor: Constructor<*>? = null
    private var isSupported = true

    init {
        try {
            backendField = ViewPropertyAnimator::class.java.declaredFields.find { it.name === "mRTBackend" }!!
            backendField!!.isAccessible = true
            animatorClazz = MakeAnimationsFast::class.java.classLoader.loadClass("android.view.ViewPropertyAnimatorRT")
            if (animatorClazz!!.declaredConstructors.size != 1) {
                throw Exception("Unexpected number of constructors in ViewPropertyAnimatorRT")
            }
            animatorConstructor = animatorClazz!!.declaredConstructors[0]
            animatorConstructor!!.isAccessible = true
        } catch (e: Exception) {
            Log.w("RNSAnimated", "Fast animations are not supported. Using default one")
            Log.w("RNSAnimated", e)
            isSupported = false
        }
    }

    fun fastAnimate(view: View): ViewPropertyAnimator {
        val realAnimator = view.animate()

        if (isSupported) {
            try {
                // Do not try to overwrite animator
                if (backendField!!.get(realAnimator) == null) {

                    // Create new animator for view
                    val animator = animatorConstructor!!.newInstance(view)

                    // Set animator for view
                    backendField!!.set(realAnimator, animator)
                }
            } catch (e: Exception) {
                Log.w("RNSAnimated", "Unable to create native animator")
                Log.w("RNSAnimated", e)
                isSupported = false
            }
        }

        return realAnimator
    }
}