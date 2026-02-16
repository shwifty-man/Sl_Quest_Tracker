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

import androidx.core.app.NotificationCompat;

public class AppWatcherService extends Service {

    private Thread monitorThread;
    private volatile boolean isRunning = true;
    private static String currentForegroundApp = "";
    private static String overlayShowingFor = "";
    private static final String CHANNEL_ID = "ForegroundAppWatcherChannel";

    public static String getCurrentForegroundApp() {
        return currentForegroundApp;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d("WATCHER", "Service onCreate called");
        startInForeground();

        isRunning = true;
        monitorThread = new Thread(new Runnable() {
            @Override
            public void run() {
                while (isRunning) {
                    try {
                        checkForegroundApp();
                        Thread.sleep(1000); // Check every 1 second
                    } catch (InterruptedException e) {
                        Log.e("WATCHER", "Monitor thread interrupted", e);
                        break;
                    }
                }
                Log.d("WATCHER", "Monitor thread stopped");
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
        Log.d("WATCHER", "Service onDestroy called");
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
            Log.d("WATCHER", "UsageEvents top app: " + newForegroundApp + " (current: " + currentForegroundApp + ")");

            if (!newForegroundApp.equals(currentForegroundApp)) {
                currentForegroundApp = newForegroundApp;
                Log.d("WATCHER", "Foreground app changed to: " + currentForegroundApp);
                com.facebook.react.bridge.ReactApplicationContext reactContext = AppWatcherServiceModule
                        .getReactContext();
                if (reactContext != null) {
                    Log.d("WATCHER", "Emitting onAppChanged event");
                    AppWatcherServiceModule.emitAppChangedEvent(reactContext, currentForegroundApp);
                }
            }

            // Native-side overlay enforcement (always evaluate)
            boolean shouldBlock = AppWatcherServiceModule.isPenaltyActive()
                    && AppWatcherServiceModule.isRestrictedApp(currentForegroundApp);
            if (shouldBlock) {
                if (!currentForegroundApp.equals(overlayShowingFor)) {
                    Log.d("WATCHER", "Showing overlay for: " + currentForegroundApp);
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
                Log.d("WATCHER", "Hiding overlay (not restricted/penalty) for: " + currentForegroundApp);
                Intent intent = new Intent(this, OverlayService.class);
                intent.setAction("HIDE_OVERLAY");
                startService(intent);
                overlayShowingFor = "";
            }
        }
    }
}
