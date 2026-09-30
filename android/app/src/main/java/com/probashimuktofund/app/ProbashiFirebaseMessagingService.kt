package com.probashimuktofund.app

import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class ProbashiFirebaseMessagingService : FirebaseMessagingService() {

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        NativeCallPlugin.instance?.notifyTokenRefreshed(token)
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)

        val data = remoteMessage.data
        val messageType = data["type"] ?: data["action"] ?: "notification"
        val isCall = messageType == "incoming_call" || data["isCall"] == "true" || data["action"] == "incoming_call"

        if (isCall) {
            val callId = data["callId"] ?: data["call_id"] ?: ""
            val callerName = data["callerName"] ?: data["caller_name"] ?: "প্রবাসী সদস্য"
            val callerRole = data["callerRole"] ?: data["caller_role"] ?: "member"
            val callerCountry = data["callerCountry"] ?: data["caller_country"] ?: "প্রবাসী"
            val callType = data["callType"] ?: data["call_type"] ?: "audio"
            val callerAvatar = data["callerAvatar"] ?: data["caller_avatar"]

            CallNotificationManager.showIncomingCallNotification(
                context = applicationContext,
                callId = callId,
                callerName = callerName,
                callerRole = callerRole,
                callerCountry = callerCountry,
                callType = callType,
                callerAvatar = callerAvatar
            )
        } else {
            // Standard notification (payment approved, chat message, announcement, etc.)
            val title = data["title"] ?: remoteMessage.notification?.title ?: "প্রবাসী মুক্ত ফান্ড"
            val body = data["body"] ?: remoteMessage.notification?.body ?: "নতুন বার্তা এসেছে"
            val senderId = data["senderId"] ?: data["sender_id"]

            CallNotificationManager.showGeneralMessageNotification(
                context = applicationContext,
                title = title,
                body = body,
                senderId = senderId
            )
        }
    }
}
