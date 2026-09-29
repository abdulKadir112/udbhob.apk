package com.probashimuktofund.app

import android.content.Context
import android.util.Log
import com.google.firebase.FirebaseApp
import com.google.firebase.firestore.FirebaseFirestore

/**
 * Centralized Firebase Firestore manager ensuring all native services,
 * receivers, and activities connect to the designated multi-database instance:
 * "ai-studio-probashimuktofun-1f8d1a6e-7e1d-405a-aa01-b0a70d406f10".
 */
object ProbashiFirebase {
    private const val TAG = "ProbashiFirebase"
    const val FIRESTORE_DATABASE_ID = "ai-studio-probashimuktofun-1f8d1a6e-7e1d-405a-aa01-b0a70d406f10"

    fun getFirestore(context: Context): FirebaseFirestore {
        try {
            if (FirebaseApp.getApps(context).isEmpty()) {
                FirebaseApp.initializeApp(context)
                Log.i(TAG, "FirebaseApp initialized dynamically")
            }
            val app = FirebaseApp.getInstance()
            return try {
                FirebaseFirestore.getInstance(app, FIRESTORE_DATABASE_ID)
            } catch (e: Exception) {
                Log.w(TAG, "Named database load note: ${e.message}, falling back to default", e)
                FirebaseFirestore.getInstance(app)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Critical error getting Firestore instance", e)
            return FirebaseFirestore.getInstance()
        }
    }
}
