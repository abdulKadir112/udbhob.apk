package com.probashimuktofund.app

import android.content.Intent
import android.os.Bundle
import android.webkit.PermissionRequest
import android.webkit.WebChromeClient
import com.getcapacitor.BridgeActivity

class MainActivity : BridgeActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        registerPlugin(NativeCallPlugin::class.java)
        super.onCreate(savedInstanceState)

        // Initialize Call Notification Channel
        CallNotificationManager.createNotificationChannel(this)

        // Allow WebRTC Camera & Microphone without permission blockages in WebView
        bridge?.webView?.webChromeClient = object : WebChromeClient() {
            override fun onPermissionRequest(request: PermissionRequest?) {
                request?.grant(request.resources)
            }
        }

        handleCallIntent(intent)
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
