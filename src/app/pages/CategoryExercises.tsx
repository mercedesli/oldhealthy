import { useParams, useNavigate } from "react-router";
import { motion } from "motion/react";
import { ChevronLeft, Clock, Zap, ChevronRight, AlertCircle } from "lucide-react";
import { categories, exercises } from "../data/exercises";

function getCategoryColors(id: string) {
  const map: Record<string, { from: string; to: string; lightBg: string; textColor: string }> = {
    "piernas-gluteos": { from: "#2E7D52", to: "#4CAF7A", lightBg: "#E8F5EE", textColor: "#1B4D2E" },
    "core": { from: "#1565C0", to: "#42A5F5", lightBg: "#E3F2FD", textColor: "#0D3C6E" },
    "brazos-superior": { from: "#E65100", to: "#FF8A50", lightBg: "#FFF3E0", textColor: "#7A2900" },
    "movilidad-flexibilidad": { from: "#6A1B9A", to: "#AB47BC", lightBg: "#F3E5F5", textColor: "#3D0060" },
  };
  return map[id] || { from: "#3D8A62", to: "#5BAF7A", lightBg: "#E8F5EE", textColor: "#1E3A2F" };
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    Fácil: { bg: "#E8F5EE", text: "#2E7D52" },
    Moderado: { bg: "#FFF3E0", text: "#E65100" },
    Avanzado: { bg: "#FDECEA", text: "#C62828" },
  };
  const c = colors[difficulty] || colors["Fácil"];
  return (
    <span style={{ background: c.bg, color: c.text, fontSize: "0.8rem", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", fontFamily: "Nunito, sans-serif" }}>
      {difficulty}
    </span>
  );
}

function PainLevelDots({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ background: i <= level ? (level <= 2 ? "#3D8A62" : level <= 3 ? "#F59E0B" : "#EF4444") : "#E0EDE5" }}
        />
      ))}
    </div>
  );
}

export function CategoryExercises() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const category = categories.find((c) => c.id === categoryId);
  const categoryExercises = exercises.filter((e) => e.categoryId === categoryId);
  const colors = getCategoryColors(categoryId || "");

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ fontFamily: "Nunito, sans-serif" }}>
        <p style={{ color: "#4A6754" }}>Categoría no encontrada</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-10" style={{ background: "#F6FAF7", fontFamily: "Nunito, sans-serif" }}>
      {/* Header */}
      <div
        className="px-5 pt-12 pb-8"
        style={{ background: `linear-gradient(160deg, ${colors.from}, ${colors.to})` }}
      >
        <button
          onClick={() => navigate("/inicio")}
          className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center mb-5 active:scale-90 transition-transform"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/25 flex items-center justify-center">
            <span style={{ fontSize: "2.2rem" }}>{category.emoji}</span>
          </div>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "white", lineHeight: 1.2, marginBottom: "4px" }}>
              {category.name}
            </h1>
            <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>
              {categoryExercises.length} ejercicios disponibles
            </p>
          </div>
        </div>

        <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.85)", fontWeight: 500, lineHeight: 1.5, marginTop: "12px" }}>
          {category.description}
        </p>
      </div>

      {/* Tips strip */}
      <div className="mx-5 -mt-4 rounded-2xl p-4 flex items-start gap-3 shadow-md" style={{ background: "white" }}>
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.from }} />
        <p style={{ fontSize: "0.85rem", color: "#4A6754", fontWeight: 600, lineHeight: 1.5 }}>
          Realiza cada ejercicio de forma lenta y controlada. Si sientes dolor agudo, detente y consulta a tu médico.
        </p>
      </div>

      {/* Exercise list */}
      <div className="px-5 mt-5 flex flex-col gap-4">
        {categoryExercises.map((exercise, i) => (
          <motion.button
            key={exercise.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => navigate(`/ejercicio/${exercise.id}`)}
            className="w-full text-left active:scale-98 transition-transform"
          >
            <div className="rounded-2xl shadow-md overflow-hidden" style={{ background: "white" }}>
              {/* Top color bar */}
              <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${colors.from}, ${colors.to})` }} />

              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 pr-3">
                    <h3 style={{ fontSize: "1.08rem", fontWeight: 800, color: "#1E3A2F", lineHeight: 1.3, marginBottom: "6px" }}>
                      {exercise.name}
                    </h3>
                    <p style={{ fontSize: "0.88rem", color: "#4A6754", fontWeight: 500, lineHeight: 1.5 }}>
                      {exercise.description.slice(0, 80)}...
                    </p>
                  </div>
                  <div
                    className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
                    style={{ background: colors.lightBg }}
                  >
                    <span style={{ fontSize: "1.6rem" }}>{category.emoji}</span>
                  </div>
                </div>

                {/* Info row */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <DifficultyBadge difficulty={exercise.difficulty} />
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: "#F0F7F3" }}>
                    <Clock className="w-3.5 h-3.5" style={{ color: "#5B9B6B" }} />
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2E6B48" }}>{exercise.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: "#F0F7F3" }}>
                    <Zap className="w-3.5 h-3.5" style={{ color: "#5B9B6B" }} />
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2E6B48" }}>{exercise.reps}</span>
                  </div>
                </div>

                {/* Pain level */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: "0.78rem", color: "#7A9B87", fontWeight: 600 }}>Nivel dolor máx:</span>
                    <PainLevelDots level={exercise.maxPainLevel} />
                  </div>
                  <div className="flex items-center gap-1" style={{ color: colors.from }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>Ver detalle</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
