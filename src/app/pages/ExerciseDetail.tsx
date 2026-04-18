import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft, Clock, RotateCcw, Pause, Info, Play,
  Heart, Star, CheckCircle, X,
} from "lucide-react";
import { exercises, categories, type Exercise } from "../data/exercises";
import { useState, useEffect } from "react";

function getCategoryColors(id: string) {
  const map: Record<string, { from: string; to: string; lightBg: string }> = {
    "piernas-gluteos":        { from: "#2E7D52", to: "#4CAF7A", lightBg: "#E8F5EE" },
    "core":                   { from: "#1565C0", to: "#42A5F5", lightBg: "#E3F2FD" },
    "brazos-superior":        { from: "#E65100", to: "#FF8A50", lightBg: "#FFF3E0" },
    "movilidad-flexibilidad": { from: "#6A1B9A", to: "#AB47BC", lightBg: "#F3E5F5" },
  };
  return map[id] || { from: "#3D8A62", to: "#5BAF7A", lightBg: "#E8F5EE" };
}

function InfoCard({
  icon, label, value, lightBg, textColor,
}: {
  icon: React.ReactNode; label: string; value: string; lightBg: string; textColor: string;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-3 px-2 rounded-2xl" style={{ background: lightBg, minWidth: "75px" }}>
      <div className="mb-1">{icon}</div>
      <p style={{ fontSize: "0.78rem", color: textColor, fontWeight: 700, textAlign: "center", lineHeight: 1.2 }}>{value}</p>
      <p style={{ fontSize: "0.68rem", color: textColor, opacity: 0.7, fontWeight: 600, textAlign: "center" }}>{label}</p>
    </div>
  );
}

function parseSets(setsStr: string): number {
  const match = setsStr.match(/(\d+)/);
  return match ? Math.max(1, parseInt(match[1])) : 3;
}

function parseRestSeconds(restTimeStr: string): number {
  const match = restTimeStr.match(/(\d+)/);
  return match ? Math.max(10, parseInt(match[1])) : 30;
}

// ─── Guided modal ────────────────────────────────────────────────────────────

type GuidedPhase = "exercise" | "rest" | "done";

interface GuidedModalProps {
  exercise: Exercise;
  colors: { from: string; to: string; lightBg: string };
  onClose: () => void;
  onComplete: () => void;
}

function GuidedModal({ exercise, colors, onClose, onComplete }: GuidedModalProps) {
  const totalSets  = parseSets(exercise.sets);
  const restSecs   = parseRestSeconds(exercise.restTime);

  const [phase,      setPhase]      = useState<GuidedPhase>("exercise");
  const [currentSet, setCurrentSet] = useState(1);
  const [timer,      setTimer]      = useState(restSecs);

  // Countdown during rest phase
  useEffect(() => {
    if (phase !== "rest") return;
    if (timer <= 0) {
      if (currentSet < totalSets) {
        setCurrentSet((s) => s + 1);
        setPhase("exercise");
      } else {
        setPhase("done");
        onComplete();
      }
      return;
    }
    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, timer, currentSet, totalSets, onComplete]);

  const handleSetDone = () => {
    if (currentSet >= totalSets) {
      setPhase("done");
      onComplete();
    } else {
      setTimer(restSecs);
      setPhase("rest");
    }
  };

  const handleSkipRest = () => {
    setCurrentSet((s) => s + 1);
    setPhase("exercise");
  };

  const restRestLabel = exercise.restTime.split(" entre")[0];
  const circR = 60;
  const circC = 2 * Math.PI * circR;
  const strokeOffset = circC * (1 - timer / restSecs);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "rgba(10, 20, 15, 0.72)",
        display: "flex", alignItems: "flex-end",
        fontFamily: "Nunito, sans-serif",
      }}
    >
      <AnimatePresence mode="wait">

        {/* ── EXERCISE PHASE ── */}
        {phase === "exercise" && (
          <motion.div
            key="exercise"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0,   opacity: 1 }}
            exit={{   y: -50,  opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              width: "100%", maxWidth: 430, margin: "0 auto",
              background: "#F7F4F8",
              borderRadius: "28px 28px 0 0",
              padding: "28px 24px 44px",
            }}
          >
            {/* Top row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <span style={{
                fontSize: "0.82rem", fontWeight: 700, color: "#7A9B87",
                background: "#E8F0EC", padding: "4px 14px", borderRadius: 20,
              }}>
                Serie {currentSet} de {totalSets}
              </span>
              <button
                onClick={onClose}
                style={{
                  background: "#E8E0EE", border: "none", borderRadius: "50%",
                  width: 36, height: 36, display: "flex", alignItems: "center",
                  justifyContent: "center", cursor: "pointer",
                }}
              >
                <X style={{ width: 18, height: 18, color: "#7A9B87" }} />
              </button>
            </div>

            {/* Exercise name */}
            <h2 style={{ fontSize: "1.35rem", fontWeight: 900, color: "#1E3A2F", marginBottom: 14, lineHeight: 1.25 }}>
              {exercise.name}
            </h2>

            {/* Sets progress bar */}
            <div style={{ display: "flex", gap: 6, marginBottom: 22 }}>
              {Array.from({ length: totalSets }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: 6, flex: 1, borderRadius: 3,
                    background:
                      i < currentSet - 1 ? colors.from :
                      i === currentSet - 1 ? colors.to :
                      "#E0D8EA",
                    transition: "background 0.3s",
                  }}
                />
              ))}
            </div>

            {/* Reps display */}
            <div
              style={{
                background: colors.lightBg,
                border: `1.5px solid ${colors.from}22`,
                borderRadius: 20,
                padding: "26px 20px",
                textAlign: "center",
                marginBottom: 16,
              }}
            >
              <p style={{ fontSize: "0.78rem", color: colors.from, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>
                Repeticiones / Tiempo
              </p>
              <p style={{ fontSize: "1.9rem", fontWeight: 900, color: colors.from, lineHeight: 1.15 }}>
                {exercise.reps}
              </p>
            </div>

            {/* Rest hint */}
            <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#7A9B87", fontWeight: 600, marginBottom: 20 }}>
              ⏱️ Descansa {restRestLabel} entre series
            </p>

            {/* Done button */}
            <button
              onClick={handleSetDone}
              style={{
                width: "100%", padding: "18px 20px", borderRadius: 20,
                background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
                border: "none",
                boxShadow: `0 6px 20px ${colors.from}44`,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                cursor: "pointer",
                fontFamily: "Nunito, sans-serif",
              }}
            >
              <CheckCircle style={{ width: 24, height: 24, color: "white" }} />
              <span style={{ fontSize: "1.08rem", fontWeight: 800, color: "white" }}>
                {currentSet < totalSets ? "✓  Listo, siguiente serie" : "✓  ¡Terminé todas las series!"}
              </span>
            </button>
          </motion.div>
        )}

        {/* ── REST PHASE ── */}
        {phase === "rest" && (
          <motion.div
            key="rest"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0,   opacity: 1 }}
            exit={{   y: -50,  opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              width: "100%", maxWidth: 430, margin: "0 auto",
              background: "#EAF6FF",
              borderRadius: "28px 28px 0 0",
              padding: "28px 24px 44px",
              textAlign: "center",
            }}
          >
            {/* Top row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "#1565C0" }}>
                💪 Serie {currentSet} completada
              </span>
              <button
                onClick={onClose}
                style={{
                  background: "#C8DEF0", border: "none", borderRadius: "50%",
                  width: 36, height: 36, display: "flex", alignItems: "center",
                  justifyContent: "center", cursor: "pointer",
                }}
              >
                <X style={{ width: 18, height: 18, color: "#3B9ED4" }} />
              </button>
            </div>

            <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0D3C6E", marginBottom: 24 }}>
              Descansa un momento ☕
            </p>

            {/* Circular countdown */}
            <div style={{ position: "relative", width: 150, height: 150, margin: "0 auto 24px" }}>
              <svg width="150" height="150" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="75" cy="75" r={circR} fill="none" stroke="#C8DEF0" strokeWidth="9" />
                <circle
                  cx="75" cy="75" r={circR}
                  fill="none"
                  stroke="#3B9ED4"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={circC}
                  strokeDashoffset={strokeOffset}
                  style={{ transition: "stroke-dashoffset 0.95s linear" }}
                />
              </svg>
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: "3rem", fontWeight: 900, color: "#0D3C6E", lineHeight: 1 }}>{timer}</span>
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#3B9ED4" }}>segundos</span>
              </div>
            </div>

            <p style={{ fontSize: "0.9rem", color: "#3B9ED4", fontWeight: 600, marginBottom: 20 }}>
              Siguiente: Serie {currentSet + 1} de {totalSets}
            </p>

            <button
              onClick={handleSkipRest}
              style={{
                width: "100%", padding: "16px 20px", borderRadius: 18,
                background: "linear-gradient(135deg, #3B9ED4, #1565C0)",
                border: "none",
                boxShadow: "0 4px 16px rgba(59,158,212,0.35)",
                cursor: "pointer",
                fontFamily: "Nunito, sans-serif",
              }}
            >
              <span style={{ fontSize: "1rem", fontWeight: 800, color: "white" }}>
                Saltar descanso →
              </span>
            </button>
          </motion.div>
        )}

        {/* ── DONE PHASE ── */}
        {phase === "done" && (
          <motion.div
            key="done"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0,   opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            style={{
              width: "100%", maxWidth: 430, margin: "0 auto",
              background: "#F7F4F8",
              borderRadius: "28px 28px 0 0",
              padding: "36px 24px 48px",
              textAlign: "center",
            }}
          >
            {/* Trophy icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.12 }}
              style={{
                width: 92, height: 92, borderRadius: "50%",
                background: "linear-gradient(135deg, #3D8A62, #5BAF7A)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px",
                boxShadow: "0 8px 28px rgba(61,138,98,0.35)",
              }}
            >
              <span style={{ fontSize: "2.8rem" }}>🏆</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              style={{ fontSize: "1.85rem", fontWeight: 900, color: "#1E3A2F", marginBottom: 8, lineHeight: 1.2 }}
            >
              ¡Ejercicio completado!
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.32 }}
            >
              <p style={{ fontSize: "1rem", color: "#4A6754", fontWeight: 600, marginBottom: 2 }}>
                Hiciste <strong style={{ color: "#3D8A62" }}>{totalSets} {totalSets === 1 ? "serie" : "series"}</strong> de
              </p>
              <p style={{ fontSize: "1rem", color: "#3D8A62", fontWeight: 800, marginBottom: 22 }}>
                {exercise.name}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.42 }}
              style={{
                background: "#E8F5EE",
                border: "1.5px solid #B7DFC8",
                borderRadius: 18,
                padding: "16px 20px",
                marginBottom: 26,
              }}
            >
              <p style={{ fontSize: "0.95rem", color: "#2E7D52", fontWeight: 700, lineHeight: 1.5 }}>
                🌟 ¡Excelente trabajo!<br />
                Cada serie que haces cuida tu salud y movilidad.
              </p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={onClose}
              style={{
                width: "100%", padding: "18px 20px", borderRadius: 20,
                background: "linear-gradient(135deg, #3D8A62, #5BAF7A)",
                border: "none",
                boxShadow: "0 6px 20px rgba(61,138,98,0.3)",
                cursor: "pointer",
                fontFamily: "Nunito, sans-serif",
              }}
            >
              <span style={{ fontSize: "1.08rem", fontWeight: 800, color: "white" }}>
                ¡Perfecto! Volver al ejercicio
              </span>
            </motion.button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

function isCompletedToday(exerciseId: string): boolean {
  try {
    const data = JSON.parse(localStorage.getItem("completedExercises") || "{}");
    return data[exerciseId] === getTodayStr();
  } catch {
    return false;
  }
}

function markExerciseCompleted(exerciseId: string) {
  try {
    const data = JSON.parse(localStorage.getItem("completedExercises") || "{}");
    data[exerciseId] = getTodayStr();
    localStorage.setItem("completedExercises", JSON.stringify(data));
  } catch {}
}

export function ExerciseDetail() {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const [videoLoaded,  setVideoLoaded]  = useState(false);
  const [isFavorite,   setIsFavorite]   = useState(false);
  const [activeTab,    setActiveTab]    = useState<"instructions" | "benefits">("instructions");
  const [showGuided,   setShowGuided]   = useState(false);
  const [completedToday, setCompletedToday] = useState(() =>
    exerciseId ? isCompletedToday(exerciseId) : false
  );

  const exercise = exercises.find((e) => e.id === exerciseId);

  if (!exercise) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ fontFamily: "Nunito, sans-serif" }}>
        <p style={{ color: "#4A6754" }}>Ejercicio no encontrado</p>
      </div>
    );
  }

  const category = categories.find((c) => c.id === exercise.categoryId);
  const colors   = getCategoryColors(exercise.categoryId);

  const painLevelText  = exercise.maxPainLevel <= 2 ? "Muy suave" : exercise.maxPainLevel <= 3 ? "Leve" : "Moderado";
  const painLevelColor = exercise.maxPainLevel <= 2 ? "#2E7D52"   : exercise.maxPainLevel <= 3 ? "#E65100" : "#C62828";

  const handleComplete = () => {
    markExerciseCompleted(exercise.id);
    setCompletedToday(true);
  };

  return (
    <div className="min-h-screen pb-10" style={{ background: "#F6FAF7", fontFamily: "Nunito, sans-serif" }}>

      {/* Header */}
      <div
        className="px-5 pt-12 pb-5 relative"
        style={{ background: `linear-gradient(160deg, ${colors.from}, ${colors.to})` }}
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center active:scale-90 transition-transform"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center active:scale-90 transition-transform"
          >
            <Heart
              className="w-5 h-5"
              style={{ color: isFavorite ? "#FFB3B3" : "white" }}
              fill={isFavorite ? "#FFB3B3" : "transparent"}
            />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.75)", fontWeight: 600, background: "rgba(255,255,255,0.2)", padding: "3px 10px", borderRadius: "20px" }}>
            {category?.emoji} {category?.name}
          </span>
          <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.75)", fontWeight: 600, background: "rgba(255,255,255,0.2)", padding: "3px 10px", borderRadius: "20px" }}>
            {exercise.difficulty}
          </span>
        </div>

        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "white", lineHeight: 1.2 }}>
          {exercise.name}
        </h1>
      </div>

      <div className="px-5">
        {/* Info Cards */}
        <div className="flex gap-2 mt-4 mb-5">
          <InfoCard icon={<Clock    className="w-5 h-5" style={{ color: colors.from }} />} label="Duración" value={exercise.duration}                                   lightBg={colors.lightBg} textColor={colors.from} />
          <InfoCard icon={<RotateCcw className="w-5 h-5" style={{ color: colors.from }} />} label="Reps"     value={exercise.reps}                                      lightBg={colors.lightBg} textColor={colors.from} />
          <InfoCard icon={<Star     className="w-5 h-5" style={{ color: colors.from }} />} label="Series"   value={exercise.sets}                                      lightBg={colors.lightBg} textColor={colors.from} />
          <InfoCard icon={<Pause    className="w-5 h-5" style={{ color: colors.from }} />} label="Descanso" value={exercise.restTime.split(" ").slice(0, 2).join(" ")} lightBg={colors.lightBg} textColor={colors.from} />
        </div>

        {/* Pain Level */}
        <div className="rounded-2xl p-4 mb-5 flex items-center gap-3" style={{ background: "white", border: "1.5px solid #E8F5EE" }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#FFF8E7" }}>
            <span style={{ fontSize: "1.5rem" }}>⚠️</span>
          </div>
          <div>
            <p style={{ fontSize: "0.82rem", color: "#7A9B87", fontWeight: 600 }}>Dolor máximo recomendado</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: i <= exercise.maxPainLevel ? painLevelColor : "#E0EDE5" }} />
                ))}
              </div>
              <span style={{ fontSize: "0.88rem", fontWeight: 700, color: painLevelColor }}>
                {exercise.maxPainLevel}/5 – {painLevelText}
              </span>
            </div>
            <p style={{ fontSize: "0.78rem", color: "#7A9B87", fontWeight: 500, marginTop: "2px" }}>
              Si el dolor supera este nivel, detén el ejercicio
            </p>
          </div>
        </div>

        {/* Video */}
        <div className="mb-5">
          <h3 style={{ fontSize: "1.08rem", fontWeight: 800, color: "#1E3A2F", marginBottom: "12px" }}>
            🎬 Video Demostrativo
          </h3>
          <div className="rounded-2xl overflow-hidden shadow-md relative" style={{ paddingBottom: "56.25%", background: "#1A1A2E" }}>
            {!exercise.videoId ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6" style={{ background: `linear-gradient(160deg, ${colors.from}22, ${colors.to}33)`, border: `2px dashed ${colors.from}55`, borderRadius: "16px" }}>
                <span style={{ fontSize: "2.5rem" }}>🎥</span>
                <p style={{ fontSize: "1rem", fontWeight: 800, color: colors.from, textAlign: "center" }}>Video próximamente</p>
                <p style={{ fontSize: "0.82rem", color: "#7A9B87", fontWeight: 500, textAlign: "center", lineHeight: 1.5 }}>Sigue las instrucciones escritas hasta que el video esté disponible</p>
              </div>
            ) : !videoLoaded ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer" style={{ background: `linear-gradient(160deg, ${colors.from}CC, ${colors.to}CC)` }} onClick={() => setVideoLoaded(true)}>
                <div className="w-16 h-16 rounded-full bg-white/25 flex items-center justify-center mb-3">
                  <Play className="w-8 h-8 text-white" fill="white" style={{ marginLeft: "3px" }} />
                </div>
                <span className="text-white" style={{ fontSize: "1rem", fontWeight: 700 }}>Ver demostración</span>
                <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.75)", marginTop: "4px" }}>{exercise.name}</span>
              </div>
            ) : (
              <iframe className="absolute inset-0 w-full h-full" src={`https://www.youtube.com/embed/${exercise.videoId}?autoplay=1&rel=0`} title={exercise.name} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex rounded-2xl p-1 mb-4" style={{ background: "#E8F0EC" }}>
          {(["instructions", "benefits"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className="flex-1 py-2.5 rounded-xl transition-all" style={{ background: activeTab === tab ? "white" : "transparent", boxShadow: activeTab === tab ? "0 2px 8px rgba(0,0,0,0.1)" : "none" }}>
              <span style={{ fontSize: "0.9rem", fontWeight: 700, color: activeTab === tab ? "#1E3A2F" : "#7A9B87", fontFamily: "Nunito, sans-serif" }}>
                {tab === "instructions" ? "📋 Instrucciones" : "✨ Beneficios"}
              </span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="rounded-2xl p-5 mb-4" style={{ background: "white", border: "1.5px solid #E8F5EE" }}>
          {activeTab === "instructions" && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-5 h-5" style={{ color: colors.from }} />
                <h4 style={{ fontSize: "1rem", fontWeight: 800, color: "#1E3A2F" }}>Cómo realizar el ejercicio</h4>
              </div>
              <p style={{ fontSize: "1rem", color: "#2D4A38", fontWeight: 500, lineHeight: 1.7 }}>{exercise.description}</p>
              <div className="mt-4 pt-4" style={{ borderTop: "1.5px solid #E8F5EE" }}>
                <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#7A9B87", marginBottom: "6px" }}>DESCANSO ENTRE SERIES</p>
                <p style={{ fontSize: "0.95rem", color: "#2D4A38", fontWeight: 600 }}>⏱️ {exercise.restTime}</p>
              </div>
            </div>
          )}
          {activeTab === "benefits" && (
            <div>
              <div className="mb-4">
                <h4 style={{ fontSize: "1rem", fontWeight: 800, color: "#1E3A2F", marginBottom: "8px" }}>💡 ¿Por qué es importante?</h4>
                <p style={{ fontSize: "1rem", color: "#2D4A38", fontWeight: 500, lineHeight: 1.7 }}>{exercise.importance}</p>
              </div>
              <div className="pt-4" style={{ borderTop: "1.5px solid #E8F5EE" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: 800, color: "#1E3A2F", marginBottom: "8px" }}>🏠 ¿Cómo me ayuda en el día a día?</h4>
                <p style={{ fontSize: "1rem", color: "#2D4A38", fontWeight: 500, lineHeight: 1.7 }}>{exercise.dailyBenefit}</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Completed badge */}
        {completedToday && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 rounded-2xl px-5 py-3 mb-3"
            style={{ background: "#E8F5EE", border: "1.5px solid #B7DFC8" }}
          >
            <CheckCircle className="w-5 h-5" style={{ color: "#3D8A62", flexShrink: 0 }} />
            <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#2E7D52" }}>
              ¡Completado hoy! Puedes hacerlo de nuevo si quieres.
            </p>
          </motion.div>
        )}

        {/* Start button */}
        <button
          onClick={() => setShowGuided(true)}
          className="w-full py-5 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
          style={{
            background: completedToday
              ? "linear-gradient(135deg, #3D8A62, #5BAF7A)"
              : `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
            border: "none",
            boxShadow: completedToday
              ? "0 6px 20px rgba(61,138,98,0.4)"
              : `0 6px 20px ${colors.from}55`,
          }}
        >
          {completedToday
            ? <CheckCircle className="w-6 h-6 text-white" fill="white" />
            : <Play className="w-6 h-6 text-white" fill="white" />
          }
          <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "white", fontFamily: "Nunito, sans-serif" }}>
            {completedToday ? "Repetir ejercicio" : "Comenzar ejercicio"}
          </span>
        </button>

        <p className="text-center mt-3" style={{ fontSize: "0.82rem", color: "#7A9B87", fontWeight: 500 }}>
          Asegúrate de tener espacio libre y una silla cerca antes de empezar
        </p>
      </div>

      {/* Guided modal */}
      {showGuided && (
        <GuidedModal
          exercise={exercise}
          colors={colors}
          onClose={() => setShowGuided(false)}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}
