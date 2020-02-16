//
//  RNOAnimated-Bridge.m
//  openland
//
//  Created by Steve Kite on 9/12/18.
//  Copyright © 2018 Openland. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "RNOAnimated-Bridge.h"

@interface RCT_EXTERN_MODULE(RNOAnimatedViewManager, RCTViewManager)
RCT_EXPORT_VIEW_PROPERTY(animatedKey, NSString)
RCT_EXTERN_METHOD(animate: (NSString *)spec)
RCT_EXTERN_METHOD(hasPending: (RCTResponseSenderBlock *)callback)
@end

@interface RCT_EXTERN_MODULE(RNOAnimatedEventEmitter, RCTEventEmitter)
RCT_EXTERN_METHOD(supportedEvents)
@end
