import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Edit2, FileText, BookOpen } from "lucide-react";

type Profile = Record<string, string | string[]>;

// ── Helpers visuales ─────────────────────────────────────────────────────────

function str(v: unknown): string {
  if (Array.isArray(v)) return v.join(", ");
  return v ? String(v) : "—";
}

function Pill({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "5px 13px",
        borderRadius: 20,
        fontSize: "0.82rem",
        fontWeight: 700,
        background: `${color}18`,
        color,
        border: `1.5px solid ${color}30`,
        margin: "3px",
        fontFamily: "Nunito, sans-serif",
      }}
    >
      {label}
    </span>
  );
}

function InfoRow({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  if (!value || value === "—") return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "10px 0",
        borderBottom: "1px solid #F0F5F2",
      }}
    >
      <span style={{ fontSize: "1.15rem", flexShrink: 0, marginTop: 1 }}>{emoji}</span>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: "0.72rem", color: "#9A8EAA", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", margin: 0, marginBottom: 2 }}>
          {label}
        </p>
        <p style={{ fontSize: "0.95rem", color: "#1E3A2F", fontWeight: 600, margin: 0, lineHeight: 1.4 }}>
          {value}
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "white", borderRadius: 20, padding: "18px 20px", marginBottom: 14, border: "1.5px solid #E8F5EE", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
      <p style={{ fontSize: "0.72rem", color: "#7A9B87", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
        {title}
      </p>
      {children}
    </div>
  );
}

// ── Visualización del nivel de dolor ──────────────────────────────────────────

function PainDots({ level }: { level: number }) {
  const colors = level <= 2 ? "#3D8A62" : level <= 3 ? "#E65100" : "#E8648A";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ display: "flex", gap: 4 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: i <= level ? colors : "#E0EDE5" }} />
        ))}
      </div>
      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: colors }}>
        {level}/5
      </span>
    </div>
  );
}

// ── Estado vacío ──────────────────────────────────────────────────────────────

function EmptyProfile({ onEdit }: { onEdit: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 24px" }}>
      <span style={{ fontSize: "4rem", display: "block", marginBottom: 16 }}>👤</span>
      <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#1E3A2F", marginBottom: 8 }}>
        Aún no tienes perfil
      </h2>
      <p style={{ fontSize: "0.95rem", color: "#4A6754", fontWeight: 500, lineHeight: 1.6, marginBottom: 24 }}>
        Completa el cuestionario para que podamos personalizar tus ejercicios.
      </p>
      <button
        onClick={onEdit}
        style={{ padding: "16px 32px", borderRadius: 18, border: "none", background: "linear-gradient(135deg, #3D8A62, #5BAF7A)", cursor: "pointer", fontFamily: "Nunito, sans-serif", boxShadow: "0 4px 16px rgba(61,138,98,0.3)" }}
      >
        <span style={{ fontSize: "1rem", fontWeight: 800, color: "white" }}>Crear mi perfil</span>
      </button>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

export function Profile() {
  const navigate = useNavigate();

  const profile: Profile = (() => {
    try { return JSON.parse(localStorage.getItem("userProfile") || "{}"); } catch { return {}; }
  })();

  const hasProfile = !!profile.name;

  // Derivar nivel de dolor del perfil (misma lógica que exercises.ts)
  const painAreas = (profile.painAreas as string[]) || [];
  const hasPain = painAreas.length > 0 && !painAreas.includes("No tengo dolor");
  const painLevel = hasPain ? (painAreas.length >= 3 ? 4 : painAreas.length >= 2 ? 3 : 2) : 1;

  const sexEmoji: Record<string, string> = {
    "Masculino": "👨",
    "Femenino": "👩",
    "Prefiero no decirlo": "🙂",
  };

  const mobilityEmoji = (m: string) => {
    if (m?.includes("silla de ruedas")) return "♿";
    if (m?.includes("bastón") || m?.includes("andador")) return "🦯";
    if (m?.includes("dificultad")) return "🚶";
    return "🚶";
  };

  const initials = (profile.name as string || "?")
    .split(" ")
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() || "")
    .join("");

  const goals = (profile.goals as string[]) || [];
  const painAreasDisplay = painAreas.filter(p => p !== "No tengo dolor");
  const stiffnessZones = ((profile.stiffnessZone as string[]) || []).filter(s => s !== "No aplica");

  return (
    <div style={{ minHeight: "100vh", background: "#F7F4F8", fontFamily: "Nunito, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #3D8A62 0%, #3B9ED4 55%, #E8648A 100%)", padding: "48px 24px 60px" }}>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
          Mi perfil
        </p>
        <h1 style={{ color: "white", fontSize: "1.7rem", fontWeight: 900, margin: 0, lineHeight: 1.2 }}>
          {hasProfile ? (profile.name as string) : "Sin perfil"}
        </h1>
        {profile.age && (
          <p style={{ color: "rgba(255,255,255,0.82)", fontSize: "0.92rem", fontWeight: 600, marginTop: 4 }}>
            {profile.age}{profile.sex ? ` · ${profile.sex}` : ""}
          </p>
        )}
      </div>

      {/* Avatar bubble (overlaps header) */}
      {hasProfile && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: -44 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 280, damping: 20 }}
            style={{ width: 88, height: 88, borderRadius: "50%", background: "white", border: "4px solid white", boxShadow: "0 6px 24px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <span style={{ fontSize: "1.6rem", fontWeight: 900, color: "#3D8A62" }}>{initials}</span>
          </motion.div>
        </div>
      )}

      <div style={{ padding: hasProfile ? "16px 20px 32px" : "20px", maxWidth: 700, margin: "0 auto" }}>
        {!hasProfile ? (
          <EmptyProfile onEdit={() => navigate("/cuestionario")} />
        ) : (
          <>
            {/* Action buttons */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <button
                onClick={() => navigate("/cuestionario")}
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 16px", borderRadius: 16, border: "2px solid #3D8A62", background: "white", cursor: "pointer", fontFamily: "Nunito, sans-serif" }}
              >
                <Edit2 style={{ width: 16, height: 16, color: "#3D8A62" }} />
                <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#3D8A62" }}>Editar perfil</span>
              </button>
              <button
                onClick={() => navigate("/reporte-medico")}
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 16px", borderRadius: 16, border: "none", background: "#1E3A2F", cursor: "pointer", fontFamily: "Nunito, sans-serif" }}
              >
                <FileText style={{ width: 16, height: 16, color: "white" }} />
                <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "white" }}>Reporte médico</span>
              </button>
            </div>

            {/* Tutorial button */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("restart-tutorial"))}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px 16px", borderRadius: 16, border: "2px solid #3B9ED4", background: "#EAF6FF", cursor: "pointer", fontFamily: "Nunito, sans-serif", marginBottom: 20 }}
            >
              <BookOpen style={{ width: 16, height: 16, color: "#3B9ED4" }} />
              <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#3B9ED4" }}>Ver tutorial de nuevo</span>
            </button>

            {/* ── Datos personales ── */}
            <Section title="Datos personales">
              <InfoRow emoji={sexEmoji[profile.sex as string] || "👤"} label="Nombre" value={str(profile.name)} />
              <InfoRow emoji="🎂" label="Edad" value={str(profile.age)} />
              <InfoRow emoji={sexEmoji[profile.sex as string] || "🙂"} label="Sexo" value={str(profile.sex)} />
            </Section>

            {/* ── Movilidad ── */}
            <Section title="Movilidad y actividad">
              <InfoRow emoji={mobilityEmoji(profile.mobility as string)} label="Movilidad" value={str(profile.mobility)} />
              <InfoRow emoji="🦯" label="Apoyo para caminar" value={str(profile.walkingAid)} />
              <InfoRow emoji="⚖️" label="Equilibrio" value={str(profile.balance)} />
              <InfoRow emoji="🏃" label="Actividad diaria" value={str(profile.activity)} />
              <InfoRow emoji="🪑" label="Levantarse de la silla" value={str(profile.sitToStand)} />
              <InfoRow emoji="🌿" label="Ejercicio reciente" value={str(profile.recentExercise)} />
            </Section>

            {/* ── Salud ── */}
            <Section title="Salud">
              <InfoRow emoji="⚡" label="Nivel de energía" value={str(profile.energy)} />
              <div style={{ padding: "10px 0", borderBottom: "1px solid #F0F5F2" }}>
                <p style={{ fontSize: "0.72rem", color: "#9A8EAA", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", margin: 0, marginBottom: 6 }}>
                  Nivel de dolor
                </p>
                <PainDots level={painLevel} />
              </div>
              <InfoRow emoji="⚠️" label="Historial de caídas" value={str(profile.falls)} />
              <InfoRow emoji="🌅" label="Rigidez articular" value={str(profile.stiffness)} />
            </Section>

            {/* ── Zonas de dolor ── */}
            {painAreasDisplay.length > 0 && (
              <Section title="Zonas con dolor">
                <div style={{ display: "flex", flexWrap: "wrap", marginTop: 4 }}>
                  {painAreasDisplay.map(area => (
                    <Pill key={area} label={area} color="#E8648A" />
                  ))}
                </div>
              </Section>
            )}

            {/* ── Rigidez por zona ── */}
            {stiffnessZones.length > 0 && (
              <Section title="Zonas con rigidez">
                <div style={{ display: "flex", flexWrap: "wrap", marginTop: 4 }}>
                  {stiffnessZones.map(zone => (
                    <Pill key={zone} label={zone} color="#7B52AB" />
                  ))}
                </div>
              </Section>
            )}

            {/* ── Objetivos ── */}
            {goals.length > 0 && (
              <Section title="Mis objetivos">
                <div style={{ display: "flex", flexWrap: "wrap", marginTop: 4 }}>
                  {goals.map(goal => (
                    <Pill key={goal} label={goal} color="#3D8A62" />
                  ))}
                </div>
              </Section>
            )}

            {/* Bottom note */}
            <p style={{ textAlign: "center", fontSize: "0.78rem", color: "#9A8EAA", fontWeight: 500, lineHeight: 1.6, marginTop: 8 }}>
              Tu información se guarda de forma privada en este dispositivo
            </p>
          </>
        )}
      </div>
    </div>
  );
}
