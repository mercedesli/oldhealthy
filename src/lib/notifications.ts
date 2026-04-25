/* eslint-disable @typescript-eslint/no-explicit-any */

const ONESIGNAL_APP_ID = 'd19fd9ea-3350-445b-a6f1-daca17fc9cb9';

declare global {
  interface Window {
    OneSignalDeferred: ((os: any) => void | Promise<void>)[];
  }
}

// Se llama una vez por carga de la app desde AppLayout.
// Usa un único sw.js fusionado (que importa el SW de OneSignal al inicio)
// para que tanto la caché como la entrega de push compartan el scope '/' sin conflicto.
export function initNotifications(): void {
  if (typeof window === 'undefined') return;

  window.OneSignalDeferred = window.OneSignalDeferred || [];

  window.OneSignalDeferred.push(async (OneSignal: any) => {
    try {
      await OneSignal.init({
        appId: ONESIGNAL_APP_ID,
        notifyButton: { enable: false },
        // Indicar a OneSignal que reutilice el sw.js existente (worker fusionado).
        // Esto evita que un segundo registro de SW en scope '/' genere conflicto.
        serviceWorkerPath: '/sw.js',
        serviceWorkerParam: { scope: '/' },
      });

      // ── Lógica del permiso de notificaciones ────────────────────────────────
      // Se usa el estado real del navegador como fuente de verdad.
      // 'default' = nunca decidido → pedir permiso una sola vez.
      // 'granted'  = ya suscrito → marcar y salir.
      // 'denied'   = el usuario bloqueó → no podemos hacer nada.
      const permission = typeof Notification !== 'undefined'
        ? Notification.permission
        : 'default';

      if (permission === 'granted') {
        localStorage.setItem('push_subscribed', '1');
        return;
      }

      if (permission === 'denied') return;

      // permission === 'default': pedir permiso solo si no lo hemos pedido antes
      const alreadyPrompted = localStorage.getItem('notifications_prompted');
      if (alreadyPrompted) return;

      localStorage.setItem('notifications_prompted', '1');

      // Esperar 5 s para que el usuario vea la app antes de que aparezca el diálogo
      setTimeout(async () => {
        try {
          await OneSignal.Notifications.requestPermission();
          const granted = typeof Notification !== 'undefined'
            && Notification.permission === 'granted';
          localStorage.setItem('push_subscribed', granted ? '1' : '0');
        } catch {
          // El usuario descartó o el navegador bloqueó — ignorar silenciosamente
        }
      }, 5000);

    } catch {
      // Fallo al cargar el SDK (sin conexión, bloqueador de anuncios) — ignorar silenciosamente
    }
  });
}

// Llamar a esta función para reiniciar el estado del permiso (útil para depuración)
export function resetNotificationPrompt(): void {
  localStorage.removeItem('notifications_prompted');
  localStorage.removeItem('push_subscribed');
}
