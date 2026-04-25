import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { AlertTriangle, ArrowLeft, ChevronRight, HeartHandshake } from "lucide-react";

export function MedicalWarning() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#F7F4F8", fontFamily: "Nunito, sans-serif" }}
    >
      {/* Decorative top blob */}
      <div
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "rgba(232,100,138,0.12)",
          pointerEvents: "none",
        }}
      />

      <div className="flex-1 flex flex-col px-6 pt-16 pb-8">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ background: "rgba(232,100,138,0.15)" }}
          >
            <AlertTriangle
              style={{ width: 48, height: 48, color: "#E8648A" }}
              strokeWidth={2}
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: "1.75rem",
            fontWeight: 900,
            color: "#1E3A2F",
            textAlign: "center",
            lineHeight: 1.25,
            marginBottom: "1rem",
          }}
        >
          Antes de comenzar,{"\n"}
          <span style={{ color: "#E8648A" }}>consulta a tu médico</span>
        </motion.h1>

        {/* Message card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl p-6 mb-6"
          style={{
            background: "white",
            boxShadow: "0 4px 20px rgba(232,100,138,0.12)",
            border: "1.5px solid rgba(232,100,138,0.2)",
          }}
        >
          <p
            style={{
              fontSize: "1.05rem",
              color: "#2D4A38",
              fontWeight: 600,
              lineHeight: 1.65,
              marginBottom: "1rem",
            }}
          >
            Según tus respuestas, detectamos algunas señales de alerta que es
            importante atender antes de iniciar una rutina de ejercicios:
          </p>

          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              "Nivel de dolor intenso o constante",
              "Historial de dos o más caídas recientes",
              "Uso de silla de ruedas con dolor elevado",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 mb-2"
                style={{ fontSize: "0.95rem", color: "#4A6754", fontWeight: 600 }}
              >
                <span
                  style={{
                    minWidth: 8,
                    minHeight: 8,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#E8648A",
                    marginTop: 7,
                  }}
                />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl p-5 mb-8"
          style={{
            background: "#EAF6FF",
            border: "1.5px solid rgba(59,158,212,0.25)",
          }}
        >
          <p
            style={{
              fontSize: "1rem",
              color: "#0D3C6E",
              fontWeight: 700,
              lineHeight: 1.6,
              textAlign: "center",
            }}
          >
            <HeartHandshake size={18} color="#3B9ED4" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />
            Te recomendamos hablar con tu médico o fisioterapeuta antes de
            empezar. Ellos podrán darte una guía segura y personalizada para ti.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-3 mt-auto"
        >
          {/* Continue anyway */}
          <button
            onClick={() => navigate("/inicio")}
            className="w-full py-5 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
            style={{
              background: "linear-gradient(135deg, #3D8A62, #3B9ED4)",
              border: "none",
              boxShadow: "0 4px 16px rgba(59,158,212,0.3)",
            }}
          >
            <span
              style={{
                fontSize: "1.05rem",
                fontWeight: 800,
                color: "white",
                fontFamily: "Nunito, sans-serif",
              }}
            >
              Continuar de todas formas
            </span>
            <ChevronRight className="w-5 h-5 text-white" />
          </button>

          {/* Go back home */}
          <button
            onClick={() => navigate("/")}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
            style={{
              background: "white",
              border: "2px solid #E8E0EE",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <ArrowLeft
              className="w-5 h-5"
              style={{ color: "#7A9B87" }}
            />
            <span
              style={{
                fontSize: "1.05rem",
                fontWeight: 700,
                color: "#4A6754",
                fontFamily: "Nunito, sans-serif",
              }}
            >
              Volver al inicio
            </span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
