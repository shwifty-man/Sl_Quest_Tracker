// REQUIRED FOR OVERLAY: Foreground service that creates and manages the overlay view displayed on top of blocked apps
package com.devtim08.System;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.IBinder;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;

import androidx.core.app.NotificationCompat;

public class OverlayService extends Service {

    private WindowManager windowManager;
    private View overlayView;

    @Override
    public void onCreate() {
        super.onCreate();
        startForeground(1, createNotification());
        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String action = intent != null ? intent.getAction() : null;
        android.util.Log.d("OverlayService", "onStartCommand with action: " + action);

        if ("HIDE_OVERLAY".equals(action)) {
            hideOverlayView();
            return START_STICKY;
        }

        if (overlayView == null) {
            showOverlayView();
        } else {
            android.util.Log.d("OverlayService", "Overlay already showing");
        }

        return START_STICKY;
    }

    private void showOverlayView() {
        try {
            // Inflate overlay layout
            overlayView = LayoutInflater.from(this).inflate(R.layout.overlay_block, null);

            // Window type
            int type = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
                    ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
                    : WindowManager.LayoutParams.TYPE_PHONE;

            // Layout params - overlay displays on top but doesn't block system input
            WindowManager.LayoutParams params = new WindowManager.LayoutParams(
                    WindowManager.LayoutParams.MATCH_PARENT,
                    WindowManager.LayoutParams.MATCH_PARENT,
                    type,
                    WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL
                            | WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE
                            | WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
                    PixelFormat.TRANSLUCENT);

            // Add the view to WindowManager
            windowManager.addView(overlayView, params);
            android.util.Log.d("OverlayService", "Overlay view added");
        } catch (Exception e) {
            android.util.Log.e("OverlayService", "Error showing overlay view", e);
        }
    }

    private void hideOverlayView() {
        if (overlayView != null) {
            try {
                windowManager.removeView(overlayView);
                overlayView = null;
                android.util.Log.d("OverlayService", "Overlay view removed");
            } catch (Exception e) {
                android.util.Log.e("OverlayService", "Error removing overlay view", e);
            }
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        hideOverlayView();
        android.util.Log.d("OverlayService", "Service destroyed");
    }

    private Notification createNotification() {
        String channelId = "overlay_channel";

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    channelId, "Overlay Service",
                    NotificationManager.IMPORTANCE_LOW);
            getSystemService(NotificationManager.class).createNotificationChannel(channel);
        }

        return new NotificationCompat.Builder(this, channelId)
                .setContentTitle("Penalty Active")
                .setContentText("Blocking apps")
                .setSmallIcon(android.R.drawable.ic_dialog_alert)
                .build();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
