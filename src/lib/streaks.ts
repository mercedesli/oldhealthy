import { supabase, getUserId } from "./supabase";

export interface StreakData {
  current: number;
  max: number;
  lastExercise: string | null;
  history7: boolean[];
}

export interface SessionRecord {
  exerciseId: string;
  exerciseName: string;
  categoryId: string;
  date: string;
  durationSecs: number;
}

function getTodayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function daysAgoStr(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

function daysBetween(a: string, b: string): number {
  return Math.round(
    (new Date(b + "T00:00:00").getTime() - new Date(a + "T00:00:00").getTime()) /
      86_400_000
  );
}

export function loadStreaks(): StreakData {
  try {
    const raw = localStorage.getItem("streakData");
    if (!raw) return emptyStreak();
    const data: StreakData = JSON.parse(raw);
    return refreshIfStale(data);
  } catch {
    return emptyStreak();
  }
}

function emptyStreak(): StreakData {
  return { current: 0, max: 0, lastExercise: null, history7: Array(7).fill(false) };
}

function refreshIfStale(data: StreakData): StreakData {
  if (!data.lastExercise) return data;
  const today = getTodayStr();
  if (data.lastExercise === today) return data;

  const diff = daysBetween(data.lastExercise, today);
  if (diff <= 1) return data; // yesterday — still valid, streak not broken yet

  // Streak broken: shift history and reset current
  const shifted = shiftHistory(data.history7, Math.min(diff, 7));
  const updated = { ...data, current: 0, history7: shifted };
  localStorage.setItem("streakData", JSON.stringify(updated));
  return updated;
}

function shiftHistory(h: boolean[], days: number): boolean[] {
  const result = Array(7).fill(false);
  if (days < 7) {
    for (let i = 0; i < 7 - days; i++) result[i] = h[i + days];
  }
  return result;
}

export function recordExercise(): StreakData {
  const data = loadStreaks();
  const today = getTodayStr();

  if (data.lastExercise === today) return data; // already recorded today

  const prev = data.history7.length === 7 ? [...data.history7] : Array(7).fill(false);
  const daysElapsed = data.lastExercise ? daysBetween(data.lastExercise, today) : 7;
  const newHistory = shiftHistory(prev, Math.min(daysElapsed, 7));
  newHistory[6] = true;

  const isConsecutive = data.lastExercise === daysAgoStr(1);
  const newCurrent = isConsecutive ? data.current + 1 : 1;
  const newMax = Math.max(newCurrent, data.max);

  const updated: StreakData = {
    current: newCurrent,
    max: newMax,
    lastExercise: today,
    history7: newHistory,
  };

  localStorage.setItem("streakData", JSON.stringify(updated));
  saveStreakToSupabase(updated);
  return updated;
}

export function addSessionRecord(record: Omit<SessionRecord, "date">): void {
  try {
    const history: SessionRecord[] = JSON.parse(localStorage.getItem("sessionHistory") || "[]");
    const cutoff = daysAgoStr(60);
    const trimmed = history.filter((s) => s.date >= cutoff);
    trimmed.push({ ...record, date: getTodayStr() });
    localStorage.setItem("sessionHistory", JSON.stringify(trimmed));
  } catch {}
}

export function getSessionHistory(): SessionRecord[] {
  try {
    return JSON.parse(localStorage.getItem("sessionHistory") || "[]");
  } catch {
    return [];
  }
}

async function saveStreakToSupabase(data: StreakData): Promise<void> {
  try {
    const { error } = await supabase.from("rachas_usuario").upsert(
      {
        usuario_id:       getUserId(),
        racha_actual:     data.current,
        racha_maxima:     data.max,
        ultimo_ejercicio: data.lastExercise,
        historial_7dias:  data.history7,
      },
      { onConflict: "usuario_id" }
    );
    if (error) console.warn("[Supabase] racha:", error.message);
  } catch {}
}
