package com.probashimuktofund.app

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.google.firebase.firestore.FirebaseFirestore

class CallActionReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val callId = intent.getStringExtra("CALL_ID") ?: return
        val action = intent.action

        when (action) {
            CallNotificationManager.ACTION_ACCEPT_CALL -> {
                CallNotificationManager.dismissCall(context)
                val callType = intent.getStringExtra("CALL_TYPE") ?: "audio"

                // Open Main app and trigger call screen
                val launchIntent = Intent(context, MainActivity::class.java).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP)
                    putExtra("AUTO_ACCEPT_CALL_ID", callId)
                    putExtra("AUTO_ACCEPT_CALL_TYPE", callType)
                }
                context.startActivity(launchIntent)
            }
            CallNotificationManager.ACTION_REJECT_CALL -> {
                CallNotificationManager.dismissCall(context)

                // Update Firestore call state
                try {
                    val db = ProbashiFirebase.getFirestore(context)
                    db.collection("active_calls").document(callId).update("status", "rejected")
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        }
    }
}
