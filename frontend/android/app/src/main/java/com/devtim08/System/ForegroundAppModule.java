package com.devtim08.System;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class ForegroundAppModule extends ReactContextBaseJavaModule {


    public ForegroundAppModule(ReactApplicationContext reactContext) {
    super(reactContext);
    }


    @Override
    public String getName() {
        return "ForegroundAppModule";
    }

    // Expose a method to JS that returns the current foreground app
    @ReactMethod
    public void getCurrentForegroundApp(Promise promise) {
        promise.resolve(AppWatcherService.getCurrentForegroundApp());
    }


}
