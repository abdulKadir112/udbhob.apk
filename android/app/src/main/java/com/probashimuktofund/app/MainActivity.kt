package com.probashimuktofund.app

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.PowerManager
import android.provider.Settings
import android.view.View
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.getcapacitor.BridgeActivity

class MainActivity : BridgeActivity() {

    private val PERMISSIONS_REQUEST_CODE = 9999

    override fun onCreate(savedInstanceState: Bundle?) {
        registerPlugin(NativeCallPlugin::class.java)
        super.onCreate(savedInstanceState)

        // 1. Status Bar Styling: Match WhatsApp Emerald theme (#005c4b) with crisp white status icons
        window.statusBarColor = android.graphics.Color.parseColor("#005c4b")
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val decorView = window.decorView
            decorView.systemUiVisibility = decorView.systemUiVisibility and View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR.inv()
        }

        // 2. Safe Area Insets: Ensure the app content leaves room for the mobile status bar / notch
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(android.R.id.content)) { view, insets ->
            val statusBarInsets = insets.getInsets(WindowInsetsCompat.Type.statusBars())
            view.setPadding(0, statusBarInsets.top, 0, 0)
            insets
        }

        // 3. Initialize Call Notification Channel
        CallNotificationManager.createNotificationChannel(this)

        // 4. Request Audio, Camera, and Notification permissions at launch
        checkAndRequestAppPermissions()

        // 5. Request Battery Optimization Exemption for 24/7 Deep Sleep Calling like WhatsApp/IMO
        requestBatteryOptimizationExemption()

        handleCallIntent(intent)
    }

    private fun checkAndRequestAppPermissions() {
        val permissions = mutableListOf(
            android.Manifest.permission.RECORD_AUDIO,
            android.Manifest.permission.CAMERA,
            android.Manifest.permission.MODIFY_AUDIO_SETTINGS
        )
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            permissions.add(android.Manifest.permission.POST_NOTIFICATIONS)
        }

        val needed = permissions.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }

        if (needed.isNotEmpty()) {
            ActivityCompat.requestPermissions(this, needed.toTypedArray(), PERMISSIONS_REQUEST_CODE)
        }
    }

    private fun requestBatteryOptimizationExemption() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            try {
                val powerManager = getSystemService(Context.POWER_SERVICE) as PowerManager
                if (!powerManager.isIgnoringBatteryOptimizations(packageName)) {
                    val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS).apply {
                        data = Uri.parse("package:$packageName")
                    }
                    startActivity(intent)
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        handleCallIntent(intent)
    }

    private fun handleCallIntent(intent: Intent?) {
        intent?.let {
            val acceptCallId = it.getStringExtra("AUTO_ACCEPT_CALL_ID")
            val callType = it.getStringExtra("AUTO_ACCEPT_CALL_TYPE") ?: "audio"
            if (!acceptCallId.isNullOrEmpty()) {
                NativeCallPlugin.instance?.notifyCallAnswered(acceptCallId, callType)

                // Also trigger custom event in web view
                val jsScript = """
                    window.dispatchEvent(new CustomEvent('native_accept_call', {
                        detail: { callId: '$acceptCallId', callType: '$callType' }
                    }));
                """.trimIndent()
                bridge?.webView?.post {
                    bridge?.webView?.evaluateJavascript(jsScript, null)
                }
            }
        }
    }
}
