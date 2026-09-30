var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_app = require("firebase-admin/app");
var import_messaging = require("firebase-admin/messaging");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "10mb" }));
app.use(import_express.default.urlencoded({ extended: true, limit: "10mb" }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
var adminAppInstance = null;
function getFirebaseAdminApp() {
  try {
    const existingApps = (0, import_app.getApps)();
    if (adminAppInstance && existingApps.length > 0) {
      return adminAppInstance;
    }
    if (existingApps.length > 0) {
      adminAppInstance = existingApps[0];
      return adminAppInstance;
    }
    const projectId = process.env.FIREBASE_PROJECT_ID || "gen-lang-client-0385276763";
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;
    if (clientEmail && privateKey) {
      if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = privateKey.slice(1, -1);
      }
      privateKey = privateKey.replace(/\\n/g, "\n");
      adminAppInstance = (0, import_app.initializeApp)({
        credential: (0, import_app.cert)({
          projectId,
          clientEmail,
          privateKey
        }),
        projectId
      });
      console.log("\u2705 Firebase Admin initialized with service account.");
      return adminAppInstance;
    }
    adminAppInstance = (0, import_app.initializeApp)({
      projectId
    });
    console.log("\u2705 Firebase Admin initialized with project ID:", projectId);
    return adminAppInstance;
  } catch (err) {
    console.warn("\u26A0\uFE0F Firebase Admin initialization note:", err);
    const existing = (0, import_app.getApps)();
    return existing.length > 0 ? existing[0] : null;
  }
}
app.post("/api/send-fcm-notification", async (req, res) => {
  try {
    const {
      token,
      tokens,
      title,
      body,
      icon,
      url,
      isCall,
      callId,
      callerName,
      callType,
      data = {}
    } = req.body;
    const recipientTokens = [];
    if (token && typeof token === "string") recipientTokens.push(token);
    if (Array.isArray(tokens)) {
      tokens.forEach((t) => {
        if (typeof t === "string" && t && !recipientTokens.includes(t)) {
          recipientTokens.push(t);
        }
      });
    }
    if (recipientTokens.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No recipient FCM token provided."
      });
    }
    const adminApp = getFirebaseAdminApp();
    if (!adminApp) {
      return res.status(500).json({
        success: false,
        message: "Firebase Admin could not be initialized."
      });
    }
    const messaging = (0, import_messaging.getMessaging)(adminApp);
    const notificationTitle = title || (isCall ? `\u{1F4DE} ${callerName || "\u09B8\u09A6\u09B8\u09CD\u09AF"} \u09A5\u09C7\u0995\u09C7 \u0995\u09B2 \u0986\u09B8\u099B\u09C7` : "\u09AA\u09CD\u09B0\u09AC\u09BE\u09B8\u09C0 \u09AE\u09C1\u0995\u09CD\u09A4 \u09AB\u09BE\u09A8\u09CD\u09A1");
    const notificationBody = body || (isCall ? "\u09AA\u09CD\u09B0\u09AC\u09BE\u09B8\u09C0 \u09AE\u09C1\u0995\u09CD\u09A4 \u09AB\u09BE\u09A8\u09CD\u09A1 \u0995\u09B2 \u0986\u09B8\u099B\u09C7\u0964 \u09B0\u09BF\u09B8\u09BF\u09AD \u09AC\u09BE \u0995\u09C7\u099F\u09C7 \u09A6\u09BF\u09A4\u09C7 \u099F\u09CD\u09AF\u09BE\u09AA \u0995\u09B0\u09C1\u09A8" : "\u09A8\u09A4\u09C1\u09A8 \u09AC\u09BE\u09B0\u09CD\u09A4\u09BE \u098F\u09B8\u09C7\u099B\u09C7");
    const notificationIcon = icon || "/udbhob_logo.svg";
    const targetUrl = url || (isCall ? `/?callAction=answer&callId=${callId || "live"}` : "/");
    const enrichedData = {
      type: isCall ? "incoming_call" : "notification",
      action: isCall ? "incoming_call" : "message",
      isCall: isCall ? "true" : "false",
      callId: String(callId || ""),
      call_id: String(callId || ""),
      callerName: String(callerName || "\u09AA\u09CD\u09B0\u09AC\u09BE\u09B8\u09C0 \u09B8\u09A6\u09B8\u09CD\u09AF"),
      caller_name: String(callerName || "\u09AA\u09CD\u09B0\u09AC\u09BE\u09B8\u09C0 \u09B8\u09A6\u09B8\u09CD\u09AF"),
      callerRole: String(data.callerRole || data.caller_role || "member"),
      caller_role: String(data.callerRole || data.caller_role || "member"),
      callerCountry: String(data.callerCountry || data.caller_country || "\u09AA\u09CD\u09B0\u09AC\u09BE\u09B8\u09C0"),
      caller_country: String(data.callerCountry || data.caller_country || "\u09AA\u09CD\u09B0\u09AC\u09BE\u09B8\u09C0"),
      callType: String(callType || "audio"),
      call_type: String(callType || "audio"),
      callerAvatar: String(notificationIcon),
      caller_avatar: String(notificationIcon),
      title: notificationTitle,
      body: notificationBody,
      timestamp: String(Date.now()),
      url: targetUrl,
      ...Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, String(v)])
      )
    };
    const commonPayload = {
      data: enrichedData,
      android: {
        priority: "high",
        ttl: isCall ? 60 * 1e3 : 86400 * 1e3,
        directBootOk: true,
        // For general messages/announcements only: show system tray notification
        ...!isCall && {
          notification: {
            title: notificationTitle,
            body: notificationBody,
            icon: "ic_launcher",
            color: "#005C4B",
            sound: "default",
            priority: "max",
            visibility: "public",
            channelId: "probashi_general_channel_v2",
            defaultVibrateTimings: true
          }
        }
      },
      webpush: {
        headers: {
          Urgency: isCall ? "high" : "normal",
          TTL: isCall ? "60" : "86400"
        },
        notification: {
          title: notificationTitle,
          body: notificationBody,
          icon: notificationIcon,
          badge: "/udbhob_logo.svg",
          tag: isCall ? `incoming-call-${callId || Date.now()}` : `udbhob-${Date.now()}`,
          renotify: true,
          requireInteraction: isCall ? true : false,
          silent: false,
          vibrate: isCall ? [1e3, 300, 1e3, 300, 1200, 300, 1500, 400, 2e3] : [200, 100, 200, 100, 200],
          actions: isCall ? [
            { action: "answer", title: "\u{1F4DE} \u09B0\u09BF\u09B8\u09BF\u09AD \u0995\u09B0\u09C1\u09A8" },
            { action: "decline", title: "\u274C \u0995\u09C7\u099F\u09C7 \u09A6\u09BF\u09A8" }
          ] : [
            { action: "open", title: "\u{1F440} \u09A6\u09C7\u0996\u09C1\u09A8" },
            { action: "close", title: "\u274C \u09AC\u09A8\u09CD\u09A7" }
          ],
          data: enrichedData
        },
        fcmOptions: {
          link: targetUrl
        }
      }
    };
    if (!isCall) {
      commonPayload.notification = {
        title: notificationTitle,
        body: notificationBody
      };
      if (typeof notificationIcon === "string" && (notificationIcon.startsWith("http://") || notificationIcon.startsWith("https://"))) {
        commonPayload.notification.imageUrl = notificationIcon;
      }
    }
    const results = await Promise.allSettled(
      recipientTokens.map(
        (t) => messaging.send({
          ...commonPayload,
          token: t
        })
      )
    );
    const successfulCount = results.filter((r) => r.status === "fulfilled").length;
    const failureCount = results.filter((r) => r.status === "rejected").length;
    console.log(`[FCM Push] Sent to ${recipientTokens.length} devices (Success: ${successfulCount}, Failed: ${failureCount})`);
    return res.status(200).json({
      success: successfulCount > 0,
      sentCount: successfulCount,
      failureCount,
      results: results.map((r) => r.status === "fulfilled" ? r.value : r.reason?.message || r.reason)
    });
  } catch (error) {
    console.error("\u274C Error sending FCM push notification:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Unknown error occurred while dispatching FCM"
    });
  }
});
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString() });
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\u{1F680} Server running on port ${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
