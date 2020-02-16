package com.openland.react.animations

import android.annotation.SuppressLint
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.views.view.ReactViewGroup
import com.facebook.react.views.view.ReactViewManager

class RNOAnimatedViewViewManager : ReactViewManager() {

    companion object {
        val sharedInstance = RNOAnimatedViewViewManager()
    }

    private var manager: RNOAnimatedViewManager? = null

    override fun getName(): String {
        return "RNOAnimatedView"
    }

    override fun createViewInstance(reactContext: ThemedReactContext): RNOAnimatedView {
        return RNOAnimatedView(this, reactContext)
    }

    fun registerView(key: String, view: RNOAnimatedView) {
        this.manager!!.registerView(key, view)
    }

    fun registerViewManager(manager: RNOAnimatedViewManager) {
        this.manager = manager
    }

    @ReactProp(name = "animatedKey")
    fun setAnimatedKey(view: RNOAnimatedView, key: String) {
        view.setAnimatedKey(key)
    }
}

@SuppressLint("ViewConstructor")
class RNOAnimatedView(private val manager: RNOAnimatedViewViewManager, context: ReactContext) : ReactViewGroup(context) {

    private var animatedKey: String? = null
    private var isRegistered = false

    fun setAnimatedKey(key: String) {
        this.animatedKey = key
    }

    override fun onLayout(changed: Boolean, left: Int, top: Int, right: Int, bottom: Int) {
        super.onLayout(changed, left, top, right, bottom)
        if (!isRegistered) {
            isRegistered = true
            manager.registerView(this.animatedKey!!, this)
        }
    }
}
