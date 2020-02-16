#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(RNFAFastAnimationsManager, RCTViewManager)

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_VIEW_PROPERTY(color, UIColor)

@end
