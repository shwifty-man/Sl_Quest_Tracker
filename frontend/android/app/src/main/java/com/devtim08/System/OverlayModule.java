// REQUIRED FOR OVERLAY: Native module that bridges JavaScript to OverlayService for showing/hiding overlay UI
package com.devtim08.System;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.provider.Settings;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class OverlayModule extends ReactContextBaseJavaModule {

    private static final String TAG = "OverlayModule";

    public OverlayModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "OverlayModule";
    }

    @Override
    public java.util.Map<String, Object> getConstants() {
        final java.util.Map<String, Object> constants = new java.util.HashMap<>();
        constants.put("MODULE_NAME", "OverlayModule");
        return constants;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean checkOverlayPermission() {
        try {
            return Settings.canDrawOverlays(getReactApplicationContext());
        } catch (Exception e) {
            Log.e(TAG, "Unable to check overlay permission", e);
            return false;
        }
    }

    @ReactMethod
    public void requestOverlayPermission() {
        try {
            if (!Settings.canDrawOverlays(getReactApplicationContext())) {
                Log.w(TAG, "Overlay permission missing; opening system settings");
                Intent permissionIntent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                        Uri.parse("package:" + getReactApplicationContext().getPackageName()));
                permissionIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getReactApplicationContext().startActivity(permissionIntent);
            }
        } catch (Exception e) {
            Log.e(TAG, "Unable to request overlay permission", e);
        }
    }

    @ReactMethod
    public void showOverlay() {
        try {
            ReactApplicationContext context = getReactApplicationContext();
            if (context == null) {
                Log.e(TAG, "Cannot show overlay: React context unavailable");
                return;
            }

            if (!Settings.canDrawOverlays(context)) {
                Log.w(TAG, "Overlay permission missing; opening system settings");
                Intent permissionIntent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                        Uri.parse("package:" + context.getPackageName()));
                permissionIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(permissionIntent);
                return;
            }

            Intent intent = new Intent(context, OverlayService.class);
            intent.setAction("SHOW_OVERLAY");

            context.startService(intent);
        } catch (Exception e) {
            Log.e(TAG, "Unable to show overlay", e);
        }
    }

    @ReactMethod
    public void showOverlayWithEndsAt(String endsAtIso) {
        try {
            ReactApplicationContext context = getReactApplicationContext();
            if (context == null) {
                Log.e(TAG, "Cannot show overlay: React context unavailable");
                return;
            }

            if (!Settings.canDrawOverlays(context)) {
                Log.w(TAG, "Overlay permission missing; opening system settings");
                Intent permissionIntent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                        Uri.parse("package:" + context.getPackageName()));
                permissionIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(permissionIntent);
                return;
            }

            Intent intent = new Intent(context, OverlayService.class);
            intent.setAction("SHOW_OVERLAY");
            if (endsAtIso != null) {
                intent.putExtra("ENDS_AT_ISO", endsAtIso);
            }

            context.startService(intent);
        } catch (Exception e) {
            Log.e(TAG, "Unable to show overlay with expiry timestamp", e);
        }
    }

    @ReactMethod
    public void showOverlayWithEndsAtMillis(double endsAtMillis) {
        try {
            ReactApplicationContext context = getReactApplicationContext();
            if (context == null) {
                Log.e(TAG, "Cannot show overlay: React context unavailable");
                return;
            }

            if (!Settings.canDrawOverlays(context)) {
                Log.w(TAG, "Overlay permission missing; opening system settings");
                Intent permissionIntent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                        Uri.parse("package:" + context.getPackageName()));
                permissionIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(permissionIntent);
                return;
            }

            Intent intent = new Intent(context, OverlayService.class);
            intent.setAction("SHOW_OVERLAY");
            intent.putExtra("ENDS_AT_MILLIS", (long) endsAtMillis);

            context.startService(intent);
        } catch (Exception e) {
            Log.e(TAG, "Unable to show overlay with expiry time", e);
        }
    }

    @ReactMethod
    public void hideOverlay() {
        try {
            ReactApplicationContext context = getReactApplicationContext();
            if (context == null) {
                Log.e(TAG, "Cannot hide overlay: React context unavailable");
                return;
            }

            Intent intent = new Intent(context, OverlayService.class);
            intent.setAction("HIDE_OVERLAY");
            context.stopService(intent);
        } catch (Exception e) {
            Log.e(TAG, "Unable to hide overlay", e);
        }
    }
}
