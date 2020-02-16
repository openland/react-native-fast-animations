package ex3ndr.reactnativefastanimations.fastanimations

import android.graphics.Color
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

@ReactModule(name = FastAnimationsManager.reactClass)
class FastAnimationsManager : SimpleViewManager<FastAnimations>() {

  companion object {
    const val reactClass = "RNFAFastAnimations"
  }

  override fun getName(): String {
    return reactClass
  }

  override fun createViewInstance(reactContext: ThemedReactContext): FastAnimations {
    return FastAnimations(reactContext)
  }

  @ReactProp(name = "color", customType = "Color", defaultInt = Color.RED)
  fun setColor(view: FastAnimations, color: Int) {
    view.setColor(color)
  }
}
