//
//  RNFastAnimation.swift
//  openland
//
//  Created by Steve Kite on 9/10/18.
//  Copyright © 2018 Openland. All rights reserved.
//

import Foundation

class RNOAnimatedView: RCTView {
  
  private weak var manager: RNOAnimatedViewManager!
  private var animatedKeyValue: String!
  private var isRegistered = false
  var sourceSize = CGSize.zero
  var sourceCenter = CGPoint.zero
  var currentScale: CGFloat = 1.0
  var currentTranslateX: CGFloat = 0.0
  var currentTranslateY: CGFloat = 0.0
  var currentWidthDelta: CGFloat = 0.0
  var currentHeightDelta: CGFloat = 0.0
  var currentBackgroundColor: UIColor = UIColor.clear
  
  init(manager: RNOAnimatedViewManager) {
    self.manager = manager
    super.init(frame: CGRect.zero)
  }
  
  required init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  // Initizliaze animated view
  @objc func setAnimatedKey(_ value: String) {
    self.animatedKeyValue = value
  }
  
  // Hack to avoid animation overwrite for opacity
  override var alpha: CGFloat {
    get {
      return super.alpha
    }
    set {
      if !isRegistered {
        super.alpha = newValue
      }
    }
  }
  
  private func viewDidLoad() {
    // Set initial state
    self.center = sourceCenter
    self.bounds = CGRect(origin: CGPoint.zero, size: sourceSize)
    
    // Register View
    if let k = self.animatedKeyValue {
      self.manager?.registerView(key: k, view: self)
    }
  }
  
  private func viewDidUpdated() {
    self.center = CGPoint(x: self.sourceCenter.x, y: self.sourceCenter.y)
    self.bounds = CGRect(origin: CGPoint.zero, size: CGSize(width: self.sourceSize.width + self.currentWidthDelta, height: self.sourceSize.height + self.currentHeightDelta))
    self.layer.position.x = self.sourceCenter.x + self.currentTranslateX
    self.layer.position.y = self.sourceCenter.y + self.currentTranslateY
  }
  
  override func reactSetFrame(_ frame: CGRect) {
    sourceCenter = CGPoint(x: frame.midX, y: frame.midY)
    sourceSize = frame.size
    
    /*
      We are registering view here because we now have size of the view to start animations
     */
    if !self.isRegistered {
      self.isRegistered = true
      self.viewDidLoad()
    } else {
      self.viewDidUpdated()
    }
  }
}
