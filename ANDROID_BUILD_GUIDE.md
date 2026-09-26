# প্রবাসী মুক্ত ফান্ড (Probashi Mukto Fund) - Android Kotlin Native App Guide

আপনার এই ওয়েব অ্যাপ্লিকেশনটিকে শতভাগ নিখুঁতভাবে **Android Kotlin Native App**-এ রূপান্তরিত করা হয়েছে। এতে লাইভ ফায়ারবেস ডাটাবেজ, লগইন সিস্টেম, পাসবুক এবং লক-স্ক্রিন ইনকামিং কল নোটিফিকেশন সিস্টেম ইন্টিগ্রেট করা হয়েছে।

---

## 📁 তৈরি করা নেটিভ অ্যান্ড্রয়েড কোড ফাইলসমূহ (`android/` ফোল্ডারে):

1. **`MainActivity.kt`** (`android/app/src/main/java/com/probashimuktofund/app/MainActivity.kt`)
   - নেটিভ ব্রিজ কন্ট্রোল এবং WebRTC ক্যামেরা/মাইক্রোফোন পারমিশন স্বয়ংক্রিয়ভাবে হ্যান্ডেল করে।
   - ইনকামিং কল অ্যাকসেপ্ট করলে সরাসরি মূল কল ইন্টারফেসে যুক্ত করে।

2. **`IncomingCallActivity.kt`** (`android/app/src/main/java/com/probashimuktofund/app/IncomingCallActivity.kt`)
   - মোবাইল লক থাকা অবস্থায় অথবা স্ক্রিন অফ থাকা অবস্থায় হোয়াটসঅ্যাপ/আইমোর মতো ফুল-স্ক্রিন কলিং স্ক্রিন ওপেন করে।
   - কলারের নাম, ছবি, পদবী (এডমিন/সদস্য) এবং দেশের নাম দেখায়।
   - রিংটোন বাজায় এবং ভাইব্রেশন তৈরি করে।
   - "রিসিভ করুন" ও "কেটে দিন" দুটি বোতাম রয়েছে।

3. **`CallNotificationManager.kt`** (`android/app/src/main/java/com/probashimuktofund/app/CallNotificationManager.kt`)
   - অ্যান্ড্রয়েডের হাই-প্রায়োরিটি `NotificationChannel` (`probashi_call_channel`) তৈরি করে।
   - লক-স্ক্রিন নোটিফিকেশন ও ফুল-স্ক্রিন ইনটেন্ট ট্রিগার করে।
   - রিংটোন প্লে এবং ভাইব্রেশন লুপ চালায়।

4. **`CallActionReceiver.kt`** (`android/app/src/main/java/com/probashimuktofund/app/CallActionReceiver.kt`)
   - নোটিফিকেশন বার থেকে "রিসিভ করুন" বা "কেটে দিন" চাপলে ব্যাকগ্রাউন্ডে রেসপন্স হ্যান্ডেল করে এবং ফায়ারবেসে স্ট্যাটাস আপডেট করে।

5. **`ProbashiFirebaseMessagingService.kt`** (`android/app/src/main/java/com/probashimuktofund/app/ProbashiFirebaseMessagingService.kt`)
   - এফসিএম (FCM) পুশ নোটিফিকেশন রিসিভ করে যেকোনো স্থান থেকে ফোন আসলেই নোটিফিকেশন ও কল স্ক্রিন চালু করে।

6. **`NativeCallPlugin.kt`** (`android/app/src/main/java/com/probashimuktofund/app/NativeCallPlugin.kt`)
   - ওয়েব লেয়ার ও নেটিভ অ্যান্ড্রয়েড লেয়ারের মধ্যে রিয়েল-টাইম কল ব্রিজ।

7. **`activity_incoming_call.xml`** (`android/app/src/main/res/layout/activity_incoming_call.xml`)
   - হোয়াটসঅ্যাপ ও আইমো-স্টাইলের ডার্ক এমারেল্ড প্রিমিয়াম কলিং ইন্টারফেস।

8. **`AndroidManifest.xml`** (`android/app/src/main/AndroidManifest.xml`)
   - ক্যামেরা, মাইক্রোফোন, অডিও, ওয়্যারলেস, ফুল-স্ক্রিন ইনটেন্ট, ফোরগ্রাউন্ড সার্ভিস ও পোস্ট নোটিফিকেশন পারমিশনসমূহ যুক্ত।

9. **`google-services.json`** (`android/app/google-services.json`)
   - প্রজেক্ট আইডি: `gen-lang-client-0385276763`
   - ফায়ারবেস ডাটাবেজ: `ai-studio-probashimuktofun-1f8d1a6e-7e1d-405a-aa01-b0a70d406f10`

---

## 🚀 মোবাইলে APK বানানোর নিয়ম (How to Build APK)

### পদ্ধতি ১: অ্যান্ড্রয়েড স্টুডিও (Android Studio) দিয়ে:
1. আপনার কম্পিউটারে **Android Studio** ওপেন করুন।
2. **Open an Existing Project** সিলেক্ট করে এই প্রজেক্টের `android` ফোল্ডারটি ওপেন করুন।
3. গ্রেডল সিঙ্ক শেষ হলে মেনু থেকে **Build > Build Bundle(s) / APK(s) > Build APK(s)**-এ ক্লিক করুন।
4. তৈরি হওয়া `.apk` ফাইলটি সরাসরি আপনার অ্যান্ড্রয়েড ফোনে ইন্সটল করুন।

### পদ্ধতি ২: টার্মিনাল/কমান্ড লাইন দিয়ে:
```bash
cd android
./gradlew assembleDebug
```
তৈরি হওয়া APK ফাইলটি পাবেন:
`android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🔑 লাইভ ফায়ারবেস লগইন তথ্য (লগইন সম্পূর্ণ সেম থাকবে):
- **ডাটাবেজ আইডি**: `ai-studio-probashimuktofun-1f8d1a6e-7e1d-405a-aa01-b0a70d406f10`
- **কালেকশনসমূহ**: `funds`, `members`, `payments`, `investments`, `chat_messages`, `chat_presences`, `active_calls`, `admins`
- মেম্বাররা ওয়েবসাইটে যে ইউজারনেম/ফোন ও পাসওয়ার্ড দিয়ে লগইন করেন, মোবাইল অ্যাপেও ঠিক একই তথ্য দিয়ে লগইন করতে পারবেন।
- এডমিনরা তাদের ইমেইল ও পাসওয়ার্ড দিয়ে এডমিন প্যানেল এক্সেস করতে পারবেন।
