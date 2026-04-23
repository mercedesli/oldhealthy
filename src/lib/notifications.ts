/* eslint-disable @typescript-eslint/no-explicit-any */

const ONESIGNAL_APP_ID = 'd19fd9ea-3350-445b-a6f1-daca17fc9cb9';

declare global {
  interface Window {
    OneSignalDeferred: ((os: any) => void | Promise<void>)[];
  }
}

// Called once per app load from AppLayout.
// OneSignal must initialize on every load to receive push events.
// The permission prompt is only shown once (tracked in localStorage).
export function initNotifications(): void {
  if (typeof window === 'undefined') return;

  window.OneSignalDeferred = window.OneSignalDeferred || [];

  window.OneSignalDeferred.push(async (OneSignal: any) => {
    try {
      await OneSignal.init({
        appId: ONESIGNAL_APP_ID,
        notifyButton: { enable: false },
        // Use the same root scope — our OneSignalSDKWorker.js lives at /
        serviceWorkerParam: { scope: '/' },
      });

      // Sync subscription state so other parts of the app can read it
      const subscribed = OneSignal.User?.PushSubscription?.optedIn ?? false;
      localStorage.setItem('push_subscribed', subscribed ? '1' : '0');

      // Show native prompt once, 4 s after the user first opens the app
      const alreadyPrompted = localStorage.getItem('notifications_prompted');
      if (!alreadyPrompted) {
        localStorage.setItem('notifications_prompted', '1');
        setTimeout(async () => {
          try {
            await OneSignal.Notifications.requestPermission();
            const opted = OneSignal.User?.PushSubscription?.optedIn ?? false;
            localStorage.setItem('push_subscribed', opted ? '1' : '0');
          } catch {
            // User dismissed or browser blocked — silently ignore
          }
        }, 4000);
      }
    } catch {
      // SDK load failure (e.g. offline, ad-blocker) — silently ignore
    }
  });
}
