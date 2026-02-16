// REQUIRED FOR OVERLAY: Native module that bridges JavaScript to OverlayService for showing/hiding overlay UI
package com.devtim08.System;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.provider.Settings;
import android.view.WindowManager;
import android.graphics.PixelFormat;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class OverlayModule extends ReactContextBaseJavaModule {

    public OverlayModule(ReactApplicationContext reactContext) {
        super(reactContext);
        android.util.Log.d("OverlayModule", "OverlayModule constructor called");
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
            boolean canDraw = android.provider.Settings.canDrawOverlays(getReactApplicationContext());
            android.util.Log.d("OverlayModule", "checkOverlayPermission: " + canDraw);
            return canDraw;
        } catch (Exception e) {
            android.util.Log.e("OverlayModule", "Error checking overlay permission", e);
            return false;
        }
    }

    @ReactMethod
    public void requestOverlayPermission() {
        try {
            if (!android.provider.Settings.canDrawOverlays(getReactApplicationContext())) {
                Intent permissionIntent = new Intent(android.provider.Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                        Uri.parse("package:" + getReactApplicationContext().getPackageName()));
                permissionIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getReactApplicationContext().startActivity(permissionIntent);
            }
        } catch (Exception e) {
            android.util.Log.e("OverlayModule", "Error requesting overlay permission", e);
        }
    }

    @ReactMethod
    public void showOverlay() {
        android.util.Log.d("OverlayModule", "[NATIVE] showOverlay() CALLED ON NATIVE SIDE");
        try {
            ReactApplicationContext context = getReactApplicationContext();
            if (context == null) {
                android.util.Log.e("OverlayModule", "[NATIVE] Context is null!");
                return;
            }

            // Check permission
            boolean canDraw = android.provider.Settings.canDrawOverlays(context);
            android.util.Log.d("OverlayModule", "[NATIVE] canDrawOverlays: " + canDraw);

            if (!canDraw) {
                android.util.Log.e("OverlayModule", "[NATIVE] No SYSTEM_ALERT_WINDOW permission - opening settings");
                Intent permissionIntent = new Intent(android.provider.Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                        Uri.parse("package:" + context.getPackageName()));
                permissionIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(permissionIntent);
                return;
            }

            android.util.Log.d("OverlayModule", "[NATIVE] Creating OverlayService intent");
            Intent intent = new Intent(context, OverlayService.class);
            intent.setAction("SHOW_OVERLAY");

            android.util.Log.d("OverlayModule", "[NATIVE] Starting foreground service");
            try {
                ContextCompat.startForegroundService(context, intent);
                android.util.Log.d("OverlayModule", "[NATIVE] startForegroundService returned successfully");
            } catch (Exception e) {
                android.util.Log.e("OverlayModule", "[NATIVE] startForegroundService failed: " + e.getMessage());
                // Fallback to regular start
                context.startService(intent);
                android.util.Log.d("OverlayModule", "[NATIVE] Fallback to startService");
            }
            android.util.Log.d("OverlayModule", "[NATIVE] showOverlay COMPLETED");
        } catch (Exception e) {
            android.util.Log.e("OverlayModule", "[NATIVE] EXCEPTION in showOverlay: " + e.getMessage(), e);
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void showOverlayWithEndsAt(String endsAtIso) {
        android.util.Log.d("OverlayModule", "[NATIVE] showOverlayWithEndsAt() called, endsAtIso=" + endsAtIso);
        try {
            ReactApplicationContext context = getReactApplicationContext();
            if (context == null) {
                android.util.Log.e("OverlayModule", "[NATIVE] Context is null!");
                return;
            }

            boolean canDraw = android.provider.Settings.canDrawOverlays(context);
            if (!canDraw) {
                android.util.Log.e("OverlayModule", "[NATIVE] No SYSTEM_ALERT_WINDOW permission - opening settings");
                Intent permissionIntent = new Intent(android.provider.Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
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

            try {
                ContextCompat.startForegroundService(context, intent);
            } catch (Exception e) {
                android.util.Log.e("OverlayModule", "[NATIVE] startForegroundService failed: " + e.getMessage());
                context.startService(intent);
            }
        } catch (Exception e) {
            android.util.Log.e("OverlayModule", "[NATIVE] EXCEPTION in showOverlayWithEndsAt: " + e.getMessage(), e);
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void showOverlayWithEndsAtMillis(double endsAtMillis) {
        android.util.Log.d("OverlayModule",
                "[NATIVE] showOverlayWithEndsAtMillis() called, endsAtMillis=" + endsAtMillis);
        try {
            ReactApplicationContext context = getReactApplicationContext();
            if (context == null) {
                android.util.Log.e("OverlayModule", "[NATIVE] Context is null!");
                return;
            }

            boolean canDraw = android.provider.Settings.canDrawOverlays(context);
            if (!canDraw) {
                android.util.Log.e("OverlayModule", "[NATIVE] No SYSTEM_ALERT_WINDOW permission - opening settings");
                Intent permissionIntent = new Intent(android.provider.Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                        Uri.parse("package:" + context.getPackageName()));
                permissionIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(permissionIntent);
                return;
            }

            Intent intent = new Intent(context, OverlayService.class);
            intent.setAction("SHOW_OVERLAY");
            intent.putExtra("ENDS_AT_MILLIS", (long) endsAtMillis);

            try {
                ContextCompat.startForegroundService(context, intent);
            } catch (Exception e) {
                android.util.Log.e("OverlayModule", "[NATIVE] startForegroundService failed: " + e.getMessage());
                context.startService(intent);
            }
        } catch (Exception e) {
            android.util.Log.e("OverlayModule", "[NATIVE] EXCEPTION in showOverlayWithEndsAtMillis: " + e.getMessage(),
                    e);
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void hideOverlay() {
        android.util.Log.d("OverlayModule", "[NATIVE] hideOverlay() CALLED ON NATIVE SIDE");
        try {
            ReactApplicationContext context = getReactApplicationContext();
            if (context == null) {
                android.util.Log.e("OverlayModule", "[NATIVE] Context is null!");
                return;
            }

            android.util.Log.d("OverlayModule", "[NATIVE] Creating OverlayService intent for stop");
            Intent intent = new Intent(context, OverlayService.class);
            intent.setAction("HIDE_OVERLAY");

            android.util.Log.d("OverlayModule", "[NATIVE] Stopping service");
            context.stopService(intent);
            android.util.Log.d("OverlayModule", "[NATIVE] hideOverlay COMPLETED");
        } catch (Exception e) {
            android.util.Log.e("OverlayModule", "[NATIVE] EXCEPTION in hideOverlay: " + e.getMessage(), e);
            e.printStackTrace();
        }
    }
}
