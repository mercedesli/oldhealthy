import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { categories, exercises } from "../data/exercises";

const COLORS: Record<string, { from: string; to: string; light: string }> = {
  "piernas-gluteos":        { from: "#2E7D52", to: "#4CAF7A", light: "#E8F5EE" },
  "core":                   { from: "#1B77B8", to: "#4DBBF0", light: "#E1F4FF" },
  "brazos-superior":        { from: "#E8648A", to: "#F4A0B5", light: "#FDEEF3" },
  "movilidad-flexibilidad": { from: "#7B52AB", to: "#B48FD8", light: "#F3EDF8" },
};

export function Categories() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#F7F4F8", fontFamily: "Nunito, sans-serif", paddingBottom: 88 }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #3D8A62 0%, #3B9ED4 100%)", padding: "52px 24px 28px" }}>
        <h1 style={{ color: "white", fontSize: "1.7rem", fontWeight: 900, margin: 0, lineHeight: 1.2 }}>
          📋 Categorías
        </h1>
        <p style={{ color: "rgba(255,255,255,0.78)", fontSize: "0.9rem", fontWeight: 600, margin: "6px 0 0" }}>
          Elige la zona del cuerpo que quieres trabajar
        </p>
      </div>

      <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
        {categories.map((cat, i) => {
          const c    = COLORS[cat.id] || { from: "#3D8A62", to: "#5BAF7A", light: "#E8F5EE" };
          const count = exercises.filter(e => e.categoryId === cat.id).length;
          return (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => navigate(`/categoria/${cat.id}`)}
              style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer", textAlign: "left" }}
            >
              <div
                style={{
                  background: "white",
                  borderRadius: 20,
                  overflow: "hidden",
                  display: "flex",
                  minHeight: 100,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                  border: "1.5px solid #E8F5EE",
                  transition: "transform 0.15s",
                }}
              >
                {/* Color slab */}
                <div
                  style={{
                    width: 100,
                    background: `linear-gradient(160deg, ${c.from}, ${c.to})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: "2.6rem" }}>{cat.emoji}</span>
                </div>

                {/* Content */}
                <div style={{ flex: 1, padding: "16px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <p style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1E3A2F", margin: "0 0 4px", lineHeight: 1.3 }}>
                    {cat.name}
                  </p>
                  <p style={{ fontSize: "0.83rem", color: "#4A6754", fontWeight: 500, lineHeight: 1.45, margin: "0 0 10px" }}>
                    {cat.description}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: c.light, color: c.from }}>
                      {count} ejercicios
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
  );
}
