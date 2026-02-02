package com.devtim08.System;

import android.content.Intent;
import android.os.Build;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class AppWatcherServiceModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public AppWatcherServiceModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    @Override
    public String getName() {
        return "AppWatcherServiceModule";
    }

    @ReactMethod
    public void startService() {
        Intent serviceIntent = new Intent(reactContext, AppWatcherService.class);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            reactContext.startForegroundService(serviceIntent);
        } else {
            reactContext.startService(serviceIntent);
        }
    }

    @ReactMethod
    public void getForegroundApp(Promise promise) {
        promise.resolve(AppWatcherService.getCurrentForegroundApp());
    }
}

