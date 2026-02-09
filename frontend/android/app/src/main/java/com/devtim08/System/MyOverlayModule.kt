package com.devtim08.System

import android.content.Context
import android.graphics.PixelFormat
import android.view.WindowManager
import android.widget.TextView
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class MyOverlayModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "MyOverlayModule"

    @ReactMethod
    fun showOverlay() {
        val activity = reactApplicationContext.currentActivity
        if (activity == null) {
            return
        }

        val wm = activity.getSystemService(Context.WINDOW_SERVICE) as? WindowManager
        if (wm == null) {
            return
        }

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        )

        val view = TextView(activity)
        view.text = "Overlay Active"

        wm.addView(view, params)
    }
}
