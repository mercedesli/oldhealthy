import Anthropic from '@anthropic-ai/sdk';

// Vercel serverless function — called by the daily cron job at 14:00 UTC (10 AM AST)
// Also callable manually via GET /api/send-notification for testing

export const config = {
  maxDuration: 30,
};

const ONESIGNAL_API = 'https://onesignal.com/api/v1/notifications';

async function generateMessage(anthropic: Anthropic): Promise<string> {
  const today = new Date().toLocaleDateString('es-DO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 120,
    system: `Eres un coach de bienestar para adultos mayores latinoamericanos de 60+ años.
Genera mensajes motivacionales BREVES (máximo 2 frases cortas) en español dominicano.
El tono debe ser cálido, cercano y positivo. Varía el tipo de mensaje cada vez:
algunos sobre movimiento, otros sobre constancia, otros sobre salud mental o autoestima.
Devuelve SOLO el mensaje, sin comillas, sin prefijos, sin explicaciones.`,
    messages: [
      {
        role: 'user',
        content: `Genera el mensaje motivacional de hoy, ${today}.`,
      },
    ],
  });

  const text = response.content[0];
  return text.type === 'text' ? text.text.trim() : '¡Cada paso que das hoy es una victoria! Tu cuerpo te lo agradece.';
}

async function sendPushNotification(message: string): Promise<{ recipients: number }> {
  const res = await fetch(ONESIGNAL_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Key ${process.env.ONESIGNAL_REST_API_KEY}`,
    },
    body: JSON.stringify({
      app_id: process.env.ONESIGNAL_APP_ID,
      included_segments: ['All'],
      headings: { es: 'OldHealthy 💪', en: 'OldHealthy 💪' },
      contents: { es: message, en: message },
      url: 'https://oldhealthy.vercel.app/inicio',
      web_buttons: [
        {
          id: 'open-app',
          text: 'Abrir app',
          url: 'https://oldhealthy.vercel.app/inicio',
        },
      ],
      // Show notification even if app is open in foreground
      web_push_topic: 'daily-motivation',
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OneSignal error ${res.status}: ${body}`);
  }

  const data = await res.json();
  return { recipients: data.recipients ?? 0 };
}

export default async function handler(req: Request): Promise<Response> {
  // Allow Vercel cron calls (header set automatically by Vercel)
  // and manual GET calls for testing (protected by CRON_SECRET if set)
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.get('authorization');
    const isVercelCron = req.headers.get('x-vercel-cron') === '1';
    if (!isVercelCron && auth !== `Bearer ${cronSecret}`) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await generateMessage(anthropic);
    const { recipients } = await sendPushNotification(message);

    console.log(`[OldHealthy] Notification sent. Recipients: ${recipients}. Message: "${message}"`);

    return Response.json({ success: true, message, recipients });
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error('[OldHealthy] Notification failed:', error);
    return Response.json({ success: false, error }, { status: 500 });
  }
}
