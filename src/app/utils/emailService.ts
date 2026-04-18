import emailjs from "@emailjs/browser";
import { questions } from "../data/questionnaire";

// ─────────────────────────────────────────────────────────────
//  CONFIGURACIÓN DE EMAILJS
//  Sigue los pasos en README_EMAILJS.md para obtener estos valores
// ─────────────────────────────────────────────────────────────
export const EMAILJS_CONFIG = {
  SERVICE_ID: "service_xkvyuvc",       // ej: "service_abc123"
  TEMPLATE_ID: "template_vspmwii",     // ej: "template_xyz789"
  PUBLIC_KEY: "KB_g5XJQnzINxLcr3",       // ej: "abcDEFghiJKL1234"
  RECIPIENT_EMAIL: "monterodionicio09@gmail.com",
};

// Mapeo de IDs a etiquetas legibles
const questionLabels: Record<string, string> = {
  name: "Nombre",
  age: "Edad",
  sex: "Sexo",
  mobility: "Movilidad actual",
  balance: "Problemas de equilibrio",
  falls: "Caídas en el último año",
  painAreas: "Zonas con dolor",
  sitToStand: "Levantarse de silla sin ayuda",
  stiffness: "Rigidez en articulaciones",
  stiffnessZone: "Zona de más rigidez",
  activity: "Actividad física diaria",
  energy: "Nivel de energía",
  walkingAid: "Apoyo para caminar",
  recentExercise: "Ejercicios en últimos 6 meses",
  goals: "Objetivos principales",
};

function formatAnswer(value: string | string[] | undefined): string {
  if (!value) return "Sin respuesta";
  if (Array.isArray(value)) return value.join(", ");
  return value;
}

function buildAnswersTable(answers: Record<string, string | string[]>): string {
  const rows = questions
    .map((q, index) => {
      const label = questionLabels[q.id] || q.question;
      const answer = formatAnswer(answers[q.id]);
      const bgColor = index % 2 === 0 ? "#F9FAFB" : "#FFFFFF";
      return `
        <tr style="background-color: ${bgColor};">
          <td style="padding: 10px 14px; border-bottom: 1px solid #E5E7EB; color: #6B7280; font-size: 13px; font-weight: 600; width: 40%; vertical-align: top;">
            ${index + 1}. ${label}
          </td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #E5E7EB; color: #111827; font-size: 13px; font-weight: 500; width: 60%; vertical-align: top;">
            ${answer}
          </td>
        </tr>`;
    })
    .join("");

  return `
    <table style="width: 100%; border-collapse: collapse; border-radius: 8px; overflow: hidden; border: 1px solid #E5E7EB;">
      <thead>
        <tr style="background: linear-gradient(135deg, #3D8A62, #3B9ED4);">
          <th style="padding: 12px 14px; text-align: left; color: white; font-size: 13px; font-weight: 700;">PREGUNTA</th>
          <th style="padding: 12px 14px; text-align: left; color: white; font-size: 13px; font-weight: 700;">RESPUESTA</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

export function buildEmailHTML(answers: Record<string, string | string[]>): string {
  const userName = (answers["name"] as string) || "Usuario";
  const now = new Date();
  const dateStr = now.toLocaleDateString("es-DO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:620px;margin:32px auto;background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#3D8A62,#3B9ED4,#E8648A);padding:32px 28px 24px;">
      <p style="margin:0 0 4px 0;font-size:13px;color:rgba(255,255,255,0.8);font-weight:600;letter-spacing:1px;text-transform:uppercase;">OldHealthy App</p>
      <h1 style="margin:0;font-size:26px;color:#FFFFFF;font-weight:800;">🎉 Nuevo Registro</h1>
      <p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.85);">${dateStr}</p>
    </div>

    <!-- Body -->
    <div style="padding:28px;">
      <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">
        Se ha registrado un nuevo usuario en <strong>OldHealthy</strong>. A continuación encontrarás 
        todas las respuestas del cuestionario inicial de <strong>${userName}</strong>:
      </p>

      ${buildAnswersTable(answers)}

      <!-- Summary chips -->
      <div style="margin-top:24px;padding:16px;background:#F0FDF4;border-radius:12px;border-left:4px solid #3D8A62;">
        <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#3D8A62;text-transform:uppercase;letter-spacing:0.5px;">Resumen rápido</p>
        <p style="margin:0;font-size:14px;color:#374151;line-height:1.7;">
          👤 <strong>Nombre:</strong> ${userName}<br/>
          🎂 <strong>Edad:</strong> ${formatAnswer(answers["age"])}<br/>
          🎯 <strong>Objetivos:</strong> ${formatAnswer(answers["goals"])}<br/>
          ⚡ <strong>Nivel de energía:</strong> ${formatAnswer(answers["energy"])}<br/>
          🚶 <strong>Movilidad:</strong> ${formatAnswer(answers["mobility"])}
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding:16px 28px;background:#F9FAFB;border-top:1px solid #E5E7EB;">
      <p style="margin:0;font-size:12px;color:#9CA3AF;text-align:center;">
        Este mensaje fue generado automáticamente por OldHealthy • 
        Notificación enviada a ${EMAILJS_CONFIG.RECIPIENT_EMAIL}
      </p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendQuestionnaireEmail(
  answers: Record<string, string | string[]>
): Promise<{ success: boolean; error?: string }> {
  // Verifica que las credenciales hayan sido configuradas
  if (
    EMAILJS_CONFIG.SERVICE_ID === "YOUR_SERVICE_ID" ||
    EMAILJS_CONFIG.TEMPLATE_ID === "YOUR_TEMPLATE_ID" ||
    EMAILJS_CONFIG.PUBLIC_KEY === "YOUR_PUBLIC_KEY"
  ) {
    console.warn(
      "[OldHealthy] EmailJS no está configurado. Revisa /src/app/utils/emailService.ts y sigue los pasos del README."
    );
    return { success: false, error: "EmailJS no configurado" };
  }

  const userName = (answers["name"] as string) || "Usuario";
  const now = new Date();
  const dateStr = now.toLocaleDateString("es-DO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Construye texto plano como respaldo
  const answersText = questions
    .map((q) => {
      const label = questionLabels[q.id] || q.question;
      return `• ${label}: ${formatAnswer(answers[q.id])}`;
    })
    .join("\n");

  const templateParams = {
    to_email: EMAILJS_CONFIG.RECIPIENT_EMAIL,
    user_name: userName,
    registration_date: dateStr,
    answers_text: answersText,
    answers_html: buildEmailHTML(answers),
    // Variables de resumen
    summary_age: formatAnswer(answers["age"]),
    summary_goals: formatAnswer(answers["goals"]),
    summary_mobility: formatAnswer(answers["mobility"]),
    summary_pain: formatAnswer(answers["painAreas"]),
  };

  try {
    await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams,
      { publicKey: EMAILJS_CONFIG.PUBLIC_KEY }
    );
    return { success: true };
  } catch (err: unknown) {
    console.error("[OldHealthy] Error al enviar email:", err);
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}
