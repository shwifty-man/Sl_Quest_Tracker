package com.devtim08.System;

import android.content.Intent;
import android.os.Build;

import java.util.Map;
import java.util.HashMap;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class AppWatcherServiceModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private static ReactApplicationContext staticReactContext;

    public AppWatcherServiceModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
        staticReactContext = context;
    }

    @Override
    public String getName() {
        return "AppWatcherServiceModule";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("MODULE_NAME", "OverlayModule");
        return constants;
    }

    public void addListener(String eventName) {
        // RN requires this stub
    }

    public void removeListeners(int count) {
        // RN requires this stub
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

    public static void emitAppChangedEvent(ReactApplicationContext context, String packageName) {
        WritableMap params = Arguments.createMap();
        params.putString("packageName", packageName);
        context
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("onAppChanged", params);
    }

    public static ReactApplicationContext getReactContext() {
        return staticReactContext;
    }
}
