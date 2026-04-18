import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Heart, Star, ChevronRight, Award } from "lucide-react";
import { categories, exercises, getRecommendedExercises } from "../data/exercises";

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    Fácil: { bg: "#E8F5EE", text: "#2E7D52" },
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

export function Home() {
  const navigate = useNavigate();
  const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");
  const userName = profile.name || "Amigo";
  const recommended = getRecommendedExercises(profile);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "¡Buenos días";
    if (hour < 18) return "¡Buenas tardes";
    return "¡Buenas noches";
  };

  return (
    <div className="min-h-screen pb-8" style={{ background: "#F7F4F8", fontFamily: "Nunito, sans-serif" }}>
      {/* Header tricolor */}
      <div
        className="px-5 pt-14 pb-6"
        style={{ background: "linear-gradient(135deg, #3D8A62 0%, #3B9ED4 55%, #E8648A 100%)" }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.85)", fontWeight: 600, marginBottom: "2px" }}>
              {getGreeting()},
            </p>
            <h1 style={{ fontSize: "1.8rem", color: "white", fontWeight: 800, lineHeight: 1.2 }}>
              {userName}! 👋
            </h1>
            <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.78)", fontWeight: 500, marginTop: "4px" }}>
              Listos tus ejercicios personalizados
            </p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" fill="white" />
            </div>
            <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.75)", fontWeight: 700, letterSpacing: "0.04em" }}>
              OldHealthy
            </p>
          </div>
        </div>

        {/* Stats strip */}
        <div className="flex gap-3 mt-2">
          {[
            { label: "Ejercicios", value: `${exercises.length}`, emoji: "🏃", bg: "rgba(255,255,255,0.15)" },
            { label: "Categorías", value: "4", emoji: "📋", bg: "rgba(255,255,255,0.15)" },
            { label: "Para ti", value: `${recommended.length}`, emoji: "⭐", bg: "rgba(255,255,255,0.15)" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex-1 py-3 px-3 rounded-2xl flex flex-col items-center"
              style={{ background: stat.bg }}
            >
              <span style={{ fontSize: "1.1rem" }}>{stat.emoji}</span>
              <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "white", lineHeight: 1 }}>{stat.value}</span>
              <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.82)", fontWeight: 600 }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5">
        {/* Recommended Section */}
        <div className="mt-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#FDE8F0" }}>
              <Star className="w-4 h-4" style={{ color: "#E8648A" }} fill="#E8648A" />
            </div>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#1E3A2F" }}>
              Recomendados para ti
            </h2>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
            {recommended.map((exercise, i) => {
              const category = categories.find((c) => c.id === exercise.categoryId);
              return (
                <motion.button
                  key={exercise.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => navigate(`/ejercicio/${exercise.id}`)}
                  className="flex-shrink-0 text-left active:scale-95 transition-transform"
                  style={{ width: "200px" }}
                >
                  <div className="rounded-2xl overflow-hidden shadow-md" style={{ background: "white" }}>
                    <div
                      className="h-28 flex items-center justify-center relative overflow-hidden"
                      style={{ background: category ? `linear-gradient(135deg, ${getCategoryColors(category.id).from}, ${getCategoryColors(category.id).to})` : "#E8F5EE" }}
                    >
                      <span style={{ fontSize: "3rem" }}>{category?.emoji}</span>
                      <div className="absolute top-2 right-2">
                        <div className="w-7 h-7 rounded-full bg-white/25 flex items-center justify-center">
                          <Award className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <p style={{ fontSize: "0.92rem", fontWeight: 800, color: "#1E3A2F", lineHeight: 1.3, marginBottom: "4px" }}>
                        {exercise.name}
                      </p>
                      <div className="flex items-center justify-between">
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

        {/* Categories */}
        <div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#1E3A2F", marginBottom: "16px" }}>
            Todas las categorías
          </h2>
          <div className="flex flex-col gap-4">
            {categories.map((category, i) => {
              const colors = getCategoryColors(category.id);
              const catExercises = exercises.filter((e) => e.categoryId === category.id);
              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  onClick={() => navigate(`/categoria/${category.id}`)}
                  className="w-full text-left active:scale-98 transition-transform"
                >
                  <div
                    className="rounded-2xl overflow-hidden shadow-md flex"
                    style={{ background: "white", minHeight: "100px" }}
                  >
                    {/* Left colored strip with emoji */}
                    <div
                      className="w-28 flex flex-col items-center justify-center gap-1 flex-shrink-0"
                      style={{ background: `linear-gradient(160deg, ${colors.from}, ${colors.to})` }}
                    >
                      <span style={{ fontSize: "2.5rem" }}>{category.emoji}</span>
                    </div>
                    {/* Content */}
                    <div className="flex-1 px-4 py-4 flex flex-col justify-center">
                      <p style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1E3A2F", lineHeight: 1.3, marginBottom: "4px" }}>
                        {category.name}
                      </p>
                      <p style={{ fontSize: "0.85rem", color: "#4A6754", fontWeight: 500, lineHeight: 1.4, marginBottom: "8px" }}>
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span
                          style={{
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            padding: "3px 10px",
                            borderRadius: "20px",
                            background: colors.lightBg,
                            color: colors.from,
                          }}
                        >
                          {catExercises.length} ejercicios
                        </span>
                        <ChevronRight className="w-5 h-5" style={{ color: "#9BB8A8" }} />
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Bottom disclaimer */}
        <div className="mt-8 p-4 rounded-2xl flex items-start gap-3" style={{ background: "#EAF6FF", border: "1.5px solid #A8D8F0" }}>
          <span style={{ fontSize: "1.3rem" }}>⚕️</span>
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
    "piernas-gluteos": { from: "#2E7D52", to: "#4CAF7A", lightBg: "#E8F5EE" },
    "core": { from: "#1B77B8", to: "#4DBBF0", lightBg: "#E1F4FF" },
    "brazos-superior": { from: "#E8648A", to: "#F4A0B5", lightBg: "#FDEEF3" },
    "movilidad-flexibilidad": { from: "#7B52AB", to: "#B48FD8", lightBg: "#F3EDF8" },
  };
  return map[id] || { from: "#3D8A62", to: "#5BAF7A", lightBg: "#E8F5EE" };
}