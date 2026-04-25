import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { X, TrendingUp, TrendingDown, Minus, Dumbbell, Target, Wind, Trophy, Star, Leaf, Flame, PartyPopper, type LucideIcon } from "lucide-react";
import { getSessionHistory } from "../../lib/streaks";
import { loadStreaks } from "../../lib/streaks";

const CATEGORY_META: Record<string, { name: string; Icon: LucideIcon }> = {
  "piernas-gluteos":        { name: "Piernas y Glúteos", Icon: Dumbbell },
  "core":                   { name: "Core",              Icon: Target },
  "brazos-superior":        { name: "Brazos",            Icon: Dumbbell },
  "movilidad-flexibilidad": { name: "Flexibilidad",      Icon: Wind },
};

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

function getWeekRange(weeksAgo: number): { start: string; end: string } {
  const today = new Date();
  const dow = today.getDay();
  const daysToMon = dow === 0 ? 6 : dow - 1;
  const mon = new Date(today);
  mon.setDate(today.getDate() - daysToMon - weeksAgo * 7);
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  return { start: fmt(mon), end: fmt(sun) };
}

function motivational(count: number): { Icon: LucideIcon; title: string; color: string; msg: string } {
  if (count >= 5)
    return { Icon: Trophy,   title: "¡Semana excepcional!", color: "#3D8A62", msg: "Completaste 5 o más ejercicios. Tu disciplina es admirable. ¡Sigue así!" };
  if (count >= 3)
    return { Icon: Star,     title: "¡Buena semana!",       color: "#3B9ED4", msg: "Hiciste 3-4 ejercicios esta semana. Vas por muy buen camino." };
  if (count >= 1)
    return { Icon: Dumbbell, title: "¡Empezando fuerte!",   color: "#E8648A", msg: "Completaste 1-2 ejercicios. Cada paso cuenta. ¡Añade uno más la próxima semana!" };
  return   { Icon: Leaf,     title: "¡Esta semana es tu oportunidad!", color: "#7B52AB", msg: "No registramos ejercicios esta semana. Mañana es un nuevo día. ¡Empieza con algo sencillo!" };
}

interface WeeklySummaryProps {
  onClose?: () => void;
}

export function WeeklySummary({ onClose }: WeeklySummaryProps) {
  const navigate  = useNavigate();
  const sessions  = getSessionHistory();
  const streaks   = loadStreaks();

  const thisWeek = getWeekRange(0);
  const lastWeek = getWeekRange(1);

  const thisSessions = sessions.filter((s) => s.date >= thisWeek.start && s.date <= thisWeek.end);
  const lastSessions = sessions.filter((s) => s.date >= lastWeek.start && s.date <= lastWeek.end);

  const thisCount   = thisSessions.length;
  const lastCount   = lastSessions.length;
  const totalMins   = Math.round(thisSessions.reduce((acc, s) => acc + s.durationSecs, 0) / 60);

  const catCounts: Record<string, number> = {};
  thisSessions.forEach((s) => { catCounts[s.categoryId] = (catCounts[s.categoryId] || 0) + 1; });
  const topCat = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0];

  const comparison =
    lastCount > 0 ? Math.round(((thisCount - lastCount) / lastCount) * 100) :
    thisCount > 0 ? 100 : 0;
  const hasPrevWeek = lastCount > 0;

  const motive = motivational(thisCount);
  const MotiveIcon = motive.Icon;

  const handleClose = () => {
    localStorage.setItem("lastWeeklySummaryDate", getTodayStr());
    onClose ? onClose() : navigate(-1);
  };

  useEffect(() => {
    // Marcar como visto al montar el componente
    localStorage.setItem("lastWeeklySummaryDate", getTodayStr());
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#F7F4F8", fontFamily: "Nunito, sans-serif" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${motive.color} 0%, #3B9ED4 100%)`, padding: "48px 24px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, maxWidth: 720, margin: "0 auto 16px" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.78)", fontSize: "0.85rem", fontWeight: 600, marginBottom: 4 }}>
              Semana del {thisWeek.start} al {thisWeek.end}
            </p>
            <h1 style={{ color: "white", fontSize: "1.75rem", fontWeight: 900, lineHeight: 1.2, display: "flex", alignItems: "center", gap: 10 }}>
              <MotiveIcon size={28} color="white" />
              {motive.title}
            </h1>
          </div>
          <button
            onClick={handleClose}
            style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
          >
            <X style={{ width: 20, height: 20, color: "white" }} />
          </button>
        </div>
      </div>

      <div style={{ padding: "24px", maxWidth: 760, margin: "0 auto" }}>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 14, marginBottom: 20 }}>
          <StatCard label="Ejercicios" value={thisCount} unit="esta semana" color="#3D8A62" />
          <StatCard label="Minutos" value={totalMins} unit="ejercitados" color="#3B9ED4" />
          <StatCard label="Racha actual" value={streaks.current} unit={<>días seguidos <Flame size={13} color="#E8648A" style={{ display: "inline-block", verticalAlign: "middle" }} /></>} color="#E8648A" />
        </div>

        {/* Comparison with last week */}
        {hasPrevWeek && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ background: "white", borderRadius: 18, padding: "16px 20px", marginBottom: 16, border: "1.5px solid #E8F5EE", display: "flex", alignItems: "center", gap: 14 }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 14, background: comparison > 0 ? "#E8F5EE" : comparison < 0 ? "#FFF0F3" : "#F0F0F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {comparison > 0
                ? <TrendingUp style={{ width: 22, height: 22, color: "#3D8A62" }} />
                : comparison < 0
                ? <TrendingDown style={{ width: 22, height: 22, color: "#E8648A" }} />
                : <Minus style={{ width: 22, height: 22, color: "#9A8EAA" }} />}
            </div>
            <div>
              <p style={{ fontSize: "0.8rem", color: "#7A9B87", fontWeight: 600, marginBottom: 2 }}>Comparado con la semana anterior</p>
              <p style={{ fontSize: "1.15rem", fontWeight: 800, color: comparison > 0 ? "#3D8A62" : comparison < 0 ? "#E8648A" : "#4A6754", display: "flex", alignItems: "center", gap: 6 }}>
                {comparison > 0
                  ? <><span>+{comparison}% más ejercicios</span><PartyPopper size={16} color="#3D8A62" /></>
                  : comparison < 0
                  ? `${comparison}% menos ejercicios`
                  : "Igual que la semana pasada"}
              </p>
            </div>
          </motion.div>
        )}

        {/* Top category */}
        {topCat && CATEGORY_META[topCat[0]] && (() => {
          const CatIcon = CATEGORY_META[topCat[0]].Icon;
          return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            style={{ background: "white", borderRadius: 18, padding: "16px 20px", marginBottom: 16, border: "1.5px solid #E8F5EE", display: "flex", alignItems: "center", gap: 14 }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "#E8F5EE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <CatIcon size={24} color="#3D8A62" />
            </div>
            <div>
              <p style={{ fontSize: "0.8rem", color: "#7A9B87", fontWeight: 600, marginBottom: 2 }}>Categoría más trabajada</p>
              <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1E3A2F" }}>{CATEGORY_META[topCat[0]].name}</p>
              <p style={{ fontSize: "0.82rem", color: "#4A6754", fontWeight: 600 }}>
                {topCat[1]} ejercicio{topCat[1] > 1 ? "s" : ""} completado{topCat[1] > 1 ? "s" : ""}
              </p>
            </div>
          </motion.div>
          );
        })()}

        {/* 7-day history dots */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          style={{ background: "white", borderRadius: 18, padding: "16px 20px", marginBottom: 20, border: "1.5px solid #E8F5EE" }}
        >
          <p style={{ fontSize: "0.8rem", color: "#7A9B87", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
            Últimos 7 días
          </p>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {streaks.history7.map((did, i) => {
              const d = new Date();
              d.setDate(d.getDate() - (6 - i));
              const label = d.toLocaleDateString("es", { weekday: "short" }).slice(0, 2);
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: did ? "#3D8A62" : "#E0EDE5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {did && <span style={{ fontSize: "0.75rem", color: "white" }}>✓</span>}
                  </div>
                  <span style={{ fontSize: "0.65rem", color: "#9A8EAA", fontWeight: 700, textTransform: "uppercase" }}>{label}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Motivational message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          style={{ background: `${motive.color}14`, border: `1.5px solid ${motive.color}35`, borderRadius: 18, padding: "18px 20px", marginBottom: 24 }}
        >
          <p style={{ fontSize: "1rem", color: motive.color, fontWeight: 700, lineHeight: 1.65 }}>
            {motive.msg}
          </p>
        </motion.div>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          onClick={() => { localStorage.setItem("lastWeeklySummaryDate", getTodayStr()); navigate("/inicio"); }}
          style={{
            width: "100%", padding: "18px 20px", borderRadius: 20,
            background: `linear-gradient(135deg, ${motive.color}, #3B9ED4)`,
            border: "none", cursor: "pointer", fontFamily: "Nunito, sans-serif",
            boxShadow: `0 4px 20px ${motive.color}44`,
          }}
        >
          <span style={{ fontSize: "1.05rem", fontWeight: 800, color: "white", display: "inline-flex", alignItems: "center", gap: 8 }}>
            ¡Seguir ejercitándome! <Dumbbell size={18} color="white" />
          </span>
        </motion.button>
      </div>
    </div>
  );
}

function StatCard({ label, value, unit, color }: { label: string; value: number; unit: React.ReactNode; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ background: "white", borderRadius: 18, padding: "18px 16px", border: "1.5px solid #E8F5EE" }}
    >
      <p style={{ fontSize: "0.72rem", color: "#7A9B87", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: "2.4rem", fontWeight: 900, color, lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: "0.8rem", color: "#4A6754", fontWeight: 600, marginTop: 2 }}>{unit}</p>
    </motion.div>
  );
}
