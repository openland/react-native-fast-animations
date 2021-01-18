package com.openland.react.animations.hacks

import android.animation.Animator
import android.util.Log
import android.view.View
import com.facebook.react.uimanager.PixelUtil
import java.lang.reflect.Constructor
import java.lang.reflect.Method

object MakeAnimationsRenderThreadFast {

    private var isSupported = true
    private var rnAnimatorConstructor: Constructor<out Any>? = null
    private var setter: Method? = null

    private var translationXId: Int = 0
    private var translationYId: Int = 1
    private var alphaId: Int = 11

    init {
        try {
            val rnAnimator = MakeAnimationsFast::class.java.classLoader!!.loadClass("android.view.RenderNodeAnimator")
            rnAnimatorConstructor = rnAnimator.getConstructor(Int::class.java, Float::class.java)
            setter = rnAnimator.getDeclaredMethod("setTarget", View::class.java)

//            translationYId = rnAnimator.getField("TRANSLATION_Y").getInt(null)
//            translationXId = rnAnimator.getField("TRANSLATION_X").getInt(null)
//            alphaId = rnAnimator.getField("ALPHA").getInt(null)
        } catch (e: Exception) {
            Log.w("RNSAnimated", "Fast RT animations are not supported. Using default one")
            Log.w("RNSAnimated", e)
            isSupported = false
        }
    }

    private fun createAnimator(id: Int, to: Float, view: View): Animator? {
        return try {
            val res = rnAnimatorConstructor!!.newInstance(id, to) as Animator
            setter!!.invoke(res, view)
            res
        } catch (e: Exception) {
            Log.w("RNSAnimated", "Fast RT animations are not supported. Using default one")
            Log.w("RNSAnimated", e)
            isSupported = false
            null
        }
    }

    fun fastAnimate(key: String, to: Float, view: View): Animator? {
        if (!this.isSupported) {
            return null
        }
        if (key == "opacity") {
            return createAnimator(this.alphaId, to, view)
        }
        if (key == "translateX") {
            return createAnimator(this.translationXId, PixelUtil.toPixelFromDIP(to), view)
        }
        if (key == "translateY") {
            return createAnimator(this.translationYId, PixelUtil.toPixelFromDIP(to), view)
        }
        return null
    }
}