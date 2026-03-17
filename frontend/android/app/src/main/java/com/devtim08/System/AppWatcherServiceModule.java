package com.devtim08.System;

import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.os.Build;
import android.util.Log;

import java.util.Arrays;
import java.util.Map;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ReadableArray;

public class AppWatcherServiceModule extends ReactContextBaseJavaModule {

    private static final String TAG = "WATCHER";

    private final ReactApplicationContext reactContext;
    private static ReactApplicationContext staticReactContext;
    private static volatile boolean penaltyActive = false;
    private static final Set<String> restrictedApps = new HashSet<>();
    private static volatile long penaltyEndsAtMillis = 0L;
    private static volatile String backendUrl = "";
    private static volatile String authToken = "";
    private static final Set<String> ENTERTAINMENT_KEYWORDS = new HashSet<>(Arrays.asList(
            "youtube",
            "youtube music",
            "netflix",
            "disney",
            "disney+",
            "hulu",
            "prime video",
            "amazon prime",
            "max",
            "hbomax",
            "peacock",
            "paramount",
            "paramount+",
            "tubi",
            "pluto",
            "plex",
            "jellyfin",
            "viki",
            "spotify",
            "soundcloud",
            "pandora",
            "deezer",
            "audiomack",
            "tidal",
            "iheartradio",
            "tiktok",
            "musically",
            "douyin",
            "likee",
            "triller",
            "instagram",
            "facebook",
            "twitch",
            "bilibili",
            "crunchyroll",
            "funimation",
            "webtoon",
            "steam",
            "epic",
            "playstation",
            "xbox",
            "nintendo",
            "riot",
            "valorant",
            "supercell",
            "clash",
            "genshin",
            "mihoyo",
            "hoyoverse",
            "pubg",
            "call of duty",
            "among us",
            "roblox",
            "minecraft",
            "fortnite",
            "games",
            "game"));

    private static final Set<String> NON_ENTERTAINMENT_KEYWORDS = new HashSet<>(Arrays.asList(
            "message",
            "messages",
            "messaging",
            "sms",
            "mms",
            "dialer",
            "phone",
            "bixby",
            "settings",
            "calendar",
            "clock",
            "contacts",
            "gmail",
            "email",
            "files",
            "file manager",
            "x-plore",
            "explorer"));

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
        Log.i(TAG, active ? "Penalty activated" : "Penalty cleared");

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
    }

    @ReactMethod
    public void setBackendUrl(String url) {
        backendUrl = url != null ? url : "";
    }

    @ReactMethod
    public void setAuthToken(String token) {
        authToken = token != null ? token : "";
    }

    public static String getBackendUrl() {
        return backendUrl;
    }

    public static String getAuthToken() {
        return authToken;
    }

    public static void updatePenaltyState(boolean active, long endsAtMillis) {
        boolean previousActive = penaltyActive;
        long previousEndsAtMillis = penaltyEndsAtMillis;
        penaltyActive = active;
        penaltyEndsAtMillis = endsAtMillis;
        if (previousActive != active || previousEndsAtMillis != endsAtMillis) {
            Log.i(TAG, active ? "Penalty state refreshed: active" : "Penalty state refreshed: inactive");
        }
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
        Log.i(TAG, "Restricted apps updated: " + restrictedApps.size() + " packages");
    }

    @ReactMethod
    public void getForegroundApp(Promise promise) {
        promise.resolve(AppWatcherService.getCurrentForegroundApp());
    }

    @ReactMethod
    public void getEntertainmentApps(Promise promise) {
        try {
            PackageManager packageManager = reactContext.getPackageManager();

            Intent launcherIntent = new Intent(Intent.ACTION_MAIN, null);
            launcherIntent.addCategory(Intent.CATEGORY_LAUNCHER);

            List<ResolveInfo> launchableApps = packageManager.queryIntentActivities(launcherIntent, 0);
            WritableArray results = Arguments.createArray();
            Set<String> seenPackages = new HashSet<>();

            for (ResolveInfo resolveInfo : launchableApps) {
                if (resolveInfo == null || resolveInfo.activityInfo == null) {
                    continue;
                }

                String packageName = resolveInfo.activityInfo.packageName;
                if (packageName == null || packageName.isEmpty()) {
                    continue;
                }

                if (packageName.equals(reactContext.getPackageName())) {
                    continue;
                }

                if (seenPackages.contains(packageName)) {
                    continue;
                }
                seenPackages.add(packageName);

                CharSequence appLabelCs = resolveInfo.loadLabel(packageManager);
                String appName = appLabelCs != null ? appLabelCs.toString() : packageName;

                ApplicationInfo appInfo = resolveInfo.activityInfo.applicationInfo;
                int categoryCode = getAppCategoryCode(appInfo);
                String categoryLabel = mapCategoryLabel(categoryCode);

                MatchResult matchResult = getEntertainmentMatch(packageName, appName, categoryCode);
                if (!matchResult.isEntertainment) {
                    continue;
                }

                WritableMap app = Arguments.createMap();
                app.putString("packageName", packageName);
                app.putString("appName", appName);
                app.putInt("categoryCode", categoryCode);
                app.putString("category", categoryLabel);
                app.putString("matchedBy", matchResult.matchedBy);
                results.pushMap(app);
            }

            promise.resolve(results);
        } catch (Exception e) {
            Log.e(TAG, "Failed to load entertainment apps", e);
            promise.reject("ENTERTAINMENT_APPS_ERROR", "Failed to load entertainment apps", e);
        }
    }

    private int getAppCategoryCode(ApplicationInfo appInfo) {
        if (appInfo == null) {
            return ApplicationInfo.CATEGORY_UNDEFINED;
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            return appInfo.category;
        }
        return ApplicationInfo.CATEGORY_UNDEFINED;
    }

    private String mapCategoryLabel(int categoryCode) {
        switch (categoryCode) {
            case ApplicationInfo.CATEGORY_GAME:
                return "game";
            case ApplicationInfo.CATEGORY_AUDIO:
                return "audio";
            case ApplicationInfo.CATEGORY_VIDEO:
                return "video";
            case ApplicationInfo.CATEGORY_IMAGE:
                return "image";
            case ApplicationInfo.CATEGORY_SOCIAL:
                return "social";
            case ApplicationInfo.CATEGORY_NEWS:
                return "news";
            case ApplicationInfo.CATEGORY_PRODUCTIVITY:
                return "productivity";
            case ApplicationInfo.CATEGORY_ACCESSIBILITY:
                return "accessibility";
            default:
                return "undefined";
        }
    }

    private MatchResult getEntertainmentMatch(String packageName, String appName, int categoryCode) {
        // Exclude categories you requested not to include
        if (categoryCode == ApplicationInfo.CATEGORY_PRODUCTIVITY
                || categoryCode == ApplicationInfo.CATEGORY_UNDEFINED) {
            return new MatchResult(false, "none");
        }

        String packageLower = packageName.toLowerCase(Locale.ROOT);
        String nameLower = appName.toLowerCase(Locale.ROOT);

        // Exclude utility/system/messaging apps (e.g., Messages, Bixby, file managers)
        for (String keyword : NON_ENTERTAINMENT_KEYWORDS) {
            if (packageLower.contains(keyword) || nameLower.contains(keyword)) {
                return new MatchResult(false, "none");
            }
        }

        // Only accept strict entertainment categories (game, audio, video)
        // Social apps must still match an entertainment keyword after exclusions above.
        if (categoryCode == ApplicationInfo.CATEGORY_GAME
                || categoryCode == ApplicationInfo.CATEGORY_AUDIO
                || categoryCode == ApplicationInfo.CATEGORY_VIDEO) {
            return new MatchResult(true, "category");
        }

        for (String keyword : ENTERTAINMENT_KEYWORDS) {
            if (packageLower.contains(keyword) || nameLower.contains(keyword)) {
                return new MatchResult(true, "keyword");
            }
        }

        return new MatchResult(false, "none");
    }

    private static final class MatchResult {
        final boolean isEntertainment;
        final String matchedBy;

        MatchResult(boolean isEntertainment, String matchedBy) {
            this.isEntertainment = isEntertainment;
            this.matchedBy = matchedBy;
        }
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
