import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronRight, ChevronLeft, Hand, Home, Bot, Flame, Dumbbell, Calendar, BarChart2, Rocket, type LucideIcon } from "lucide-react";

const STEPS: Array<{ Icon: LucideIcon; title: string; desc: string; color: string }> = [
  {
    Icon: Hand,
    title: "¡Bienvenido/a a OldHealthy!",
    desc: "Tu app de ejercicios geriátricos personalizados. Te guiaremos por las secciones principales para que aproveches todo al máximo.",
    color: "#3D8A62",
  },
  {
    Icon: Home,
    title: "Tu pantalla de inicio",
    desc: "Aquí verás un mensaje de tu coach virtual, la racha de días activos, tus ejercicios recomendados y acceso rápido a todas las secciones.",
    color: "#3B9ED4",
  },
  {
    Icon: Bot,
    title: "Inteligencia Artificial",
    desc: "La IA analiza tu perfil y estado de ánimo para recomendarte los mejores ejercicios cada día. ¡Los ejercicios cambian según cómo te sientas!",
    color: "#E8648A",
  },
  {
    Icon: Flame,
    title: "Tu racha diaria",
    desc: "Cada día que completas al menos un ejercicio, tu racha aumenta. ¡Intenta mantenerla! Verás los últimos 7 días como puntos de colores.",
    color: "#E8648A",
  },
  {
    Icon: Dumbbell,
    title: "Categorías de ejercicios",
    desc: "Explora por zona del cuerpo: Piernas, Core, Brazos y Flexibilidad. Cada ejercicio incluye video, instrucciones y un temporizador automático.",
    color: "#7B52AB",
  },
  {
    Icon: Calendar,
    title: "Rutina semanal con IA",
    desc: "Pídele a la IA que genere un plan personalizado para los próximos 7 días, adaptado a tus objetivos y nivel de energía.",
    color: "#3D8A62",
  },
  {
    Icon: BarChart2,
    title: "Resumen semanal",
    desc: "Cada semana verás ejercicios completados, minutos totales y comparativa con la semana anterior. También puedes generar un reporte para tu médico.",
    color: "#3B9ED4",
  },
];

interface Props {
  onComplete: () => void;
}

export function OnboardingTutorial({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);

  const cur = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const next = () => {
    if (isLast) { onComplete(); return; }
    setDir(1);
    setStep(s => s + 1);
  };

  const prev = () => {
    if (step === 0) return;
    setDir(-1);
    setStep(s => s - 1);
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(10,20,15,0.82)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px", fontFamily: "Nunito, sans-serif",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: dir * 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir * -60 }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          style={{ background: "white", borderRadius: 28, padding: "36px 28px 28px", width: "100%", maxWidth: 440, position: "relative" }}
        >
          {/* Skip */}
          <button
            onClick={onComplete}
            title="Cerrar tutorial"
            style={{ position: "absolute", top: 16, right: 16, background: "#F0F0F0", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <X style={{ width: 18, height: 18, color: "#7A9B87" }} />
          </button>

          {/* Progress dots */}
          <div style={{ display: "flex", gap: 6, marginBottom: 28, justifyContent: "center" }}>
            {STEPS.map((_, i) => (
              <div
                key={i}
                style={{ width: i === step ? 22 : 8, height: 8, borderRadius: 4, background: i === step ? cur.color : "#E8E0EE", transition: "all 0.3s" }}
              />
            ))}
          </div>

          {/* Icon badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.08 }}
            style={{ width: 84, height: 84, borderRadius: 26, background: `${cur.color}18`, border: `2px solid ${cur.color}28`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px" }}
          >
            <cur.Icon size={40} color={cur.color} />
          </motion.div>

          {/* Title */}
          <h2 style={{ fontSize: "1.4rem", fontWeight: 900, color: "#1E3A2F", textAlign: "center", marginBottom: 12, lineHeight: 1.3 }}>
            {cur.title}
          </h2>

          {/* Description */}
          <p style={{ fontSize: "1rem", color: "#4A6754", fontWeight: 500, textAlign: "center", lineHeight: 1.7, marginBottom: 30 }}>
            {cur.desc}
          </p>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            {step > 0 && (
              <button
                onClick={prev}
                style={{ padding: "14px 18px", borderRadius: 16, border: `2px solid ${cur.color}35`, background: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "Nunito, sans-serif" }}
              >
                <ChevronLeft style={{ width: 18, height: 18, color: cur.color }} />
                <span style={{ fontSize: "0.9rem", fontWeight: 700, color: cur.color }}>Anterior</span>
              </button>
            )}
            <button
              onClick={next}
              style={{ flex: 1, padding: "16px 20px", borderRadius: 16, border: "none", background: `linear-gradient(135deg, ${cur.color}, ${cur.color}BB)`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "Nunito, sans-serif", boxShadow: `0 4px 16px ${cur.color}40` }}
            >
              <span style={{ fontSize: "1rem", fontWeight: 800, color: "white", display: "inline-flex", alignItems: "center", gap: 6 }}>
                {isLast ? <><Rocket size={16} color="white" /> ¡Empezar!</> : "Siguiente"}
              </span>
              {!isLast && <ChevronRight style={{ width: 18, height: 18, color: "white" }} />}
            </button>
          </div>

          <p style={{ textAlign: "center", fontSize: "0.76rem", color: "#9A8EAA", fontWeight: 600, marginTop: 14 }}>
            {step + 1} de {STEPS.length}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
