package com.probashimuktofund.app

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.media.Ringtone
import android.media.RingtoneManager
import android.net.Uri
import android.os.Build
import android.os.PowerManager
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import androidx.core.app.NotificationCompat

object CallNotificationManager {
    const val CHANNEL_ID = "probashi_call_channel_v2"
    const val CHANNEL_NAME = "প্রবাসী মুক্ত ফান্ড কল নোটিফিকেশন"
    const val GENERAL_CHANNEL_ID = "probashi_general_channel_v2"
    const val GENERAL_CHANNEL_NAME = "প্রবাসী বার্তা ও নোটিফিকেশন"
    const val CALL_NOTIFICATION_ID = 9999

    const val ACTION_ACCEPT_CALL = "com.probashimuktofund.app.ACTION_ACCEPT_CALL"
    const val ACTION_REJECT_CALL = "com.probashimuktofund.app.ACTION_REJECT_CALL"

    private var activeRingtone: Ringtone? = null
    private var vibrator: Vibrator? = null
    private var wakeLock: PowerManager.WakeLock? = null

    fun createNotificationChannel(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

            // 1. High-Priority Call Notification Channel (Ringtone + Looping Vibration + Fullscreen Intent)
            val ringtoneUri: Uri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE)
            val callAudioAttributes = AudioAttributes.Builder()
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .setUsage(AudioAttributes.USAGE_NOTIFICATION_RINGTONE)
                .build()

            val callChannel = NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "প্রবাসী মুক্ত ফান্ড এর ইনকামিং অডিও এবং ভিডিও কলের জন্য হাই-প্রায়োরিটি নোটিফিকেশন"
                enableLights(true)
                enableVibration(true)
                vibrationPattern = longArrayOf(0, 1000, 600, 1000, 600, 1200)
                setSound(ringtoneUri, callAudioAttributes)
                lockscreenVisibility = android.app.Notification.VISIBILITY_PUBLIC
                setBypassDnd(true)
            }
            manager.createNotificationChannel(callChannel)

            // 2. High-Priority General Messaging & Announcement Notification Channel
            val notifSoundUri: Uri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
            val generalAudioAttributes = AudioAttributes.Builder()
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .setUsage(AudioAttributes.USAGE_NOTIFICATION_COMMUNICATION_INSTANT)
                .build()

            val generalChannel = NotificationChannel(
                GENERAL_CHANNEL_ID,
                GENERAL_CHANNEL_NAME,
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "প্রবাসী মুক্ত ফান্ড এর চ্যাট বার্তা ও ফান্ড নোটিফিকেশন"
                enableLights(true)
                enableVibration(true)
                vibrationPattern = longArrayOf(0, 300, 150, 300)
                setSound(notifSoundUri, generalAudioAttributes)
                lockscreenVisibility = android.app.Notification.VISIBILITY_PUBLIC
                setBypassDnd(true)
            }
            manager.createNotificationChannel(generalChannel)
        }
    }

    fun showGeneralMessageNotification(
        context: Context,
        title: String,
        body: String,
        senderId: String? = null
    ) {
        createNotificationChannel(context)

        // Wake up device screen and CPU briefly even if in Deep Sleep / Doze mode
        try {
            val powerManager = context.getSystemService(Context.POWER_SERVICE) as PowerManager
            @Suppress("DEPRECATION")
            val wakeLock = powerManager.newWakeLock(
                PowerManager.SCREEN_BRIGHT_WAKE_LOCK or
                PowerManager.ACQUIRE_CAUSES_WAKEUP or
                PowerManager.ON_AFTER_RELEASE,
                "probashi:msg_screen_wakelock"
            )
            wakeLock.acquire(5000)
        } catch (e: Exception) {
            try {
                val powerManager = context.getSystemService(Context.POWER_SERVICE) as PowerManager
                val wakeLock = powerManager.newWakeLock(
                    PowerManager.PARTIAL_WAKE_LOCK,
                    "probashi:msg_partial_wakelock"
                )
                wakeLock.acquire(5000)
            } catch (e2: Exception) {
                e2.printStackTrace()
            }
        }

        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
            senderId?.let { putExtra("DIRECT_USER_ID", it) }
        }
        val notifId = (System.currentTimeMillis() % 100000).toInt()
        val pendingIntent = PendingIntent.getActivity(
            context,
            notifId,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
        val appIcon = context.applicationInfo.icon.takeIf { it != 0 } ?: android.R.drawable.stat_notify_chat

        val notification = NotificationCompat.Builder(context, GENERAL_CHANNEL_ID)
            .setSmallIcon(appIcon)
            .setContentTitle(title)
            .setContentText(body)
            .setStyle(NotificationCompat.BigTextStyle().bigText(body))
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setCategory(NotificationCompat.CATEGORY_MESSAGE)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setDefaults(NotificationCompat.DEFAULT_ALL)
            .setSound(soundUri)
            .setVibrate(longArrayOf(0, 300, 150, 300))
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .build()

        val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.notify(notifId, notification)
    }

    fun showIncomingCallNotification(
        context: Context,
        callId: String,
        callerName: String,
        callerRole: String,
        callerCountry: String,
        callType: String,
        callerAvatar: String? = null
    ) {
        createNotificationChannel(context)

        // 1. Wake up device CPU and screen immediately from Deep Sleep
        acquireWakeLock(context)

        // 2. Start physical phone vibration and looping ringtone
        startRinging(context)

        // 3. Fullscreen Intent to open IncomingCallActivity on lockscreen
        val fullScreenIntent = Intent(context, IncomingCallActivity::class.java).apply {
            putExtra("CALL_ID", callId)
            putExtra("CALLER_NAME", callerName)
            putExtra("CALLER_ROLE", callerRole)
            putExtra("CALLER_COUNTRY", callerCountry)
            putExtra("CALL_TYPE", callType)
            putExtra("CALLER_AVATAR", callerAvatar)
            addFlags(
                Intent.FLAG_ACTIVITY_NEW_TASK or
                Intent.FLAG_ACTIVITY_CLEAR_TOP or
                Intent.FLAG_ACTIVITY_REORDER_TO_FRONT or
                Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS
            )
        }
        val fullScreenPendingIntent = PendingIntent.getActivity(
            context,
            0,
            fullScreenIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        // Accept Action Intent
        val acceptIntent = Intent(context, CallActionReceiver::class.java).apply {
            action = ACTION_ACCEPT_CALL
            putExtra("CALL_ID", callId)
            putExtra("CALL_TYPE", callType)
        }
        val acceptPendingIntent = PendingIntent.getBroadcast(
            context,
            1,
            acceptIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        // Reject Action Intent
        val rejectIntent = Intent(context, CallActionReceiver::class.java).apply {
            action = ACTION_REJECT_CALL
            putExtra("CALL_ID", callId)
        }
        val rejectPendingIntent = PendingIntent.getBroadcast(
            context,
            2,
            rejectIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val isVideo = callType.equals("video", ignoreCase = true)
        val title = if (isVideo) "📹 ইনকামিং ভিডিও কল" else "📞 ইনকামিং অডিও কল"
        val subtitle = "$callerName ($callerCountry)"

        val notificationBuilder = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.stat_sys_phone_call)
            .setContentTitle(title)
            .setContentText(subtitle)
            .setSubText("প্রবাসী মুক্ত ফান্ড")
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setCategory(NotificationCompat.CATEGORY_CALL)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setOngoing(true)
            .setAutoCancel(false)
            .setFullScreenIntent(fullScreenPendingIntent, true)
            .setContentIntent(fullScreenPendingIntent)
            .addAction(android.R.drawable.ic_menu_close_clear_cancel, "কেটে দিন", rejectPendingIntent)
            .addAction(android.R.drawable.ic_menu_call, "রিসিভ করুন", acceptPendingIntent)

        val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.notify(CALL_NOTIFICATION_ID, notificationBuilder.build())

        // Also launch activity directly to wake screen up like WhatsApp/IMO
        try {
            context.startActivity(fullScreenIntent)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun acquireWakeLock(context: Context) {
        try {
            val powerManager = context.getSystemService(Context.POWER_SERVICE) as PowerManager
            if (wakeLock == null || !wakeLock!!.isHeld) {
                @Suppress("DEPRECATION")
                wakeLock = powerManager.newWakeLock(
                    PowerManager.FULL_WAKE_LOCK or
                    PowerManager.ACQUIRE_CAUSES_WAKEUP or
                    PowerManager.ON_AFTER_RELEASE,
                    "probashi:incoming_call_wakelock"
                )
                wakeLock?.acquire(45000) // Keep awake for up to 45 seconds while ringing
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun releaseWakeLock() {
        try {
            wakeLock?.let {
                if (it.isHeld) {
                    it.release()
                }
            }
            wakeLock = null
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun startRinging(context: Context) {
        try {
            stopRinging()

            // 1. Looping Ringtone
            val alertUri: Uri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE)
            activeRingtone = RingtoneManager.getRingtone(context.applicationContext, alertUri)?.apply {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                    isLooping = true
                }
                play()
            }

            // 2. Repeated Vibration Pattern
            vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val vibratorManager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
                vibratorManager.defaultVibrator
            } else {
                @Suppress("DEPRECATION")
                context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
            }

            val pattern = longArrayOf(0, 1000, 600, 1000, 600, 1200)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator?.vibrate(VibrationEffect.createWaveform(pattern, 0))
            } else {
                @Suppress("DEPRECATION")
                vibrator?.vibrate(pattern, 0)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun stopRinging() {
        try {
            activeRingtone?.let {
                if (it.isPlaying) {
                    it.stop()
                }
            }
            activeRingtone = null
        } catch (e: Exception) {
            e.printStackTrace()
        }

        try {
            vibrator?.cancel()
            vibrator = null
        } catch (e: Exception) {
            e.printStackTrace()
        }

        releaseWakeLock()
    }

    fun dismissCall(context: Context) {
        stopRinging()
        val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.cancel(CALL_NOTIFICATION_ID)
    }
}
