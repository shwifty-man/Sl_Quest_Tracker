package com.devtim08.System;

import android.content.Intent;
import android.os.Build;
import android.util.Log;

import java.util.Map;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ReadableArray;

public class AppWatcherServiceModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private static ReactApplicationContext staticReactContext;
    private static volatile boolean penaltyActive = false;
    private static final Set<String> restrictedApps = new HashSet<>();
    private static volatile long penaltyEndsAtMillis = 0L;

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

    @ReactMethod
    public void addListener(String eventName) {
        // RN requires this stub
    }

    @ReactMethod
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
    public void setPenaltyActive(boolean active) {
        penaltyActive = active;
        Log.d("WATCHER", "Penalty active set to: " + active);

        String currentApp = AppWatcherService.getCurrentForegroundApp();
        boolean shouldBlock = active && isRestrictedApp(currentApp);
        Intent intent = new Intent(reactContext, OverlayService.class);

        if (shouldBlock) {
            intent.setAction("SHOW_OVERLAY");
            if (penaltyEndsAtMillis > 0L) {
                intent.putExtra("ENDS_AT_MILLIS", penaltyEndsAtMillis);
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                reactContext.startForegroundService(intent);
            } else {
                reactContext.startService(intent);
            }
        } else {
            intent.setAction("HIDE_OVERLAY");
            reactContext.startService(intent);
        }
    }

    @ReactMethod
    public void setPenaltyEndsAtMillis(double endsAtMillis) {
        penaltyEndsAtMillis = (long) endsAtMillis;
        Log.d("WATCHER", "Penalty endsAtMillis set to: " + penaltyEndsAtMillis);
    }

    @ReactMethod
    public void setRestrictedApps(ReadableArray apps) {
        restrictedApps.clear();
        if (apps != null) {
            for (int i = 0; i < apps.size(); i++) {
                String pkg = apps.getString(i);
                if (pkg != null && !pkg.isEmpty()) {
                    restrictedApps.add(pkg);
                }
            }
        }
        Log.d("WATCHER", "Restricted apps updated: " + restrictedApps);
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

    public static boolean isPenaltyActive() {
        return penaltyActive;
    }

    public static boolean isRestrictedApp(String packageName) {
        return restrictedApps.contains(packageName);
    }

    public static long getPenaltyEndsAtMillis() {
        return penaltyEndsAtMillis;
    }

    public static ReactApplicationContext getReactContext() {
        return staticReactContext;
    }
}
