package com.probashimuktofund.app

import android.app.KeyguardManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.View
import android.view.WindowManager
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.firestore.FirebaseFirestore

class IncomingCallActivity : AppCompatActivity() {

    private var callId: String? = null
    private var callType: String = "audio"
    private val autoDismissHandler = Handler(Looper.getMainLooper())
    private val autoDismissRunnable = Runnable {
        onTimeoutCall()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Wake screen immediately from sleep and show over lock screen
        turnScreenOnAndKeyguard()

        setContentView(R.layout.activity_incoming_call)

        callId = intent.getStringExtra("CALL_ID")
        val callerName = intent.getStringExtra("CALLER_NAME") ?: "প্রবাসী সদস্য"
        val callerRole = intent.getStringExtra("CALLER_ROLE") ?: "member"
        val callerCountry = intent.getStringExtra("CALLER_COUNTRY") ?: "সৌদি আরব"
        callType = intent.getStringExtra("CALL_TYPE") ?: "audio"

        findViewById<TextView>(R.id.tvCallerName).text = callerName
        findViewById<TextView>(R.id.tvAvatarInitial).text = callerName.firstOrNull()?.toString() ?: "প্র"

        val roleBengali = if (callerRole.equals("admin", ignoreCase = true)) "এডমিন" else "প্রবাসী সদস্য"
        findViewById<TextView>(R.id.tvCallerDetails).text = "$callerCountry • $roleBengali"

        val isVideo = callType.equals("video", ignoreCase = true)
        findViewById<TextView>(R.id.tvCallType).text = if (isVideo) "📹 ইনকামিং ভিডিও কল" else "📞 ইনকামিং অডিও কল"

        // Ensure ringing & vibration is active
        CallNotificationManager.startRinging(this)

        // Accept
        findViewById<Button>(R.id.btnAcceptAction).setOnClickListener {
            onAcceptCall()
        }
        findViewById<View>(R.id.btnAccept).setOnClickListener {
            onAcceptCall()
        }

        // Decline
        findViewById<Button>(R.id.btnDeclineAction).setOnClickListener {
            onDeclineCall()
        }
        findViewById<View>(R.id.btnDecline).setOnClickListener {
            onDeclineCall()
        }

        // 45 seconds auto-timeout if unhandled
        autoDismissHandler.postDelayed(autoDismissRunnable, 45000)
    }

    private fun turnScreenOnAndKeyguard() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true)
            setTurnScreenOn(true)
            val keyguardManager = getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager
            keyguardManager.requestDismissKeyguard(this, null)
        }

        @Suppress("DEPRECATION")
        window.addFlags(
            WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
            WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD or
            WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON or
            WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
        )
    }

    private fun onAcceptCall() {
        autoDismissHandler.removeCallbacks(autoDismissRunnable)
        CallNotificationManager.dismissCall(this)

        val mainIntent = Intent(this, MainActivity::class.java).apply {
            addFlags(
                Intent.FLAG_ACTIVITY_NEW_TASK or
                Intent.FLAG_ACTIVITY_SINGLE_TOP or
                Intent.FLAG_ACTIVITY_REORDER_TO_FRONT
            )
            putExtra("AUTO_ACCEPT_CALL_ID", callId)
            putExtra("AUTO_ACCEPT_CALL_TYPE", callType)
        }
        startActivity(mainIntent)
        finish()
    }

    private fun onDeclineCall() {
        autoDismissHandler.removeCallbacks(autoDismissRunnable)
        CallNotificationManager.dismissCall(this)

        callId?.let { id ->
            try {
                val db = FirebaseFirestore.getInstance()
                db.collection("active_calls").document(id).update("status", "rejected")
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
        finish()
    }

    private fun onTimeoutCall() {
        CallNotificationManager.dismissCall(this)
        callId?.let { id ->
            try {
                val db = FirebaseFirestore.getInstance()
                db.collection("active_calls").document(id).update("status", "missed")
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
        finish()
    }

    override fun onDestroy() {
        super.onDestroy()
        autoDismissHandler.removeCallbacks(autoDismissRunnable)
        CallNotificationManager.stopRinging()
    }
}
