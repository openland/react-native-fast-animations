import Foundation

@objc (RNFAFastAnimationsManager)
class FastAnimationsManager: RCTViewManager {

  override func view() -> UIView! {
    return FastAnimations()
  }
}
