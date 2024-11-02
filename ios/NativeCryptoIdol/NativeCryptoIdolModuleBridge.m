#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(NativeCryptoIdolModule, NSObject)

RCT_EXTERN_METHOD(setupCircuitForTheModel:(NSString *)param resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

@end
