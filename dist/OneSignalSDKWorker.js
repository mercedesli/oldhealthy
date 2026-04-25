// Fallback: OneSignal's default worker filename.
// The app uses sw.js as the merged worker (see serviceWorkerPath in notifications.ts).
// This file exists only in case OneSignal looks for it by its default name.
importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');
