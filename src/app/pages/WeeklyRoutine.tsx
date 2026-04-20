import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, RefreshCw, Loader2, Calendar, Clock, Dumbbell } from "lucide-react";
import { exercises } from "../data/exercises";
import { loadStreaks, getSessionHistory } from "../../lib/streaks";
import { generateWeeklyRoutine, type WeeklyRoutineData, type RoutineDay } from "../../lib/anthropic";

const CACHE_KEY = "weeklyRoutine";

function loadCached(): WeeklyRoutineData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data: WeeklyRoutineData = JSON.parse(raw);
    // Invalidate if older than 7 days
    const age = Date.now() - new Date(data.generatedAt).getTime();
    if (age > 7 * 24 * 60 * 60 * 1000) return null;
    return data;
  } catch { return null; }
}

function saveCache(data: WeeklyRoutineData) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
}

const DAY_COLORS = ["#3D8A62", "#3B9ED4", "#7B52AB", "#E8648A", "#E65100", "#1565C0", "#2E7D52"];

function DayCard({ day, index }: { day: RoutineDay; index: number }) {
  const navigate = useNavigate();
  const color = DAY_COLORS[index % DAY_COLORS.length];
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      style={{ background: "white", borderRadius: 20, overflow: "hidden", border: "1.5px solid #E8F5EE", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
    >
      {/* Day header */}
      <button
        onClick={() => setExpanded(e => !e)}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", border: "none", background: "white", cursor: "pointer", textAlign: "left", fontFamily: "Nunito, sans-serif" }}
      >
        <div style={{ width: 48, height: 48, borderRadius: 14, background: day.rest ? "#F0F0F0" : `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {day.rest ? <span style={{ fontSize: "1.5rem" }}>😴</span> : <span style={{ fontSize: "1.4rem" }}>💪</span>}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "1rem", fontWeight: 800, color: "#1E3A2F", margin: 0, textTransform: "capitalize" }}>{day.dayName}</p>
          <p style={{ fontSize: "0.78rem", color: "#7A9B87", fontWeight: 600, margin: "2px 0 0" }}>
            {day.rest ? "Día de descanso" : `${day.exercises.length} ejercicios · ${day.totalMins} min`}
          </p>
        </div>
        {!day.rest && (
          <div style={{ width: 28, height: 28, borderRadius: 8, background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 900, color: "white" }}>{expanded ? "▲" : "▼"}</span>
          </div>
        )}
      </button>

      <AnimatePresence>
        {expanded && !day.rest && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "0 18px 18px", borderTop: "1px solid #F0F5F2" }}>
              {/* Tip */}
              {day.tip && (
                <p style={{ fontSize: "0.85rem", color: color, fontWeight: 600, marginBottom: 12, marginTop: 12, fontStyle: "italic" }}>
                  💡 {day.tip}
                </p>
              )}

              {/* Exercises */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {day.exercises.map((ex, i) => {
                  const exData = exercises.find(e => e.id === ex.id);
                  return (
                    <div
                      key={i}
                      onClick={() => exData && navigate(`/ejercicio/${ex.id}`)}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 14, background: `${color}0E`, border: `1px solid ${color}20`, cursor: exData ? "pointer" : "default" }}
                    >
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Dumbbell style={{ width: 16, height: 16, color: "white" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "0.92rem", fontWeight: 700, color: "#1E3A2F", margin: 0 }}>{ex.name}</p>
                        <p style={{ fontSize: "0.75rem", color: "#7A9B87", fontWeight: 600, margin: "2px 0 0" }}>
                          {ex.sets} series · {ex.reps}
                        </p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <Clock style={{ width: 13, height: 13, color: color }} />
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: color }}>{ex.estimatedMins} min</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
        {expanded && day.rest && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden" }}
          >
            <p style={{ padding: "12px 18px 18px", fontSize: "0.9rem", color: "#7A9B87", fontWeight: 600, borderTop: "1px solid #F0F5F2" }}>
              El descanso es parte del entrenamiento. Aprovecha para hidratarte bien y dormir suficiente. 🌙
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const MAX_RETRIES = 3;

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

export function WeeklyRoutine() {
  const navigate = useNavigate();
  const [routine,  setRoutine]  = useState<WeeklyRoutineData | null>(() => loadCached());
  const [loading,  setLoading]  = useState(false);
  const [attempt,  setAttempt]  = useState(0);
  const [error,    setError]    = useState(false);

  const profile = (() => {
    try { return JSON.parse(localStorage.getItem("userProfile") || "{}"); } catch { return {}; }
  })();

  const handleGenerate = async () => {
    setLoading(true);
    setError(false);
    setAttempt(0);

    const history   = getSessionHistory();
    const recentIds = history.slice(-8).map(s => s.exerciseId);
    const streaks   = loadStreaks();

    let result = null;
    for (let i = 0; i < MAX_RETRIES; i++) {
      setAttempt(i + 1);
      result = await generateWeeklyRoutine(profile, recentIds, streaks.current, exercises);
      if (result) break;
      if (i < MAX_RETRIES - 1) await sleep(1200);
    }

    setLoading(false);
    if (result) {
      saveCache(result);
      setRoutine(result);
    } else {
      setError(true);
    }
  };

  const formattedDate = routine
    ? new Date(routine.generatedAt).toLocaleDateString("es", { day: "numeric", month: "long" })
    : null;

  return (
    <div style={{ minHeight: "100vh", background: "#F7F4F8", fontFamily: "Nunito, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #3D8A62, #3B9ED4)", padding: "48px 24px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
          >
            <ChevronLeft style={{ width: 22, height: 22, color: "white" }} />
          </button>
          <div>
            <h1 style={{ color: "white", fontSize: "1.6rem", fontWeight: 900, margin: 0, lineHeight: 1.2 }}>
              🗓️ Mi Rutina Semanal
            </h1>
            {formattedDate && (
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.82rem", fontWeight: 600, margin: "4px 0 0" }}>
                Generada el {formattedDate}
              </p>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: "24px", maxWidth: 700, margin: "0 auto" }}>

        {/* Generate / Regenerate button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            width: "100%", padding: "16px 20px", borderRadius: 18, border: "none",
            background: loading ? "#E0D8EA" : "linear-gradient(135deg, #3D8A62, #3B9ED4)",
            cursor: loading ? "not-allowed" : "pointer", fontFamily: "Nunito, sans-serif",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            boxShadow: loading ? "none" : "0 4px 16px rgba(61,138,98,0.3)",
            marginBottom: 20,
          }}
        >
          {loading ? (
            <>
              <Loader2 style={{ width: 20, height: 20, color: "#9A8EAA" }} className="animate-spin" />
              <span style={{ fontSize: "1rem", fontWeight: 700, color: "#9A8EAA" }}>
                {attempt < 2
                  ? "Creando tu rutina personalizada..."
                  : `Reintentando... (${attempt}/${MAX_RETRIES})`}
              </span>
            </>
          ) : (
            <>
              {routine ? <RefreshCw style={{ width: 18, height: 18, color: "white" }} /> : <Calendar style={{ width: 18, height: 18, color: "white" }} />}
              <span style={{ fontSize: "1rem", fontWeight: 800, color: "white" }}>
                {routine ? "Regenerar rutina con IA" : "✨ Generar mi rutina con IA"}
              </span>
            </>
          )}
        </button>

        {/* Error */}
        {error && (
          <div style={{ background: "#FFF0F3", border: "1.5px solid #F9C5D5", borderRadius: 16, padding: "14px 18px", marginBottom: 20, textAlign: "center" }}>
            <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#E8648A" }}>
              No se pudo conectar con la IA. Por favor intenta de nuevo.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!routine && !loading && !error && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <span style={{ fontSize: "4rem", display: "block", marginBottom: 16 }}>🗓️</span>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#1E3A2F", marginBottom: 8 }}>
              ¡Crea tu plan semanal!
            </h2>
            <p style={{ fontSize: "0.95rem", color: "#4A6754", fontWeight: 500, lineHeight: 1.6 }}>
              La IA analizará tu perfil, historial y objetivos para diseñar un plan de ejercicios personalizado para los próximos 7 días.
            </p>
          </div>
        )}

        {/* Routine display */}
        {routine && !loading && (
          <>
            {/* Week goal */}
            <div style={{ background: "white", borderRadius: 18, padding: "16px 20px", marginBottom: 20, border: "1.5px solid #E8F5EE" }}>
              <p style={{ fontSize: "0.75rem", color: "#7A9B87", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Objetivo de la semana</p>
              <p style={{ fontSize: "1rem", fontWeight: 700, color: "#1E3A2F", lineHeight: 1.5 }}>
                🎯 {routine.weekGoal}
              </p>
            </div>

            {/* Days */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {routine.days.map((day, i) => (
                <DayCard key={day.date} day={day} index={i} />
              ))}
            </div>

            <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#9A8EAA", fontWeight: 500, marginTop: 20, lineHeight: 1.5 }}>
              Generado por IA · Consulta con tu médico antes de comenzar
            </p>
          </>
        )}
      </div>
    </div>
  );
}
