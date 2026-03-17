package com.devtim08.System;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.app.usage.UsageEvents;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import org.json.JSONObject;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import androidx.core.app.NotificationCompat;

public class AppWatcherService extends Service {

    private static final String TAG = "WATCHER";

    private Thread monitorThread;
    private volatile boolean isRunning = true;
    private static String currentForegroundApp = "";
    private static String overlayShowingFor = "";
    private long lastPenaltyPollAt = 0L;
    private static final String CHANNEL_ID = "ForegroundAppWatcherChannel";

    public static String getCurrentForegroundApp() {
        return currentForegroundApp;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Log.i(TAG, "App watcher service started");
        startInForeground();

        isRunning = true;
        monitorThread = new Thread(new Runnable() {
            @Override
            public void run() {
                while (isRunning) {
                    try {
                        checkForegroundApp();
                        pollPenaltyIfNeeded();
                        Thread.sleep(1000); // Check every 1 second
                    } catch (InterruptedException e) {
                        Log.i(TAG, "App watcher thread interrupted");
                        break;
                    }
                }
                Log.i(TAG, "App watcher thread stopped");
            }
        });
        monitorThread.start();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.i(TAG, "App watcher service stopped");
        isRunning = false;
        if (monitorThread != null) {
            monitorThread.interrupt();
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    private void startInForeground() {
        String channelName = "Foreground App Watcher";
        NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, channelName,
                    NotificationManager.IMPORTANCE_LOW);
            manager.createNotificationChannel(channel);
        }

        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("SL_system Quest Tracker")
                .setContentText("Monitoring current app...")
                .setSmallIcon(android.R.drawable.ic_menu_info_details)
                .build();

        startForeground(1, notification);
    }

    private void checkForegroundApp() {
        UsageStatsManager usm = (UsageStatsManager) getSystemService(Context.USAGE_STATS_SERVICE);
        long endTime = System.currentTimeMillis();
        long startTime = endTime - 1000 * 60 * 60; // last hour

        // Prefer latest foreground event (more accurate for launcher/home)
        String eventForegroundApp = null;
        UsageEvents events = usm.queryEvents(startTime, endTime);
        UsageEvents.Event event = new UsageEvents.Event();
        while (events.hasNextEvent()) {
            events.getNextEvent(event);
            int type = event.getEventType();
            if (type == UsageEvents.Event.MOVE_TO_FOREGROUND
                    || type == UsageEvents.Event.ACTIVITY_RESUMED) {
                eventForegroundApp = event.getPackageName();
            }
        }

        if (eventForegroundApp != null) {
            String newForegroundApp = eventForegroundApp;

            if (!newForegroundApp.equals(currentForegroundApp)) {
                currentForegroundApp = newForegroundApp;
                Log.i(TAG, "Foreground app changed: " + currentForegroundApp);

                // If user just entered a restricted app, force-refresh penalty state now.
                // This prevents waiting for the 15s poll window and missing first entry.
                if (AppWatcherServiceModule.isRestrictedApp(currentForegroundApp)) {
                    pollPenaltyNow();
                }

                com.facebook.react.bridge.ReactApplicationContext reactContext = AppWatcherServiceModule
                        .getReactContext();
                if (reactContext != null) {
                    AppWatcherServiceModule.emitAppChangedEvent(reactContext, currentForegroundApp);
                }
            }

            // Native-side overlay enforcement (always evaluate)
            boolean shouldBlock = AppWatcherServiceModule.isPenaltyActive()
                    && AppWatcherServiceModule.isRestrictedApp(currentForegroundApp);
            if (shouldBlock) {
                if (!currentForegroundApp.equals(overlayShowingFor)) {
                    Log.i(TAG, "Blocking restricted app: " + currentForegroundApp);
                    Intent intent = new Intent(this, OverlayService.class);
                    intent.setAction("SHOW_OVERLAY");
                    long endsAtMillis = AppWatcherServiceModule.getPenaltyEndsAtMillis();
                    if (endsAtMillis > 0L) {
                        intent.putExtra("ENDS_AT_MILLIS", endsAtMillis);
                    }
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        startForegroundService(intent);
                    } else {
                        startService(intent);
                    }
                    overlayShowingFor = currentForegroundApp;
                }
            } else if (!overlayShowingFor.isEmpty()) {
                Log.i(TAG, "Overlay cleared for app: " + currentForegroundApp);
                Intent intent = new Intent(this, OverlayService.class);
                intent.setAction("HIDE_OVERLAY");
                startService(intent);
                overlayShowingFor = "";
            }
        }
    }

    private void pollPenaltyIfNeeded() {
        pollPenalty(false);
    }

    private void pollPenaltyNow() {
        pollPenalty(true);
    }

    private void pollPenalty(boolean force) {
        long now = System.currentTimeMillis();
        if (!force && now - lastPenaltyPollAt < 15000) {
            return;
        }
        lastPenaltyPollAt = now;

        String baseUrl = AppWatcherServiceModule.getBackendUrl();
        String token = AppWatcherServiceModule.getAuthToken();
        if (baseUrl == null || baseUrl.isEmpty() || token == null || token.isEmpty()) {
            return;
        }

        HttpURLConnection connection = null;
        try {
            URL url = new URL(baseUrl + "/penalties/active");
            connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("Authorization", "Bearer " + token);
            connection.setConnectTimeout(4000);
            connection.setReadTimeout(4000);

            int code = connection.getResponseCode();
            if (code != 200) {
                return;
            }

            BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = in.readLine()) != null) {
                response.append(line);
            }
            in.close();

            JSONObject obj = new JSONObject(response.toString());
            boolean active = obj.optBoolean("active", false);
            String endsAtIso = obj.optString("ends_at", null);
            long endsAtMillis = parseIsoToMillis(endsAtIso);

            AppWatcherServiceModule.updatePenaltyState(active, endsAtMillis);
        } catch (Exception e) {
            Log.w(TAG, "Penalty poll failed: " + e.getMessage());
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
    }

    private long parseIsoToMillis(String iso) {
        if (iso == null || iso.isEmpty())
            return 0L;
        try {
            SimpleDateFormat sdfWithMillis = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSX", Locale.US);
            Date date = sdfWithMillis.parse(iso);
            if (date != null)
                return date.getTime();
        } catch (ParseException ignored) {
        }

        try {
            SimpleDateFormat sdfNoMillis = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssX", Locale.US);
            Date date = sdfNoMillis.parse(iso);
            return date != null ? date.getTime() : 0L;
        } catch (ParseException e) {
            Log.e(TAG, "Failed to parse penalty expiration timestamp", e);
            return 0L;
        }
    }
}
