import { Outlet, useNavigate, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 768
  );
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isDesktop;
}

const NAV_ITEMS = [
  { path: "/inicio",                          label: "Inicio",            icon: "🏠" },
  { path: "/cuestionario",                    label: "Mi perfil",         icon: "📋" },
  { path: "/categoria/piernas-gluteos",       label: "Piernas y Glúteos", icon: "🦵" },
  { path: "/categoria/core",                  label: "Core",              icon: "💪" },
  { path: "/categoria/brazos-superior",       label: "Brazos",            icon: "🤲" },
  { path: "/categoria/movilidad-flexibilidad",label: "Flexibilidad",      icon: "🧘" },
];

function DesktopSidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const profile = (() => {
    try { return JSON.parse(localStorage.getItem("userProfile") || "{}"); }
    catch { return {}; }
  })();

  return (
    <nav
      style={{
        width: 272,
        minHeight: "100vh",
        flexShrink: 0,
        background: "linear-gradient(180deg, #1E3A2F 0%, #2D5040 100%)",
        display: "flex",
        flexDirection: "column",
        padding: "36px 18px 28px",
        fontFamily: "Nunito, sans-serif",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
      }}
    >
      {/* ── Logo ── */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <div
            style={{
              width: 48, height: 48, borderRadius: 14, flexShrink: 0,
              background: "linear-gradient(135deg, #E8648A 0%, #4A9B6F 50%, #3B9ED4 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
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
        {/* Tricolor bar */}
        <div style={{ display: "flex", gap: 4 }}>
          {(["#E8648A", "#4A9B6F", "#3B9ED4"] as const).map((c) => (
            <div key={c} style={{ height: 3, flex: 1, borderRadius: 2, background: c }} />
          ))}
        </div>
      </div>

      {/* ── User greeting ── */}
      {profile.name && (
        <div
          style={{
            background: "rgba(255,255,255,0.09)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 14,
            padding: "12px 14px",
            marginBottom: 24,
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", fontWeight: 600, margin: 0 }}>
            Bienvenido/a,
          </p>
          <p style={{ color: "white", fontSize: "1.05rem", fontWeight: 800, margin: "2px 0 0" }}>
            {profile.name} 👋
          </p>
        </div>
      )}

      {/* ── Navigation ── */}
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
        Navegación
      </p>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_ITEMS.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/" && location.pathname.startsWith(item.path));
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                width: "100%",
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px",
                borderRadius: 12,
                border: "none",
                background: isActive ? "rgba(255,255,255,0.14)" : "transparent",
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.2s",
              }}
            >
              <span style={{ fontSize: "1.05rem", lineHeight: 1 }}>{item.icon}</span>
              <span
                style={{
                  color: isActive ? "white" : "rgba(255,255,255,0.62)",
                  fontSize: "0.9rem",
                  fontWeight: isActive ? 800 : 600,
                  fontFamily: "Nunito, sans-serif",
                }}
              >
                {item.label}
              </span>
              {isActive && (
                <div
                  style={{
                    marginLeft: "auto", width: 5, height: 5,
                    borderRadius: "50%", background: "#5BAF7A",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Footer note ── */}
      <p
        style={{
          color: "rgba(255,255,255,0.28)",
          fontSize: "0.72rem",
          fontWeight: 500,
          lineHeight: 1.55,
          textAlign: "center",
          marginTop: 20,
          borderTop: "1px solid rgba(255,255,255,0.08)",
          paddingTop: 16,
        }}
      >
        Consulta con tu médico antes de comenzar cualquier rutina de ejercicios
      </p>
    </nav>
  );
}

export function AppLayout() {
  const isDesktop = useIsDesktop();

  /* ── Móvil: diseño actual sin cambios ── */
  if (!isDesktop) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          background: "#D8EDE2",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "430px",
            minHeight: "100vh",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 0 60px rgba(0,0,0,0.2)",
          }}
        >
          <Outlet />
        </div>
      </div>
    );
  }

  /* ── Escritorio: sidebar + contenido ── */
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#EAF2EC" }}>
      <DesktopSidebar />

      <main
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "32px 24px",
          overflowY: "auto",
          minHeight: "100vh",
        }}
      >
        {/* Phone-like container in desktop */}
        <div
          style={{
            width: "100%",
            maxWidth: "430px",
            minHeight: "calc(100vh - 64px)",
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: "0 16px 56px rgba(0,0,0,0.18)",
            background: "white",
            position: "relative",
          }}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
