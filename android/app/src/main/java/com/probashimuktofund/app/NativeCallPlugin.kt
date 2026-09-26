package com.probashimuktofund.app

import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

@CapacitorPlugin(name = "NativeCall")
class NativeCallPlugin : Plugin() {

    companion object {
        var instance: NativeCallPlugin? = null
    }

    override fun load() {
        super.load()
        instance = this
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

    fun notifyCallAnswered(callId: String, callType: String) {
        val data = JSObject().apply {
            put("callId", callId)
            put("callType", callType)
        }
        notifyListeners("callAnswered", data)
    }

    fun notifyCallDeclined(callId: String) {
        val data = JSObject().apply {
            put("callId", callId)
        }
        notifyListeners("callDeclined", data)
    }
}
