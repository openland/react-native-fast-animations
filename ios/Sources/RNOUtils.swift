//
//  RNSUtils.swift
//  openland
//
//  Created by Steve Kite on 9/12/18.
//  Copyright © 2018 Openland. All rights reserved.
//

import Foundation

/*
 * Get animation slowdown coeficient in simulator to support "Slow Animations" mode.
 */
#if targetEnvironment(simulator)
@_silgen_name("UIAnimationDragCoefficient") func UIAnimationDragCoefficient() -> Float
#endif

/*
 * Resolving actual animation duration
 */
func resolveDuration(source: Double) -> Double {
  #if targetEnvironment(simulator)
  return source * Double(UIAnimationDragCoefficient())
  #else
  return source
  #endif
}

func lock(_ obj: AnyObject, blk:() -> ()) {
  objc_sync_enter(obj)
  blk()
  objc_sync_exit(obj)
}

private class WeakBox {
  weak var value: AnyObject?
  init(value: AnyObject) {
    self.value = value
  }
}

class WeakMap<V> {
  private let cacheSync = DispatchQueue(label: "weakmap")
  private var cache: [String: WeakBox] = [:]
  
  func get(key: String) -> V? {
    var res: V? = nil
    self.cacheSync.sync {
      let ex = self.cache[key]
      if ex != nil {
        let v = ex!.value
        if v != nil {
          res = v! as! V
        } else {
          self.cache.removeValue(forKey: key)
        }
      }
    }
    return res
  }
  
  func set(key: String, value: V) {
    self.cacheSync.sync {
      self.cache[key] = WeakBox(value: value as! AnyObject)
    }
  }
  
  func remove(key: String) {
    self.cacheSync.sync {
      self.cache.removeValue(forKey: key)
    }
  }
  
  func all() -> [(key: String, value: V)] {
    var res: [(key: String, value: V)] = []
    self.cacheSync.sync {
      for kv in self.cache {
        let value = kv.value.value
        if value != nil {
          res.append((kv.key, value! as! V))
        }
      }
    }
    return res
  }
  
  func clear() {
    self.cacheSync.sync {
      self.cache.removeAll()
    }
  }
}

func resolveColorR(_ rgbValue: UInt64) -> UIColor {  
  // &  binary AND operator to zero out other color values
  // >>  bitwise right shift operator
  // Divide by 0xFF because UIColor takes CGFloats between 0.0 and 1.0
  
  let red =   CGFloat((rgbValue & 0xFF0000) >> 16) / 0xFF
  let green = CGFloat((rgbValue & 0x00FF00) >> 8) / 0xFF
  let blue =  CGFloat(rgbValue & 0x0000FF) / 0xFF
  let alpha = CGFloat((rgbValue & 0xFF000000) >> 24) / 0xFF
  
  return UIColor(red: red, green: green, blue: blue, alpha: alpha)
}
