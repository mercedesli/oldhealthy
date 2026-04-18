import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Heart, ChevronRight, UserPlus, User } from "lucide-react";

export function Welcome() {
  const navigate = useNavigate();

  const isReturningUser = !!localStorage.getItem("userProfile");
  const userName = JSON.parse(localStorage.getItem("userProfile") || "{}").name || "";

  // "Soy nuevo aquí" → borra perfil anterior y va al cuestionario
  const handleNewUser = () => {
    localStorage.removeItem("userProfile");
    navigate("/cuestionario");
  };

  // "Hola de nuevo" → si ya tiene perfil va directo al inicio, si no al cuestionario
  const handleReturningUser = () => {
    if (isReturningUser) {
      navigate("/inicio");
    } else {
      navigate("/cuestionario");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: "linear-gradient(150deg, #FDEEF3 0%, #EAF6FF 48%, #E9F7EF 100%)", fontFamily: "Nunito, sans-serif" }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, #F9C5D5 0%, transparent 70%)", transform: "translate(35%, -35%)", opacity: 0.7 }}
      />
      <div
        className="absolute top-32 left-0 w-56 h-56 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, #A8D8F0 0%, transparent 70%)", transform: "translateX(-40%)", opacity: 0.65 }}
      />
      <div
        className="absolute bottom-0 left-1/2 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, #B7E3C8 0%, transparent 70%)", transform: "translate(-50%, 40%)", opacity: 0.5 }}
      />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 relative z-10">

        {/* Logo & App Name */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-7"
        >
          {/* Tricolor logo */}
          <div className="relative w-24 h-24 mb-4">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-xl"
              style={{ background: "linear-gradient(135deg, #E8648A 0%, #4A9B6F 50%, #3B9ED4 100%)" }}
            >
              <Heart className="w-12 h-12 text-white" fill="white" />
            </div>
            {/* Small accent dots */}
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-white" style={{ background: "#F9C5D5" }} />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full border-2 border-white" style={{ background: "#A8D8F0" }} />
          </div>

          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#1E3A2F", lineHeight: 1.1, textAlign: "center" }}>
            Old<span style={{ color: "#3D8A62" }}>Healthy</span>
          </h1>
          <p style={{ fontSize: "0.92rem", color: "#6B8F7E", fontWeight: 600, letterSpacing: "0.06em", marginTop: "4px" }}>
            EJERCICIOS GERIÁTRICOS
          </p>

          {/* Tricolor underline bar */}
          <div className="flex gap-1 mt-2">
            <div className="h-1 w-10 rounded-full" style={{ background: "#E8648A" }} />
            <div className="h-1 w-10 rounded-full" style={{ background: "#4A9B6F" }} />
            <div className="h-1 w-10 rounded-full" style={{ background: "#3B9ED4" }} />
          </div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-xs rounded-3xl overflow-hidden shadow-2xl mb-7"
          style={{ height: "210px" }}
        >
          <img
            src="https://images.unsplash.com/photo-1609440421762-590c2d12d49e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600"
            alt="Adulto mayor haciendo ejercicio"
            className="w-full h-full object-cover"
          />
          {/* Overlay with tricolor tint */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(74,155,111,0.4) 0%, transparent 60%)" }}
          />
        </motion.div>

        {/* Welcome text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mb-8 px-3"
        >
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E3A2F", lineHeight: 1.35, marginBottom: "0.6rem" }}>
            Mejora tu movilidad y bienestar desde casa
          </h2>
          <p style={{ fontSize: "1rem", color: "#4A6754", fontWeight: 500, lineHeight: 1.6 }}>
            Ejercicios geriátricos seguros y personalizados para ti, paso a paso
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="w-full max-w-sm flex flex-col gap-4"
        >
          {/* Soy nuevo → cuestionario */}
          <button
            onClick={handleNewUser}
            className="w-full flex items-center justify-between px-6 py-5 rounded-2xl shadow-lg active:scale-95 transition-transform"
            style={{ background: "linear-gradient(135deg, #3D8A62, #5BAF7A)", border: "none" }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p style={{ fontSize: "1.15rem", fontWeight: 800, color: "white", lineHeight: 1.2 }}>
                  Soy nuevo aquí
                </p>
                <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
                  Comenzar cuestionario
                </p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-white/80" />
          </button>

          {/* Hola de nuevo → inicio */}
          <button
            onClick={handleReturningUser}
            className="w-full flex items-center justify-between px-6 py-5 rounded-2xl shadow-md active:scale-95 transition-transform"
            style={{
              background: isReturningUser
                ? "linear-gradient(135deg, #E8648A, #F4A0B5)"
                : "white",
              border: isReturningUser ? "none" : "2px solid #F9C5D5",
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: isReturningUser ? "rgba(255,255,255,0.22)" : "#FDE8F0" }}
              >
                <User className="w-6 h-6" style={{ color: isReturningUser ? "white" : "#E8648A" }} />
              </div>
              <div className="text-left">
                <p style={{ fontSize: "1.15rem", fontWeight: 800, color: isReturningUser ? "white" : "#5A2035", lineHeight: 1.2 }}>
                  {isReturningUser && userName ? `Hola de nuevo, ${userName}` : "Ya tengo perfil"}
                </p>
                <p style={{ fontSize: "0.85rem", color: isReturningUser ? "rgba(255,255,255,0.85)" : "#B06080", fontWeight: 500 }}>
                  {isReturningUser ? "Ir a mis ejercicios →" : "Continuar con perfil guardado"}
                </p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6" style={{ color: isReturningUser ? "rgba(255,255,255,0.8)" : "#E8648A" }} />
          </button>
        </motion.div>
      </div>

      {/* Bottom note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-center pb-8 px-6 relative z-10"
        style={{ fontSize: "0.82rem", color: "#7A9B87" }}
      >
        Consulta siempre con tu médico antes de comenzar cualquier programa de ejercicios
      </motion.p>
    </div>
  );
}
