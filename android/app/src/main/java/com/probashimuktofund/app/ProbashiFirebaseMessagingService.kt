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
            val body = data["body"] ?: remoteMessage.notification?.body ?: "নতুন নোটিফিকেশন"

            showGeneralNotification(title, body)
        }
    }

    private fun showGeneralNotification(title: String, body: String) {
        CallNotificationManager.createNotificationChannel(applicationContext)

        val intent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
        }
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(this, CallNotificationManager.GENERAL_CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle(title)
            .setContentText(body)
            .setAutoCancel(true)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setContentIntent(pendingIntent)
            .build()

        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.notify((System.currentTimeMillis() % 10000).toInt(), notification)
    }
}
