package com.devtim08.System;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.util.Log;

import androidx.core.app.NotificationCompat;

import java.util.List;

public class AppWatcherService extends Service {

    private Handler handler;
    private Runnable checkRunnable;
    private Thread monitorThread;
    private volatile boolean isRunning = true;
    private static String currentForegroundApp = "";
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
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, channelName, NotificationManager.IMPORTANCE_LOW);
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

        List<UsageStats> usageStatsList = usm.queryUsageStats(UsageStatsManager.INTERVAL_BEST, startTime, endTime);
        if (usageStatsList == null) {
            Log.d("WATCHER", "usageStatsList is null! Permission may not be granted.");
            return;
        } else if (usageStatsList.isEmpty()) {
            Log.d("WATCHER", "usageStatsList is empty!");
            return;
        } else {
            Log.d("WATCHER", "Got " + usageStatsList.size() + " usage stats");
        }

        UsageStats recentApp = null;
        for (UsageStats app : usageStatsList) {
            if (recentApp == null || app.getLastTimeUsed() > recentApp.getLastTimeUsed()) {
                recentApp = app;
            }
        }

        if (recentApp != null) {
            currentForegroundApp = recentApp.getPackageName();
            Log.d("WATCHER", "Foreground app: " + currentForegroundApp);
        }
    }
}
