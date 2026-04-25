import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Heart, Star, ChevronRight, Award, BarChart2, Loader2, Calendar, Zap, Smile, Moon, Frown, Bot, Flame, MessageCircle, Stethoscope, Activity, ClipboardList, type LucideIcon } from "lucide-react";
import { categories, exercises, getRecommendedExercises } from "../data/exercises";
import { loadStreaks, getSessionHistory } from "../../lib/streaks";
import {
  getAIRecommendations,
  getMoodBasedExercises,
  getCoachMessage,
  type AiRecommendation,
  type MoodResult,
} from "../../lib/anthropic";

// ── Helpers de caché ─────────────────────────────────────────────────────────

function getTodayStr() { return new Date().toISOString().split("T")[0]; }

function profileHash(p: Record<string, unknown>): string {
  return btoa(encodeURIComponent(JSON.stringify({ name: p.name, age: p.age, mobility: p.mobility, painLevel: p.painLevel }))).slice(0, 20);
}

// ── Subcomponentes ────────────────────────────────────────────────────────────

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    Fácil:    { bg: "#E8F5EE", text: "#2E7D52" },
    Moderado: { bg: "#FFF3E0", text: "#E65100" },
    Avanzado: { bg: "#FDECEA", text: "#C62828" },
  };
  const c = colors[difficulty] || colors["Fácil"];
  return (
    <span style={{ background: c.bg, color: c.text, fontSize: "0.75rem", fontWeight: 700, padding: "2px 8px", borderRadius: "20px", fontFamily: "Nunito, sans-serif" }}>
      {difficulty}
    </span>
  );
}

const MOODS: { label: string; Icon: LucideIcon; color: string }[] = [
  { label: "Con energía", Icon: Zap,   color: "#3D8A62" },
  { label: "Normal",      Icon: Smile, color: "#3B9ED4" },
  { label: "Cansado/a",  Icon: Moon,  color: "#7B52AB" },
  { label: "Con dolor",  Icon: Frown, color: "#E8648A" },
];

// ── Componente principal ──────────────────────────────────────────────────────

export function Home() {
  const navigate  = useNavigate();
  const profile   = (() => { try { return JSON.parse(localStorage.getItem("userProfile") || "{}"); } catch { return {}; } })();
  const userName  = (profile.name as string) || "Amigo";
  const streaks   = loadStreaks();

  // Recomendaciones basadas en reglas (fallback)
  const fallbackRecs = getRecommendedExercises(profile);

  // ── Estado ───────────────────────────────────────────────────────────────
  const [coachMsg,     setCoachMsg]     = useState("");
  const [coachLoading, setCoachLoading] = useState(false);

  const [aiRecs,       setAiRecs]       = useState<AiRecommendation[]>([]);
  const [aiLoading,    setAiLoading]    = useState(false);

  const [mood,         setMood]         = useState<string | null>(null);
  const [customMood,   setCustomMood]   = useState("");
  const [moodData,     setMoodData]     = useState<MoodResult | null>(null);
  const [moodLoading,  setMoodLoading]  = useState(false);

  // ── TAREA 5: Mensaje del coach (una vez por día) ─────────────────────────
  useEffect(() => {
    const today = getTodayStr();
    const cached = (() => { try { return JSON.parse(localStorage.getItem("coachMessage") || "{}"); } catch { return {}; } })();
    if (cached.date === today && cached.message) { setCoachMsg(cached.message); return; }

    const history = getSessionHistory();
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const exercisedYesterday = history.some(s => s.date === yesterday.toISOString().split("T")[0]);

    setCoachLoading(true);
    getCoachMessage(profile, streaks.current, exercisedYesterday).then(msg => {
      setCoachLoading(false);
      if (msg) {
        setCoachMsg(msg);
        localStorage.setItem("coachMessage", JSON.stringify({ date: today, message: msg }));
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── TAREA 1: Recomendaciones con IA (cacheadas por hash del perfil) ───────
  useEffect(() => {
    if (!profile.name) return; // sin perfil todavía
    const today = getTodayStr();
    const hash  = profileHash(profile);
    const cached = (() => { try { return JSON.parse(localStorage.getItem("aiRecommendations") || "{}"); } catch { return {}; } })();

    if (cached.hash === hash && cached.date === today && Array.isArray(cached.recs)) {
      setAiRecs(cached.recs);
      return;
    }

    setAiLoading(true);
    getAIRecommendations(profile, exercises).then(recs => {
      setAiLoading(false);
      if (recs) {
        setAiRecs(recs);
        localStorage.setItem("aiRecommendations", JSON.stringify({ hash, date: today, recs }));
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mostrar resumen semanal automáticamente los domingos o si pasaron 7 días sin verlo
  useEffect(() => {
    const today     = getTodayStr();
    const dayOfWeek = new Date().getDay();
    const lastSeen  = localStorage.getItem("lastWeeklySummaryDate");
    const sevenAgo  = new Date(); sevenAgo.setDate(sevenAgo.getDate() - 7);
    const sevenAgoStr = sevenAgo.toISOString().split("T")[0];

    if ((dayOfWeek === 0 && lastSeen !== today) || (lastSeen != null && lastSeen < sevenAgoStr)) {
      navigate("/resumen-semanal");
    }
  }, [navigate]);

  // ── TAREA 4: Gestionar selección del estado de ánimo ─────────────────────
  const handleMoodSelect = async (selectedMood: string) => {
    setMood(selectedMood);
    setMoodData(null);

    const today  = getTodayStr();
    const cacheK = `moodFilter_${today}_${selectedMood}`;
    const cached = (() => { try { return JSON.parse(localStorage.getItem(cacheK) || "null"); } catch { return null; } })();
    if (cached?.filteredIds && cached?.message) { setMoodData(cached); return; }

    const ids = aiRecs.length ? aiRecs.map(r => r.id) : fallbackRecs.map(e => e.id);
    setMoodLoading(true);
    const result = await getMoodBasedExercises(profile, selectedMood, ids);
    setMoodLoading(false);
    if (result) {
      setMoodData(result);
      localStorage.setItem(cacheK, JSON.stringify(result));
    }
  };

  // ── Construir recomendaciones a mostrar ──────────────────────────────────
  // Si hay estado de ánimo + filtro IA → usar IDs filtrados por el ánimo
  // Si cargaron recomendaciones de IA → usarlas (tienen explicaciones)
  // Si no → fallback basado en reglas
  const displayedIds: string[] = moodData?.filteredIds.length
    ? moodData.filteredIds
    : aiRecs.length
    ? aiRecs.map(r => r.id)
    : fallbackRecs.map(e => e.id);

  const displayedExercises = displayedIds
    .map(id => exercises.find(e => e.id === id))
    .filter(Boolean) as typeof exercises;

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "¡Buenos días";
    if (h < 18) return "¡Buenas tardes";
    return "¡Buenas noches";
  };

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 32, background: "#F7F4F8", fontFamily: "Nunito, sans-serif" }}>

      {/* ── Tricolor header ── */}
      <div className="px-5 pt-14 pb-6" style={{ background: "linear-gradient(135deg, #3D8A62 0%, #3B9ED4 55%, #E8648A 100%)" }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.85)", fontWeight: 600, marginBottom: 2 }}>{getGreeting()},</p>
            <h1 style={{ fontSize: "1.8rem", color: "white", fontWeight: 800, lineHeight: 1.2 }}>{userName}!</h1>
            <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.78)", fontWeight: 500, marginTop: 4 }}>Listos tus ejercicios personalizados</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" fill="white" />
            </div>
            <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.75)", fontWeight: 700, letterSpacing: "0.04em" }}>OldHealthy</p>
          </div>
        </div>
        <div className="flex gap-3 mt-2">
          {([
            { label: "Ejercicios", value: `${exercises.length}`, Icon: Activity },
            { label: "Categorías",  value: "4",                  Icon: ClipboardList },
            { label: "Para ti",     value: `${displayedExercises.length}`, Icon: Star },
          ] as { label: string; value: string; Icon: LucideIcon }[]).map(stat => (
            <div key={stat.label} className="flex-1 py-3 px-3 rounded-2xl flex flex-col items-center" style={{ background: "rgba(255,255,255,0.15)" }}>
              <stat.Icon size={18} color="rgba(255,255,255,0.9)" />
              <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "white", lineHeight: 1, marginTop: 2 }}>{stat.value}</span>
              <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.82)", fontWeight: 600 }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5">

        {/* ── TAREA 5: Coach message ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          style={{ background: "linear-gradient(135deg, #1E3A2F, #2D5040)", borderRadius: 20, padding: "16px 18px", marginTop: 20, marginBottom: 16 }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Bot size={20} color="rgba(255,255,255,0.9)" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.55)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Tu coach diario</p>
              {coachLoading ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Loader2 style={{ width: 16, height: 16, color: "rgba(255,255,255,0.5)" }} className="animate-spin" />
                  <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>Preparando tu mensaje...</span>
                </div>
              ) : coachMsg ? (
                <p style={{ fontSize: "0.92rem", color: "rgba(255,255,255,0.88)", fontWeight: 500, lineHeight: 1.65 }}>{coachMsg}</p>
              ) : (
                <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>
                  ¡Hola {userName}! Completa tu perfil para recibir mensajes personalizados.
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Streak card ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          style={{ background: "white", borderRadius: 20, padding: "16px", marginBottom: 16, border: "1.5px solid #E8F5EE", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Flame size={24} color="#F97316" />
              <div>
                <p style={{ fontSize: "1.1rem", fontWeight: 900, color: "#1E3A2F", margin: 0, lineHeight: 1 }}>
                  {streaks.current} {streaks.current === 1 ? "día" : "días"} de racha
                </p>
                <p style={{ fontSize: "0.75rem", color: "#7A9B87", fontWeight: 600, marginTop: 2 }}>
                  Récord: {streaks.max} {streaks.max === 1 ? "día" : "días"}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/resumen-semanal")}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 12, background: "#EAF6FF", border: "none", cursor: "pointer" }}
            >
              <BarChart2 style={{ width: 15, height: 15, color: "#3B9ED4" }} />
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#3B9ED4", fontFamily: "Nunito, sans-serif" }}>Resumen</span>
            </button>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {streaks.history7.map((did, i) => {
              const d = new Date(); d.setDate(d.getDate() - (6 - i));
              const label = d.toLocaleDateString("es", { weekday: "short" }).slice(0, 2);
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: did ? "#3D8A62" : "#E8F0EC", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {did && <span style={{ fontSize: "0.7rem", color: "white" }}>✓</span>}
                  </div>
                  <span style={{ fontSize: "0.62rem", color: "#9A8EAA", fontWeight: 700, textTransform: "uppercase" }}>{label}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── TAREA 4: Mood selector ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          style={{ background: "white", borderRadius: 20, padding: "16px 18px", marginBottom: 16, border: "1.5px solid #E8F5EE" }}
        >
          <p style={{ fontSize: "0.9rem", fontWeight: 800, color: "#1E3A2F", marginBottom: 12 }}>
            ¿Cómo te sientes hoy?
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: customMood !== undefined ? 0 : 0 }}>
            {MOODS.map(m => {
              const MoodIcon = m.Icon;
              return (
                <button
                  key={m.label}
                  onClick={() => { setCustomMood(""); handleMoodSelect(m.label); }}
                  style={{
                    padding: "8px 14px", borderRadius: 20, border: `2px solid ${mood === m.label ? m.color : "#E8E0EE"}`,
                    background: mood === m.label ? `${m.color}15` : "white",
                    cursor: "pointer", fontFamily: "Nunito, sans-serif",
                    display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s",
                  }}
                >
                  <MoodIcon size={16} color={mood === m.label ? m.color : "#9A8EAA"} />
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: mood === m.label ? m.color : "#4A6754" }}>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Custom mood input */}
          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            <input
              type="text"
              value={customMood}
              onChange={e => setCustomMood(e.target.value)}
              placeholder="O escribe cómo te sientes..."
              style={{ flex: 1, padding: "9px 14px", borderRadius: 14, border: "2px solid #E8E0EE", fontSize: "0.88rem", fontFamily: "Nunito, sans-serif", fontWeight: 600, color: "#1E3A2F", outline: "none", background: "white" }}
              onKeyDown={e => { if (e.key === "Enter" && customMood.trim()) { setMood(customMood.trim()); handleMoodSelect(customMood.trim()); } }}
            />
            {customMood.trim() && (
              <button
                onClick={() => { setMood(customMood.trim()); handleMoodSelect(customMood.trim()); }}
                style={{ padding: "9px 14px", borderRadius: 14, border: "none", background: "#3B9ED4", cursor: "pointer", fontFamily: "Nunito, sans-serif" }}
              >
                <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "white" }}>OK</span>
              </button>
            )}
          </div>

          {/* Mood AI message */}
          {moodLoading && (
            <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
              <Loader2 style={{ width: 16, height: 16, color: "#3B9ED4" }} className="animate-spin" />
              <span style={{ fontSize: "0.82rem", color: "#7A9B87", fontWeight: 600 }}>Ajustando ejercicios para tu estado...</span>
            </div>
          )}
          {moodData?.message && !moodLoading && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: 10, background: "#EAF6FF", borderRadius: 12, padding: "10px 14px" }}
            >
              <p style={{ fontSize: "0.85rem", color: "#0D3C6E", fontWeight: 600, lineHeight: 1.6, display: "flex", alignItems: "flex-start", gap: 6 }}>
                <MessageCircle size={15} color="#3B9ED4" style={{ flexShrink: 0, marginTop: 2 }} />
                {moodData.message}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* ── TAREA 1: AI Recommended exercises ── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#FDE8F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Star style={{ width: 16, height: 16, color: "#E8648A" }} fill="#E8648A" />
            </div>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#1E3A2F" }}>
              {mood ? `Ejercicios para hoy · ${mood}` : "Recomendados para ti"}
            </h2>
            {aiLoading && <Loader2 style={{ width: 16, height: 16, color: "#3B9ED4" }} className="animate-spin" />}
          </div>

          {aiLoading && !aiRecs.length && (
            <p style={{ fontSize: "0.82rem", color: "#7A9B87", fontWeight: 600, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <Bot size={15} color="#7A9B87" />
              La IA está analizando tu perfil...
            </p>
          )}

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 md:flex-wrap md:overflow-visible" style={{ scrollbarWidth: "none" }}>
            {displayedExercises.map((exercise, i) => {
              const category = categories.find(c => c.id === exercise.categoryId);
              const aiExpl   = aiRecs.find(r => r.id === exercise.id)?.explanation;
              return (
                <motion.button
                  key={exercise.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => navigate(`/ejercicio/${exercise.id}`)}
                  className="flex-shrink-0 text-left active:scale-95 transition-transform md:flex-shrink"
                  style={{ width: aiExpl ? 220 : 200 }}
                >
                  <div style={{ background: "white", borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
                    <div className="h-28 flex items-center justify-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${getCategoryColors(exercise.categoryId).from}, ${getCategoryColors(exercise.categoryId).to})` }}>
                      <span style={{ fontSize: "3rem" }}>{category?.emoji}</span>
                      {aiExpl && (
                        <div style={{ position: "absolute", top: 6, left: 6, background: "rgba(255,255,255,0.25)", borderRadius: 8, padding: "2px 7px" }}>
                          <Bot size={11} color="white" style={{ display: "inline-block", marginRight: 2 }} /><span style={{ fontSize: "0.65rem", fontWeight: 800, color: "white" }}>IA</span>
                        </div>
                      )}
                      <div style={{ position: "absolute", top: 6, right: 6 }}>
                        <div className="w-7 h-7 rounded-full bg-white/25 flex items-center justify-center">
                          <Award style={{ width: 14, height: 14, color: "white" }} />
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: 12 }}>
                      <p style={{ fontSize: "0.92rem", fontWeight: 800, color: "#1E3A2F", lineHeight: 1.3, marginBottom: 4 }}>{exercise.name}</p>
                      {aiExpl && (
                        <p style={{ fontSize: "0.72rem", color: "#4A6754", fontWeight: 500, lineHeight: 1.5, marginBottom: 6 }}>
                          {aiExpl}
                        </p>
                      )}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <DifficultyBadge difficulty={exercise.difficulty} />
                        <span style={{ fontSize: "0.75rem", color: "#7A9B87", fontWeight: 600 }}>{exercise.duration}</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── Weekly Routine CTA ── */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          onClick={() => navigate("/rutina-semanal")}
          style={{ width: "100%", marginBottom: 20, padding: "16px 20px", borderRadius: 18, border: "none", background: "linear-gradient(135deg, #3D8A62, #5BAF7A)", cursor: "pointer", fontFamily: "Nunito, sans-serif", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 4px 16px rgba(61,138,98,0.28)" }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Calendar style={{ width: 22, height: 22, color: "white" }} />
          </div>
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: "0.95rem", fontWeight: 800, color: "white", margin: 0 }}>Generar rutina semanal con IA</p>
            <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.78)", fontWeight: 600, margin: "2px 0 0" }}>Plan personalizado de 7 días</p>
          </div>
          <ChevronRight style={{ marginLeft: "auto", width: 20, height: 20, color: "rgba(255,255,255,0.8)" }} />
        </motion.button>

        {/* ── Categories ── */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#1E3A2F", marginBottom: 16 }}>Todas las categorías</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category, i) => {
              const colors = getCategoryColors(category.id);
              const catEx  = exercises.filter(e => e.categoryId === category.id);
              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22 + i * 0.07 }}
                  onClick={() => navigate(`/categoria/${category.id}`)}
                  className="w-full text-left active:scale-98 transition-transform"
                >
                  <div style={{ background: "white", borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", minHeight: 96 }}>
                    <div style={{ width: 96, background: `linear-gradient(160deg, ${colors.from}, ${colors.to})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: "2.4rem" }}>{category.emoji}</span>
                    </div>
                    <div style={{ flex: 1, padding: "14px 16px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <p style={{ fontSize: "1rem", fontWeight: 800, color: "#1E3A2F", marginBottom: 4, lineHeight: 1.3 }}>{category.name}</p>
                      <p style={{ fontSize: "0.82rem", color: "#4A6754", fontWeight: 500, lineHeight: 1.4, marginBottom: 8 }}>{category.description}</p>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "0.78rem", fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: colors.lightBg, color: colors.from }}>
                          {catEx.length} ejercicios
                        </span>
                        <ChevronRight style={{ width: 18, height: 18, color: "#9BB8A8" }} />
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── Disclaimer ── */}
        <div style={{ padding: "14px 18px", borderRadius: 18, display: "flex", alignItems: "flex-start", gap: 12, background: "#EAF6FF", border: "1.5px solid #A8D8F0" }}>
          <Stethoscope size={20} color="#1A5276" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: "0.85rem", color: "#1A5276", fontWeight: 600, lineHeight: 1.5 }}>
            Recuerda consultar con tu médico o fisioterapeuta antes de comenzar cualquier rutina nueva.
          </p>
        </div>
      </div>
    </div>
  );
}

function getCategoryColors(id: string) {
  const map: Record<string, { from: string; to: string; lightBg: string }> = {
    "piernas-gluteos":        { from: "#2E7D52", to: "#4CAF7A", lightBg: "#E8F5EE" },
    "core":                   { from: "#1B77B8", to: "#4DBBF0", lightBg: "#E1F4FF" },
    "brazos-superior":        { from: "#E8648A", to: "#F4A0B5", lightBg: "#FDEEF3" },
    "movilidad-flexibilidad": { from: "#7B52AB", to: "#B48FD8", lightBg: "#F3EDF8" },
  };
  return map[id] || { from: "#3D8A62", to: "#5BAF7A", lightBg: "#E8F5EE" };
}
