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
import android.os.Handler;
import android.os.Looper;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;
import android.widget.TextView;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import androidx.core.app.NotificationCompat;

public class OverlayService extends Service {

    private WindowManager windowManager;
    private View overlayView;
    private TextView penaltyTimeText;
    private long endsAtMillis = 0L;
    private Handler countdownHandler;
    private Runnable countdownRunnable;

    @Override
    public void onCreate() {
        super.onCreate();
        startForeground(1, createNotification());
        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        countdownHandler = new Handler(Looper.getMainLooper());
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String action = intent != null ? intent.getAction() : null;
        android.util.Log.d("OverlayService", "onStartCommand with action: " + action);

        if ("HIDE_OVERLAY".equals(action)) {
            hideOverlayView();
            return START_STICKY;
        }

        if (intent != null) {
            long millisExtra = intent.getLongExtra("ENDS_AT_MILLIS", 0L);
            String isoExtra = intent.getStringExtra("ENDS_AT_ISO");
            if (millisExtra > 0L) {
                endsAtMillis = millisExtra;
            } else if (isoExtra != null) {
                endsAtMillis = parseIsoToMillis(isoExtra);
            }
        }

        if (overlayView == null) {
            showOverlayView();
        } else {
            android.util.Log.d("OverlayService", "Overlay already showing");
            updatePenaltyTimeText();
        }

        return START_STICKY;
    }

    private void showOverlayView() {
        try {
            // Inflate overlay layout
            overlayView = LayoutInflater.from(this).inflate(R.layout.overlay_block, null);
            penaltyTimeText = overlayView.findViewById(R.id.penaltyTimeText);

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

            updatePenaltyTimeText();
            startCountdownUpdates();
        } catch (Exception e) {
            android.util.Log.e("OverlayService", "Error showing overlay view", e);
        }
    }

    private void hideOverlayView() {
        if (overlayView != null) {
            try {
                stopCountdownUpdates();
                windowManager.removeView(overlayView);
                overlayView = null;
                penaltyTimeText = null;
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

    private void startCountdownUpdates() {
        stopCountdownUpdates();
        countdownRunnable = new Runnable() {
            @Override
            public void run() {
                updatePenaltyTimeText();
                countdownHandler.postDelayed(this, 1000);
            }
        };
        countdownHandler.post(countdownRunnable);
    }

    private void stopCountdownUpdates() {
        if (countdownHandler != null && countdownRunnable != null) {
            countdownHandler.removeCallbacks(countdownRunnable);
        }
        countdownRunnable = null;
    }

    private void updatePenaltyTimeText() {
        if (penaltyTimeText == null) {
            return;
        }

        if (endsAtMillis <= 0L) {
            penaltyTimeText.setText("Time remaining: --:--");
            return;
        }

        long remaining = Math.max(endsAtMillis - System.currentTimeMillis(), 0L);
        penaltyTimeText.setText("Time remaining: " + formatRemaining(remaining));
    }

    private String formatRemaining(long millis) {
        long totalSeconds = millis / 1000;
        long hours = totalSeconds / 3600;
        long minutes = (totalSeconds % 3600) / 60;
        long seconds = totalSeconds % 60;

        if (hours > 0) {
            return String.format(Locale.US, "%02d:%02d:%02d", hours, minutes, seconds);
        }
        return String.format(Locale.US, "%02d:%02d", minutes, seconds);
    }

    private long parseIsoToMillis(String iso) {
        try {
            SimpleDateFormat sdfWithMillis = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSX", Locale.US);
            Date date = sdfWithMillis.parse(iso);
            if (date != null) {
                return date.getTime();
            }
        } catch (ParseException ignored) {
            // Try fallback without milliseconds
        }

        try {
            SimpleDateFormat sdfNoMillis = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssX", Locale.US);
            Date date = sdfNoMillis.parse(iso);
            return date != null ? date.getTime() : 0L;
        } catch (ParseException e) {
            android.util.Log.e("OverlayService", "Failed to parse ends_at ISO: " + iso, e);
            return 0L;
        }
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
