package com.probashimuktofund.app

import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.google.firebase.messaging.FirebaseMessaging

@CapacitorPlugin(name = "NativeCall")
class NativeCallPlugin : Plugin() {

    companion object {
        var instance: NativeCallPlugin? = null
        var pendingCall: JSObject? = null
    }

    override fun load() {
        super.load()
        instance = this
    }

    @PluginMethod
    fun getFcmToken(call: PluginCall) {
        try {
            FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    val token = task.result
                    val ret = JSObject().apply {
                        put("success", true)
                        put("token", token)
                    }
                    call.resolve(ret)
                } else {
                    val ret = JSObject().apply {
                        put("success", false)
                        put("error", task.exception?.localizedMessage ?: "Failed to get FCM token")
                    }
                    call.resolve(ret)
                }
            }
        } catch (e: Exception) {
            val ret = JSObject().apply {
                put("success", false)
                put("error", e.localizedMessage)
            }
            call.resolve(ret)
        }
    }

    @PluginMethod
    fun getPendingCallIntent(call: PluginCall) {
        val pending = pendingCall
        pendingCall = null
        val ret = JSObject().apply {
            put("hasPendingCall", pending != null)
            if (pending != null) {
                put("callId", pending.getString("callId"))
                put("callType", pending.getString("callType") ?: "audio")
            }
        }
        call.resolve(ret)
    }

    @PluginMethod
    fun showIncomingCall(call: PluginCall) {
        val callId = call.getString("callId") ?: ""
        val callerName = call.getString("callerName") ?: "প্রবাসী সদস্য"
        val callerRole = call.getString("callerRole") ?: "member"
        val callerCountry = call.getString("callerCountry") ?: "সৌদি আরব"
        val callType = call.getString("callType") ?: "audio"
        val callerAvatar = call.getString("callerAvatar")

        CallNotificationManager.showIncomingCallNotification(
            context = context,
            callId = callId,
            callerName = callerName,
            callerRole = callerRole,
            callerCountry = callerCountry,
            callType = callType,
            callerAvatar = callerAvatar
        )

        val ret = JSObject().apply {
            put("success", true)
            put("callId", callId)
        }
        call.resolve(ret)
    }

    @PluginMethod
    fun endCall(call: PluginCall) {
        CallNotificationManager.dismissCall(context)
        val ret = JSObject().apply {
            put("success", true)
        }
        call.resolve(ret)
    }

    @PluginMethod
    fun updateSession(call: PluginCall) {
        val memberId = call.getString("memberId") ?: ""
        val fundId = call.getString("fundId") ?: "fund-main"
        val name = call.getString("name") ?: ""
        val username = call.getString("username") ?: ""
        val role = call.getString("role") ?: "member"
        val isAdmin = call.getBoolean("isAdmin", false) ?: false

        try {
            ProbashiRealtimeCallService.updateSession(
                context = context,
                memberId = memberId,
                fundId = fundId,
                name = name,
                username = username,
                role = role,
                isAdmin = isAdmin
            )
            val ret = JSObject().apply {
                put("success", true)
                put("serviceRunning", true)
            }
            call.resolve(ret)
        } catch (e: Exception) {
            val ret = JSObject().apply {
                put("success", false)
                put("error", e.localizedMessage)
            }
            call.resolve(ret)
        }
    }

    @PluginMethod
    fun setAudioMode(call: PluginCall) {
        val isCallActive = call.getBoolean("isCallActive", false) ?: false
        try {
            val audioManager = context.getSystemService(android.content.Context.AUDIO_SERVICE) as? android.media.AudioManager
            audioManager?.let { am ->
                if (isCallActive) {
                    am.mode = android.media.AudioManager.MODE_IN_COMMUNICATION
                    am.isSpeakerphoneOn = true
                } else {
                    am.mode = android.media.AudioManager.MODE_NORMAL
                    am.isSpeakerphoneOn = false
                }
            }
            val ret = JSObject().apply {
                put("success", true)
            }
            call.resolve(ret)
        } catch (e: Exception) {
            val ret = JSObject().apply {
                put("success", false)
                put("error", e.localizedMessage)
            }
            call.resolve(ret)
        }
    }

    @PluginMethod
    fun setSpeakerphoneOn(call: PluginCall) {
        val enabled = call.getBoolean("enabled", true) ?: true
        try {
            val audioManager = context.getSystemService(android.content.Context.AUDIO_SERVICE) as? android.media.AudioManager
            audioManager?.isSpeakerphoneOn = enabled
            val ret = JSObject().apply {
                put("success", true)
            }
            call.resolve(ret)
        } catch (e: Exception) {
            val ret = JSObject().apply {
                put("success", false)
                put("error", e.localizedMessage)
            }
            call.resolve(ret)
        }
    }

    @PluginMethod
    fun startBackgroundService(call: PluginCall) {
        try {
            ProbashiRealtimeCallService.start(context)
            val ret = JSObject().apply {
                put("success", true)
            }
            call.resolve(ret)
        } catch (e: Exception) {
            val ret = JSObject().apply {
                put("success", false)
                put("error", e.localizedMessage)
            }
            call.resolve(ret)
        }
    }

    fun notifyCallAnswered(callId: String, callType: String) {
        val data = JSObject().apply {
            put("callId", callId)
            put("callType", callType)
        }
        pendingCall = data
        notifyListeners("callAnswered", data)
    }

    fun notifyCallDeclined(callId: String) {
        val data = JSObject().apply {
            put("callId", callId)
        }
        notifyListeners("callDeclined", data)
    }

    fun notifyTokenRefreshed(token: String) {
        val data = JSObject().apply {
            put("token", token)
        }
        notifyListeners("tokenRefreshed", data)
    }
}
