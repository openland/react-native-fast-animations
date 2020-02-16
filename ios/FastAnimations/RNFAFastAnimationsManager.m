#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(RNSAnimatedViewManager, RCTViewManager)
RCT_EXPORT_VIEW_PROPERTY(animatedKey, NSString)
RCT_EXTERN_METHOD(animate: (NSString *)spec)
RCT_EXTERN_METHOD(hasPending: (RCTResponseSenderBlock *)callback)
@end

@interface RCT_EXTERN_MODULE(RNSAnimatedEventEmitter, RCTEventEmitter)
RCT_EXTERN_METHOD(supportedEvents)
@end
