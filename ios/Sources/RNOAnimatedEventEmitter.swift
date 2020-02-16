//
//  RNSAnimatedEventEmitter.swift
//  openland
//
//  Created by Steve Kite on 9/14/18.
//  Copyright © 2018 Openland. All rights reserved.
//

import Foundation

@objc(RNOAnimatedEventEmitter)
class RNOAnimatedEventEmitter: RCTEventEmitter {
  
  private static let sharedInstanceQueue = DispatchQueue(label: "RNOAnimatedEventEmitter-lock")
  public static var sharedInstance: RNOAnimatedEventEmitter!
  
  override init() {
    super.init()
  }
  
  override func startObserving() {
    RNOAnimatedEventEmitter.sharedInstance = self
  }
  
//
//  No need to unregister since it is already overwrited by startObserving call
//
//  override func stopObserving() {
//    if RNOAnimatedEventEmitter.sharedInstance == self {
//        RNOAnimatedEventEmitter.sharedInstance = nil
//    }
//  }
  
  func onAnimationCompleted(key: String) {
    var dict:[String:Any] = [:]
    dict["key"] = key
    if self.bridge != nil {
      self.sendEvent(withName: "onAnimationCompleted", body: dict)
    }
  }
  
  override func supportedEvents() -> [String]! {
    return ["onAnimationCompleted"]
  }

  static override func requiresMainQueueSetup() -> Bool {
    return false
  }
}
