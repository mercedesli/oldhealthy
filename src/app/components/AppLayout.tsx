import { Outlet, useNavigate, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { OnboardingTutorial } from "./OnboardingTutorial";

type Breakpoint = "mobile" | "tablet" | "desktop";

function useBreakpoint(): Breakpoint {
  const get = (): Breakpoint => {
    if (typeof window === "undefined") return "mobile";
    if (window.innerWidth >= 1024) return "desktop";
    if (window.innerWidth >= 768) return "tablet";
    return "mobile";
  };
  const [bp, setBp] = useState<Breakpoint>(get);
  useEffect(() => {
    const onResize = () => setBp(get());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return bp;
}

const NAV_ITEMS = [
  { path: "/inicio",                           label: "Inicio",            icon: "🏠" },
  { path: "/perfil",                           label: "Mi perfil",         icon: "📋" },
  { path: "/categoria/piernas-gluteos",        label: "Piernas y Glúteos", icon: "🦵" },
  { path: "/categoria/core",                   label: "Core",              icon: "💪" },
  { path: "/categoria/brazos-superior",        label: "Brazos",            icon: "🤲" },
  { path: "/categoria/movilidad-flexibilidad", label: "Flexibilidad",      icon: "🧘" },
  { path: "/rutina-semanal",                   label: "Rutina semanal",    icon: "🗓️" },
  { path: "/resumen-semanal",                  label: "Resumen semanal",   icon: "📊" },
  { path: "/reporte-medico",                   label: "Reporte médico",    icon: "🩺" },
  { path: "/centros-salud",                    label: "Centros de Salud",  icon: "🏥" },
];

// ── Full sidebar (desktop ≥1024px) ──────────────────────────────────────────

function FullSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const profile = (() => {
    try { return JSON.parse(localStorage.getItem("userProfile") || "{}"); }
    catch { return {}; }
  })();

  return (
    <nav
      style={{
        width: 272, minHeight: "100vh", flexShrink: 0,
        background: "linear-gradient(180deg, #1E3A2F 0%, #2D5040 100%)",
        display: "flex", flexDirection: "column",
        padding: "36px 18px 28px", fontFamily: "Nunito, sans-serif",
        position: "sticky", top: 0, height: "100vh", overflowY: "auto",
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, flexShrink: 0, background: "linear-gradient(135deg, #E8648A 0%, #4A9B6F 50%, #3B9ED4 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Heart style={{ width: 24, height: 24, color: "white" }} fill="white" />
          </div>
          <div>
            <p style={{ color: "white", fontSize: "1.35rem", fontWeight: 900, lineHeight: 1, margin: 0 }}>
              Old<span style={{ color: "#5BAF7A" }}>Healthy</span>
            </p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", margin: 0 }}>
              EJERCICIOS GERIÁTRICOS
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {(["#E8648A", "#4A9B6F", "#3B9ED4"] as const).map((c) => (
            <div key={c} style={{ height: 3, flex: 1, borderRadius: 2, background: c }} />
          ))}
        </div>
      </div>

      {/* User greeting */}
      {profile.name && (
        <div style={{ background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "12px 14px", marginBottom: 24 }}>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", fontWeight: 600, margin: 0 }}>Bienvenido/a,</p>
          <p style={{ color: "white", fontSize: "1.05rem", fontWeight: 800, margin: "2px 0 0" }}>{profile.name} 👋</p>
        </div>
      )}

      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
        Navegación
      </p>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, border: "none", background: isActive ? "rgba(255,255,255,0.14)" : "transparent", cursor: "pointer", textAlign: "left", transition: "background 0.2s" }}
            >
              <span style={{ fontSize: "1.05rem", lineHeight: 1 }}>{item.icon}</span>
              <span style={{ color: isActive ? "white" : "rgba(255,255,255,0.62)", fontSize: "0.9rem", fontWeight: isActive ? 800 : 600, fontFamily: "Nunito, sans-serif" }}>
                {item.label}
              </span>
              {isActive && <div style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: "#5BAF7A" }} />}
            </button>
          );
        })}
      </div>

      <p style={{ color: "rgba(255,255,255,0.28)", fontSize: "0.72rem", fontWeight: 500, lineHeight: 1.55, textAlign: "center", marginTop: 20, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16 }}>
        Consulta con tu médico antes de comenzar cualquier rutina de ejercicios
      </p>
    </nav>
  );
}

// ── Compact sidebar (tablet 768-1023px) ─────────────────────────────────────

function CompactSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav
      style={{
        width: 72, minHeight: "100vh", flexShrink: 0,
        background: "linear-gradient(180deg, #1E3A2F 0%, #2D5040 100%)",
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "28px 0 20px", position: "sticky", top: 0,
        height: "100vh", overflowY: "auto",
      }}
    >
      {/* Logo icon */}
      <div
        onClick={() => navigate("/inicio")}
        style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #E8648A 0%, #4A9B6F 50%, #3B9ED4 100%)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, cursor: "pointer", flexShrink: 0 }}
      >
        <Heart style={{ width: 22, height: 22, color: "white" }} fill="white" />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, width: "100%", padding: "0 8px" }}>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={item.label}
              style={{ width: "100%", height: 48, borderRadius: 12, border: "none", background: isActive ? "rgba(255,255,255,0.14)" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
            >
              <span style={{ fontSize: "1.25rem" }}>{item.icon}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ── AppLayout ────────────────────────────────────────────────────────────────

export function AppLayout() {
  const bp = useBreakpoint();

  const [showTutorial, setShowTutorial] = useState(
    () => !localStorage.getItem("onboardingDone")
  );

  // Allow any page to re-trigger the tutorial
  useEffect(() => {
    const handler = () => setShowTutorial(true);
    window.addEventListener("restart-tutorial", handler);
    return () => window.removeEventListener("restart-tutorial", handler);
  }, []);

  const handleTutorialComplete = () => {
    localStorage.setItem("onboardingDone", "1");
    setShowTutorial(false);
  };

  const content = bp === "mobile" ? (
    <div style={{ minHeight: "100vh", background: "#F7F4F8" }}>
      <Outlet />
    </div>
  ) : (
    <div style={{ display: "flex", minHeight: "100vh", background: "#EAF2EC" }}>
      {bp === "desktop" ? <FullSidebar /> : <CompactSidebar />}
      <main style={{ flex: 1, minHeight: "100vh", background: "#F7F4F8", overflowY: "auto" }}>
        <Outlet />
      </main>
    </div>
  );

  return (
    <>
      {content}
      {showTutorial && <OnboardingTutorial onComplete={handleTutorialComplete} />}
    </>
  );
}
