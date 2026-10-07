// REQUIRED FOR OVERLAY: Service that creates and manages the overlay view displayed on top of blocked apps
package com.devtim08.System;

import android.app.Service;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.IBinder;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;
import android.widget.TextView;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class OverlayService extends Service {

    private static final String TAG = "OverlayService";

    private WindowManager windowManager;
    private View overlayView;
    private TextView penaltyTimeText;
    private long endsAtMillis = 0L;
    private Handler countdownHandler;
    private Runnable countdownRunnable;

    @Override
    public void onCreate() {
        // Not a foreground service: AppWatcherService already keeps the process in the
        // foreground, and starting an FGS from the background crashes on Android 12+.
        super.onCreate();
        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        countdownHandler = new Handler(Looper.getMainLooper());
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String action = intent != null ? intent.getAction() : null;

        if ("HIDE_OVERLAY".equals(action)) {
            hideOverlayView();
            stopSelf();
            return START_NOT_STICKY;
        }

        if (!Settings.canDrawOverlays(this)) {
            android.util.Log.w(TAG, "Overlay permission missing; not showing overlay");
            stopSelf();
            return START_NOT_STICKY;
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
            updatePenaltyTimeText();
        }

        // Don't let the system recreate the overlay from a null intent after a kill.
        return START_NOT_STICKY;
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

            // Layout params - full-screen overlay that swallows touches to the app underneath
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
            android.util.Log.i(TAG, "Overlay displayed");

            updatePenaltyTimeText();
            startCountdownUpdates();
        } catch (Exception e) {
            android.util.Log.e(TAG, "Failed to display overlay", e);
            overlayView = null;
            penaltyTimeText = null;
            stopSelf();
        }
    }

    private void hideOverlayView() {
        if (overlayView != null) {
            try {
                stopCountdownUpdates();
                windowManager.removeView(overlayView);
                overlayView = null;
                penaltyTimeText = null;
                android.util.Log.i(TAG, "Overlay dismissed");
            } catch (Exception e) {
                android.util.Log.e(TAG, "Failed to dismiss overlay", e);
            }
        }
    }

    @Override
    public void onDestroy() {
        hideOverlayView();
        super.onDestroy();
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
        if (remaining <= 0L) {
            penaltyTimeText.setText("Time remaining: 00:00");
            hideOverlayView();
            stopSelf();
            return;
        }
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
            android.util.Log.e(TAG, "Failed to parse penalty expiration timestamp", e);
            return 0L;
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
