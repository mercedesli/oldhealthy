import Anthropic from "@anthropic-ai/sdk";
import type { Exercise } from "../app/data/exercises";

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY as string;
export const AI_MODEL = "claude-haiku-4-5-20251001";

let _client: Anthropic | null = null;
function client(): Anthropic {
  if (!_client) _client = new Anthropic({ apiKey: API_KEY, dangerouslyAllowBrowser: true });
  return _client;
}

async function ask(userMsg: string, system: string, maxTokens = 1024): Promise<string | null> {
  try {
    const res = await client().messages.create({
      model: AI_MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: userMsg }],
    });
    const block = res.content[0];
    return block.type === "text" ? block.text.trim() : null;
  } catch (err) {
    console.warn("[Claude API]", err);
    return null;
  }
}

function parseJSON<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    const clean = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(clean) as T;
  } catch {
    return null;
  }
}

// ── TAREA 1 — AI Exercise Recommendations ────────────────────────────────────

export interface AiRecommendation {
  id: string;
  explanation: string;
}

export async function getAIRecommendations(
  profile: Record<string, unknown>,
  exercises: Exercise[]
): Promise<AiRecommendation[] | null> {
  const list = exercises
    .map(e => `${e.id}|${e.name}|${e.categoryId}|${e.difficulty}|dolor_max:${e.maxPainLevel}`)
    .join("\n");

  const raw = await ask(
    `Perfil del usuario:
- Nombre: ${profile.name || "No indicado"}
- Edad: ${profile.age || "No indicado"}
- Movilidad: ${profile.walkingAid || profile.mobility || "Normal"}
- Nivel de dolor: ${profile.painLevel || 1}/5
- Zonas de dolor: ${Array.isArray(profile.painAreas) ? (profile.painAreas as string[]).join(", ") : "Ninguna"}
- Energía: ${profile.energy || "Normal"}
- Caídas: ${profile.falls || "Ninguna"}
- Objetivos: ${Array.isArray(profile.goals) ? (profile.goals as string[]).join(", ") : "Bienestar general"}

Ejercicios disponibles:
${list}

Elige los 4-6 ejercicios más adecuados. Para cada uno, escribe 1-2 oraciones personalizadas mencionando el motivo basado en el perfil.

Devuelve SOLO el JSON array, sin backticks: [{"id":"...","explanation":"..."}]`,
    "Eres un fisioterapeuta geriátrico experto. Devuelve ÚNICAMENTE JSON válido sin texto extra."
  , 1200);

  const parsed = parseJSON<AiRecommendation[]>(raw);
  return Array.isArray(parsed) ? parsed : null;
}

// ── TAREA 4 — Mood-based Exercises ───────────────────────────────────────────

export interface MoodResult {
  filteredIds: string[];
  message: string;
}

export async function getMoodBasedExercises(
  profile: Record<string, unknown>,
  mood: string,
  exerciseIds: string[]
): Promise<MoodResult | null> {
  const raw = await ask(
    `El usuario se siente hoy: "${mood}"
Perfil: edad ${profile.age}, movilidad ${profile.walkingAid || profile.mobility || "Normal"}, dolor ${profile.painLevel || 1}/5, energía ${profile.energy || "Normal"}.
Ejercicios disponibles: ${exerciseIds.join(", ")}

Si está cansado o con dolor → selecciona solo 2-3 ejercicios suaves.
Si está con energía → incluye 5-6. Normal → 4.

Devuelve SOLO JSON: {"filteredIds":["id1","id2"],"message":"Mensaje cálido de 2-3 oraciones en español explicando la selección para su estado de ánimo de hoy"}`,
    "Eres un coach de ejercicio geriátrico. Devuelve ÚNICAMENTE JSON válido sin texto extra.",
    600
  );

  const parsed = parseJSON<MoodResult>(raw);
  return parsed?.filteredIds && parsed?.message ? parsed : null;
}

// ── TAREA 5 — Daily Coach Message ────────────────────────────────────────────

export async function getCoachMessage(
  profile: Record<string, unknown>,
  streakDays: number,
  exercisedYesterday: boolean
): Promise<string | null> {
  const hour = new Date().getHours();
  const time = hour < 12 ? "mañana" : hour < 18 ? "tarde" : "noche";

  return ask(
    `Escribe un mensaje motivacional para ${profile.name || "el usuario"}.
- Hora: ${time}
- Racha: ${streakDays} días consecutivos
- Ejercitó ayer: ${exercisedYesterday ? "sí" : "no"}
- Edad: ${profile.age || "adulto mayor"}
- Objetivos: ${Array.isArray(profile.goals) ? (profile.goals as string[]).join(", ") : "bienestar"}

Solo el texto del mensaje, sin formato, 2-3 oraciones, cálido y motivador en español:`,
    "Eres OldHealthy, un coach amigable para adultos mayores. Escribe mensajes cálidos y alentadores en español, sin emojis excesivos.",
    250
  );
}

// ── TAREA 3 — Weekly Routine ─────────────────────────────────────────────────

export interface RoutineExercise {
  id: string;
  name: string;
  sets: string;
  reps: string;
  estimatedMins: number;
}

export interface RoutineDay {
  dayName: string;
  date: string;
  rest: boolean;
  exercises: RoutineExercise[];
  totalMins: number;
  tip: string;
}

export interface WeeklyRoutineData {
  days: RoutineDay[];
  weekGoal: string;
  generatedAt: string;
}

export async function generateWeeklyRoutine(
  profile: Record<string, unknown>,
  recentIds: string[],
  streakDays: number,
  exercises: Exercise[]
): Promise<WeeklyRoutineData | null> {
  const list = exercises
    .map(e => `${e.id}|${e.name}|${e.difficulty}|dolor_max:${e.maxPainLevel}|${e.sets} series|${e.reps}`)
    .join("\n");

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return { name: d.toLocaleDateString("es", { weekday: "long" }), date: d.toISOString().split("T")[0] };
  });

  const raw = await ask(
    `Crea un plan de 7 días para este usuario.
Perfil: edad ${profile.age}, movilidad ${profile.walkingAid || profile.mobility || "Normal"}, dolor ${profile.painLevel || 1}/5, energía ${profile.energy || "Normal"}.
Objetivos: ${Array.isArray(profile.goals) ? (profile.goals as string[]).join(", ") : "bienestar"}.
Racha actual: ${streakDays} días. Recientes: ${recentIds.slice(-4).join(", ") || "ninguno"}.

Días: ${days.map((d, i) => `${i}:${d.name} ${d.date}`).join(", ")}

Ejercicios disponibles:
${list}

Reglas: 1-2 días de descanso, 2-4 ejercicios por día activo, no repetir mismo ejercicio >2 veces.

Devuelve SOLO JSON:
{"weekGoal":"objetivo","days":[{"dayName":"Lunes","date":"2024-01-01","rest":false,"exercises":[{"id":"id","name":"Nombre","sets":"3","reps":"10 veces","estimatedMins":5}],"totalMins":20,"tip":"consejo"}]}`,
    "Eres un fisioterapeuta geriátrico. Devuelve ÚNICAMENTE JSON válido sin texto extra.",
    2000
  );

  const parsed = parseJSON<WeeklyRoutineData>(raw);
  if (parsed?.days && parsed?.weekGoal) {
    return { ...parsed, generatedAt: new Date().toISOString() };
  }
  return null;
}

// ── TAREA 6 — Medical Report ─────────────────────────────────────────────────

const CAT_NAMES: Record<string, string> = {
  "piernas-gluteos": "Piernas y Glúteos",
  "core": "Core",
  "brazos-superior": "Brazos y Parte Superior",
  "movilidad-flexibilidad": "Movilidad y Flexibilidad",
};

export async function generateMedicalReport(
  profile: Record<string, unknown>,
  sessions: Array<{ exerciseName: string; categoryId: string; date: string; durationSecs: number }>,
  streakDays: number,
  maxStreak: number
): Promise<string | null> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const last30 = sessions.filter(s => new Date(s.date) >= cutoff);

  const catCounts: Record<string, number> = {};
  last30.forEach(s => { catCounts[s.categoryId] = (catCounts[s.categoryId] || 0) + 1; });
  const totalMins = Math.round(last30.reduce((a, s) => a + s.durationSecs, 0) / 60);
  const zonas = Object.entries(catCounts).map(([k, v]) => `${CAT_NAMES[k] || k} (${v} sesiones)`).join(", ");

  return ask(
    `Redacta un informe médico de actividad física.

PACIENTE: ${profile.name || "Anónimo"}, edad ${profile.age || "no indicada"}.
Movilidad: ${profile.walkingAid || profile.mobility || "Normal"}. Dolor habitual: ${profile.painLevel || 1}/5.
Zonas de dolor: ${Array.isArray(profile.painAreas) ? (profile.painAreas as string[]).join(", ") : "Ninguna"}.
Objetivos: ${Array.isArray(profile.goals) ? (profile.goals as string[]).join(", ") : "Bienestar general"}.

ESTADÍSTICAS ÚLTIMO MES:
- Sesiones: ${last30.length}
- Minutos totales: ${totalMins}
- Racha actual: ${streakDays} días | Récord histórico: ${maxStreak} días
- Zonas trabajadas: ${zonas || "Sin datos"}

ÚLTIMAS SESIONES:
${last30.slice(-8).map(s => `- ${s.date}: ${s.exerciseName} (${Math.round(s.durationSecs / 60)} min)`).join("\n") || "Sin sesiones registradas"}

Genera el informe con estas secciones exactas (usa ## como encabezado):
## DATOS DEL PACIENTE
## RESUMEN DE ACTIVIDAD FÍSICA
## ZONAS DEL CUERPO TRABAJADAS
## PROGRESO Y OBSERVACIONES
## RECOMENDACIONES PARA EL MÉDICO`,
    "Eres un fisioterapeuta redactando un informe médico profesional en español. Sé preciso, claro y usa lenguaje médico apropiado.",
    1500
  );
}
