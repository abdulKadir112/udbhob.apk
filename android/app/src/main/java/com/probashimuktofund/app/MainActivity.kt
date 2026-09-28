package com.probashimuktofund.app

import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.view.View
import android.webkit.PermissionRequest
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.core.view.WindowCompat
import com.getcapacitor.BridgeActivity
import com.getcapacitor.BridgeWebChromeClient
import com.getcapacitor.JSObject

class MainActivity : BridgeActivity() {

    private val PERMISSIONS_REQUEST_CODE = 9999

    override fun onCreate(savedInstanceState: Bundle?) {
        registerPlugin(NativeCallPlugin::class.java)
        super.onCreate(savedInstanceState)

        // 1. Status Bar Styling: Match WhatsApp Emerald theme (#005c4b) with crisp white status icons
        WindowCompat.setDecorFitsSystemWindows(window, true)
        window.statusBarColor = android.graphics.Color.parseColor("#005c4b")
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val decorView = window.decorView
            decorView.systemUiVisibility = decorView.systemUiVisibility and View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR.inv()
        }

        // 2. Initialize Call & Notification Channels
        CallNotificationManager.createNotificationChannel(this)

        // 3. Request Audio, Camera, and Notification runtime permissions at first launch
        checkAndRequestAppPermissions()

        // 4. Configure WebView for WebRTC media streams & autoplay
        setupWebViewForMedia()

        // 5. Handle any incoming call intents
        handleCallIntent(intent)
    }

    override fun onResume() {
        super.onResume()
        setupWebViewForMedia()
    }

    private fun setupWebViewForMedia() {
        bridge?.webView?.let { webView ->
            webView.settings.apply {
                mediaPlaybackRequiresUserGesture = false
                javaScriptCanOpenWindowsAutomatically = true
                domStorageEnabled = true
                databaseEnabled = true
            }

            // Ensure WebRTC microphone and camera requests inside the WebView are granted without friction
            webView.webChromeClient = object : BridgeWebChromeClient(bridge) {
                override fun onPermissionRequest(request: PermissionRequest) {
                    runOnUiThread {
                        try {
                            request.grant(request.resources)
                        } catch (e: Exception) {
                            super.onPermissionRequest(request)
                        }
                    }
                }
            }
        }
    }

    private fun checkAndRequestAppPermissions() {
        val permissions = mutableListOf(
            android.Manifest.permission.RECORD_AUDIO,
            android.Manifest.permission.CAMERA
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
                val callData = JSObject().apply {
                    put("callId", acceptCallId)
                    put("callType", callType)
                }
                NativeCallPlugin.pendingCall = callData
                NativeCallPlugin.instance?.notifyCallAnswered(acceptCallId, callType)

                // Dispatch custom event in web view with multiple attempts in case React is still mounting
                val jsScript = """
                    (function() {
                        var event = new CustomEvent('native_accept_call', {
                            detail: { callId: '$acceptCallId', callType: '$callType' }
                        });
                        window.dispatchEvent(event);
                    })();
                """.trimIndent()

                bridge?.webView?.post {
                    bridge?.webView?.evaluateJavascript(jsScript, null)
                }
                bridge?.webView?.postDelayed({
                    bridge?.webView?.evaluateJavascript(jsScript, null)
                }, 1000)
            }
        }
    }
}
