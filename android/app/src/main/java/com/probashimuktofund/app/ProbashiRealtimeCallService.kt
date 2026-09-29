package com.probashimuktofund.app

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.core.app.ServiceCompat
import com.google.firebase.firestore.DocumentChange
import com.google.firebase.firestore.ListenerRegistration

/**
 * Native Android Foreground Service that maintains a persistent real-time connection
 * directly with Firebase Firestore (multi-database instance).
 *
 * This ensures that even when the app is in background, minimized, phone in deep sleep / screen off,
 * incoming calls and chat messages are received instantly with real physical ringtone,
 * wake lock, and lock screen UI.
 */
class ProbashiRealtimeCallService : Service() {

    companion object {
        private const val TAG = "ProbashiRealtimeService"
        const val SERVICE_CHANNEL_ID = "probashi_service_channel"
        const val SERVICE_NOTIFICATION_ID = 8888

        const val PREFS_NAME = "probashi_user_prefs"
        const val KEY_MEMBER_ID = "member_id"
        const val KEY_FUND_ID = "fund_id"
        const val KEY_USER_NAME = "user_name"
        const val KEY_USERNAME = "user_username"
        const val KEY_USER_ROLE = "user_role"
        const val KEY_IS_ADMIN = "is_admin"

        var isServiceRunning = false

        fun start(context: Context) {
            try {
                val intent = Intent(context, ProbashiRealtimeCallService::class.java)
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    context.startForegroundService(intent)
                } else {
                    context.startService(intent)
                }
            } catch (e: Exception) {
                Log.e(TAG, "Failed to start ProbashiRealtimeCallService", e)
            }
        }

        fun stop(context: Context) {
            try {
                val intent = Intent(context, ProbashiRealtimeCallService::class.java)
                context.stopService(intent)
            } catch (e: Exception) {
                Log.e(TAG, "Failed to stop ProbashiRealtimeCallService", e)
            }
        }

        fun updateSession(
            context: Context,
            memberId: String,
            fundId: String,
            name: String?,
            username: String?,
            role: String?,
            isAdmin: Boolean
        ) {
            val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            prefs.edit().apply {
                putString(KEY_MEMBER_ID, memberId)
                putString(KEY_FUND_ID, fundId)
                putString(KEY_USER_NAME, name ?: "")
                putString(KEY_USERNAME, username ?: "")
                putString(KEY_USER_ROLE, role ?: "")
                putBoolean(KEY_IS_ADMIN, isAdmin)
                apply()
            }
            Log.i(TAG, "Session updated in SharedPreferences: memberId=$memberId, name=$name, username=$username, isAdmin=$isAdmin")
            // Trigger service to start or reload listeners
            start(context)
        }
    }

    private var callsListener: ListenerRegistration? = null
    private var specificCallListener: ListenerRegistration? = null
    private var chatListener: ListenerRegistration? = null
    private var currentRingingCallId: String? = null
    private var isFirstChatSnapshot = true

    override fun onCreate() {
        super.onCreate()
        isServiceRunning = true
        CallNotificationManager.createNotificationChannel(applicationContext)
        createServiceNotificationChannel()
        startAsForeground()
        attachFirestoreListeners()
        Log.i(TAG, "ProbashiRealtimeCallService created and running in foreground")
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        startAsForeground()
        // Re-attach listeners to ensure latest session filters
        attachFirestoreListeners()
        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun createServiceNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            val channel = NotificationChannel(
                SERVICE_CHANNEL_ID,
                "প্রবাসী মুক্ত ফান্ড ব্যাকগ্রাউন্ড সার্ভিস",
                NotificationManager.IMPORTANCE_MIN
            ).apply {
                description = "রিয়েল-টাইম কল ও নোটিফিকেশন ব্যাকগ্রাউন্ড কানেকশন"
                setShowBadge(false)
                lockscreenVisibility = Notification.VISIBILITY_SECRET
            }
            manager.createNotificationChannel(channel)
        }
    }

    private fun startAsForeground() {
        try {
            val launchIntent = Intent(this, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_SINGLE_TOP
            }
            val pendingIntent = PendingIntent.getActivity(
                this,
                0,
                launchIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val notification = NotificationCompat.Builder(this, SERVICE_CHANNEL_ID)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle("প্রবাসী মুক্ত ফান্ড সক্রিয়")
                .setContentText("কল ও বার্তার রিয়েল-টাইম কানেকশন চালু আছে")
                .setPriority(NotificationCompat.PRIORITY_MIN)
                .setCategory(NotificationCompat.CATEGORY_SERVICE)
                .setContentIntent(pendingIntent)
                .setOngoing(true)
                .build()

            val foregroundServiceType = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                ServiceInfo.FOREGROUND_SERVICE_TYPE_DATA_SYNC or ServiceInfo.FOREGROUND_SERVICE_TYPE_PHONE_CALL
            } else {
                0
            }

            ServiceCompat.startForeground(
                this,
                SERVICE_NOTIFICATION_ID,
                notification,
                foregroundServiceType
            )
        } catch (e: Exception) {
            Log.w(TAG, "startForeground note: ${e.message}")
        }
    }

    private fun attachFirestoreListeners() {
        try {
            val db = ProbashiFirebase.getFirestore(applicationContext)
            val prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            val myMemberId = prefs.getString(KEY_MEMBER_ID, "") ?: ""
            val myName = prefs.getString(KEY_USER_NAME, "") ?: ""
            val myUsername = prefs.getString(KEY_USERNAME, "") ?: ""
            val isAdmin = prefs.getBoolean(KEY_IS_ADMIN, false)

            Log.i(TAG, "Attaching Firestore listeners: memberId='$myMemberId', name='$myName', username='$myUsername', isAdmin=$isAdmin")

            // 1. Listen for Active Incoming Calls in real time
            callsListener?.remove()
            callsListener = db.collection("active_calls")
                .whereEqualTo("status", "ringing")
                .addSnapshotListener { snapshot, error ->
                    if (error != null) {
                        Log.w(TAG, "Active calls listener error", error)
                        return@addSnapshotListener
                    }

                    if (snapshot == null || snapshot.isEmpty) {
                        if (currentRingingCallId != null) {
                            Log.i(TAG, "No ringing calls remaining, dismissing call UI")
                            CallNotificationManager.dismissCall(applicationContext)
                            currentRingingCallId = null
                            specificCallListener?.remove()
                            specificCallListener = null
                        }
                        return@addSnapshotListener
                    }

                    val now = System.currentTimeMillis()

                    for (change in snapshot.documentChanges) {
                        val doc = change.document
                        val data = doc.data
                        val callId = doc.id
                        val callerId = data["callerId"] as? String ?: ""
                        val callerName = data["callerName"] as? String ?: "প্রবাসী সদস্য"
                        val callerUsername = data["callerUsername"] as? String ?: ""
                        val callerRole = data["callerRole"] as? String ?: "member"
                        val callerCountry = data["callerCountry"] as? String ?: "প্রবাসী"
                        val callerAvatar = data["callerAvatar"] as? String
                        val targetId = data["targetId"] as? String ?: ""
                        val targetName = data["targetName"] as? String ?: ""
                        val targetUsername = data["targetUsername"] as? String ?: ""
                        val targetRole = data["targetRole"] as? String ?: ""
                        val isGroup = data["isGroup"] as? Boolean ?: false
                        val timestamp = (data["timestamp"] as? Number)?.toLong() ?: now
                        val callType = data["type"] as? String ?: "audio"

                        // Never ring caller's own device
                        val isMeCaller = (myMemberId.isNotEmpty() && callerId == myMemberId) ||
                                (myUsername.isNotEmpty() && callerUsername.equals(myUsername, ignoreCase = true)) ||
                                (myName.isNotEmpty() && callerName.equals(myName, ignoreCase = true))

                        if (isMeCaller) {
                            continue
                        }

                        // Ignore calls older than 60 seconds
                        if (now - timestamp > 60000) {
                            continue
                        }

                        // Determine if call is intended for this user
                        val isDirectTarget = (myMemberId.isNotEmpty() && targetId == myMemberId) ||
                                (myUsername.isNotEmpty() && targetUsername.equals(myUsername, ignoreCase = true)) ||
                                (myName.isNotEmpty() && targetName.equals(myName, ignoreCase = true))

                        val isAdminTarget = isAdmin && (
                                targetRole == "admin" ||
                                targetId == "admin_master_001" ||
                                targetId == "admin" ||
                                targetName.contains("এডমিন") ||
                                targetName.contains("অ্যাডমিন")
                        )

                        val isForMe = isDirectTarget || isAdminTarget || isGroup

                        if (isForMe) {
                            if (currentRingingCallId != callId) {
                                currentRingingCallId = callId
                                Log.i(TAG, "Incoming call matched for me! CallID: $callId, Caller: $callerName, Type: $callType")

                                CallNotificationManager.showIncomingCallNotification(
                                    context = applicationContext,
                                    callId = callId,
                                    callerName = callerName,
                                    callerRole = callerRole,
                                    callerCountry = callerCountry,
                                    callType = callType,
                                    callerAvatar = callerAvatar
                                )

                                // Listen to this specific call document so if caller hangs up, ring stops immediately
                                specificCallListener?.remove()
                                specificCallListener = db.collection("active_calls").document(callId)
                                    .addSnapshotListener { callSnap, _ ->
                                        val status = callSnap?.getString("status")
                                        if (status == null || status != "ringing") {
                                            Log.i(TAG, "Call status changed to '$status', dismissing ringtone")
                                            CallNotificationManager.dismissCall(applicationContext)
                                            currentRingingCallId = null
                                            specificCallListener?.remove()
                                            specificCallListener = null
                                        }
                                    }
                            }
                        }
                    }
                }

            // 2. Listen for Chat Messages in real time (for background alerts)
            chatListener?.remove()
            isFirstChatSnapshot = true
            chatListener = db.collection("chat_messages")
                .limit(35)
                .addSnapshotListener { snapshot, error ->
                    if (error != null) {
                        Log.w(TAG, "Chat listener error", error)
                        return@addSnapshotListener
                    }
                    if (snapshot == null) return@addSnapshotListener

                    if (isFirstChatSnapshot) {
                        isFirstChatSnapshot = false
                        return@addSnapshotListener
                    }

                    // Only trigger notifications if app is not actively viewed in foreground
                    if (MainActivity.isAppInForeground) {
                        return@addSnapshotListener
                    }

                    for (change in snapshot.documentChanges) {
                        if (change.type != DocumentChange.Type.ADDED) continue
                        val data = change.document.data
                        val senderId = data["senderId"] as? String ?: ""
                        val senderName = data["senderName"] as? String ?: "সদস্য"
                        val isDirect = data["isDirect"] as? Boolean ?: false
                        val recipientId = data["recipientId"] as? String ?: ""
                        val recipientRole = data["recipientRole"] as? String ?: ""
                        val recipientName = data["recipientName"] as? String ?: ""
                        val type = data["type"] as? String ?: "text"
                        val text = data["text"] as? String ?: ""

                        if (myMemberId.isNotEmpty() && senderId == myMemberId) continue
                        if (myName.isNotEmpty() && senderName.equals(myName, ignoreCase = true)) continue
                        if (type == "call_log") continue

                        val isDirectForMe = if (isDirect) {
                            (myMemberId.isNotEmpty() && recipientId == myMemberId) ||
                            (myName.isNotEmpty() && recipientName.equals(myName, ignoreCase = true)) ||
                            (isAdmin && (recipientRole == "admin" || recipientId == "admin" || recipientId == "admin_master_001"))
                        } else {
                            true // Community announcement or group chat
                        }

                        if (isDirectForMe) {
                            val title = if (isDirect) "$senderName (সরাসরি বার্তা)" else "$senderName • প্রবাসী মুক্ত ফান্ড"
                            val body = when (type) {
                                "voice" -> "🎤 একটি ভয়েস বার্তা পাঠিয়েছেন"
                                "image" -> "📷 একটি ছবি পাঠিয়েছেন"
                                else -> if (text.isNotEmpty()) text else "একটি নতুন বার্তা এসেছে"
                            }
                            showChatMessageNotification(title, body, senderId)
                        }
                    }
                }
        } catch (e: Exception) {
            Log.e(TAG, "Error attaching Firestore listeners in service", e)
        }
    }

    private fun showChatMessageNotification(title: String, body: String, senderId: String) {
        try {
            val intent = Intent(this, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
                putExtra("DIRECT_USER_ID", senderId)
            }
            val pendingIntent = PendingIntent.getActivity(
                this,
                (System.currentTimeMillis() % 10000).toInt(),
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val notification = NotificationCompat.Builder(this, CallNotificationManager.GENERAL_CHANNEL_ID)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(title)
                .setContentText(body)
                .setAutoCancel(true)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setCategory(NotificationCompat.CATEGORY_MESSAGE)
                .setContentIntent(pendingIntent)
                .build()

            val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.notify((System.currentTimeMillis() % 10000).toInt(), notification)
        } catch (e: Exception) {
            Log.e(TAG, "Error displaying chat message notification", e)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        isServiceRunning = false
        callsListener?.remove()
        specificCallListener?.remove()
        chatListener?.remove()
        Log.i(TAG, "ProbashiRealtimeCallService stopped and listeners cleaned up")
    }
}
