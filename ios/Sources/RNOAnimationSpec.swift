//
//  RNFastAnimationSpec.swift
//  openland
//
//  Created by Steve Kite on 9/10/18.
//  Copyright © 2018 Openland. All rights reserved.
//

import Foundation
import SwiftyJSON

class RNOAnimationTransactionSpec {
  
  static func parse(spec: String) -> RNOAnimationTransactionSpec {
    let src = JSON(parseJSON: spec)
    let res = RNOAnimationTransactionSpec()
    if let transactionKey = src["transactionKey"].string {
      res.transactionKey = transactionKey
    }
    if let duration = src["duration"].double {
      res.duration = duration
    }
    if let animations = src["animations"].array {
      res.animations = animations.map { (anim) -> RNOAnimationSpec in
        let aspec = RNOAnimationSpec()
      
        // Type and View
        aspec.type = RNOAnimationType(rawValue: anim["type"].stringValue)!
        aspec.viewKey = anim["view"].string!
        aspec.property = anim["prop"].string!
        aspec.to = CGFloat(anim["to"].double!)
        aspec.from = CGFloat(anim["from"].double!)
        
        // Duration
        if let duration = anim["duration"].double {
          aspec.duration = duration
        }
        
        if let delay = anim["delay"].double {
          aspec.delay = delay
        }
        
        if let velocity = anim["velocity"].double {
          aspec.velocity = CGFloat(velocity)
        }
        
        // Can we ignore this animation if view is missing?
        if let optional = anim["optional"].bool {
          aspec.optional = optional
        }
        
        return aspec
      }
    }
    if let valueSets = src["valueSetters"].array {
      res.valueSets = valueSets.map({ (s) -> RNOValueSetSpec in
        let aspec = RNOValueSetSpec()
        aspec.viewKey = s["view"].string!
        aspec.property = s["prop"].string!
        aspec.value = CGFloat(s["to"].double!)
        
        // Can we ignore this animation if view is missing?
        if let optional = s["optional"].bool {
          aspec.optional = optional
        }
        
        return aspec
      })
    }
    return res
  }
  
  var transactionKey: String?
  var animations: [RNOAnimationSpec] = []
  var valueSets: [RNOValueSetSpec] = []
  var duration: Double = 0.3
}

enum RNOAnimationType: String {
  case spring = "spring"
  case timing = "timing"
}

class RNOValueSetSpec {
  var viewKey: String!
  var property: String!
  var value: CGFloat!
  var optional: Bool = false
}

class RNOAnimationSpec {
  var type: RNOAnimationType!
  var viewKey: String!
  var property: String!
  var to: CGFloat!
  var from: CGFloat!
  var velocity: CGFloat?
  
  var duration: Double?
  var delay: Double?
  var optional: Bool = false
}
