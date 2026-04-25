import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ChevronLeft, FileText, Printer, Loader2, RefreshCw, Sparkles, Stethoscope } from "lucide-react";
import { loadStreaks, getSessionHistory } from "../../lib/streaks";
import { generateMedicalReport } from "../../lib/anthropic";

function formatReport(text: string): React.ReactNode {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("## ")) {
      return (
        <h3 key={i} style={{ fontSize: "1.05rem", fontWeight: 900, color: "#1E3A2F", marginTop: i === 0 ? 0 : 20, marginBottom: 8, paddingBottom: 6, borderBottom: "2px solid #E8F5EE" }}>
          {line.replace("## ", "")}
        </h3>
      );
    }
    if (line.startsWith("- ") || line.startsWith("• ")) {
      return (
        <p key={i} style={{ fontSize: "0.92rem", color: "#2D4A38", fontWeight: 500, lineHeight: 1.6, margin: "4px 0", paddingLeft: 16, position: "relative" }}>
          <span style={{ position: "absolute", left: 0, color: "#3D8A62" }}>•</span>
          {line.replace(/^[-•]\s/, "")}
        </p>
      );
    }
    if (line.trim() === "") return <div key={i} style={{ height: 6 }} />;
    return (
      <p key={i} style={{ fontSize: "0.92rem", color: "#2D4A38", fontWeight: 500, lineHeight: 1.7, margin: "3px 0" }}>
        {line}
      </p>
    );
  });
}

export function MedicalReport() {
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const profile = (() => {
    try { return JSON.parse(localStorage.getItem("userProfile") || "{}"); } catch { return {}; }
  })();

  const handleGenerate = async () => {
    setLoading(true);
    setError(false);

    const sessions = getSessionHistory();
    const streaks = loadStreaks();

    const result = await generateMedicalReport(profile, sessions, streaks.current, streaks.max);

    setLoading(false);
    if (result) setReport(result);
    else setError(true);
  };

  const handlePrint = () => {
    const name = profile.name || "Paciente";
    const date = new Date().toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" });
    const content = printRef.current?.innerText || report || "";

    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Reporte Médico — ${name}</title>
  <style>
    body { font-family: Georgia, serif; max-width: 780px; margin: 40px auto; color: #111; }
    h1 { font-size: 1.4rem; border-bottom: 2px solid #333; padding-bottom: 8px; margin-bottom: 4px; }
    .meta { font-size: 0.85rem; color: #555; margin-bottom: 28px; }
    h3 { font-size: 1rem; margin-top: 20px; margin-bottom: 6px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
    p { font-size: 0.9rem; line-height: 1.7; margin: 4px 0; }
    .footer { margin-top: 40px; font-size: 0.78rem; color: #888; border-top: 1px solid #ddd; padding-top: 10px; }
    @media print { body { margin: 20px; } }
  </style>
</head>
<body>
  <h1>Reporte de Actividad Física — OldHealthy</h1>
  <p class="meta">Paciente: ${name} &nbsp;|&nbsp; Fecha: ${date}</p>
  ${content.split("\n").map(line => {
    if (line.startsWith("## ")) return `<h3>${line.replace("## ", "")}</h3>`;
    if (line.trim() === "") return "<br>";
    return `<p>${line}</p>`;
  }).join("")}
  <p class="footer">Generado por OldHealthy · Para uso informativo. No sustituye el criterio médico profesional.</p>
</body>
</html>`);
    win.document.close();
    win.print();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F7F4F8", fontFamily: "Nunito, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1E3A2F, #2D5040)", padding: "48px 24px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
          >
            <ChevronLeft style={{ width: 22, height: 22, color: "white" }} />
          </button>
          <div>
            <h1 style={{ color: "white", fontSize: "1.6rem", fontWeight: 900, margin: 0, display: "flex", alignItems: "center", gap: 10 }}><FileText size={24} color="white" /> Reporte para tu Médico</h1>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.82rem", fontWeight: 600, margin: "4px 0 0" }}>
              Generado por IA · Basado en tu historial de ejercicios
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: "24px", maxWidth: 720, margin: "0 auto" }}>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            width: "100%", padding: "16px 20px", borderRadius: 18, border: "none",
            background: loading ? "#E0D8EA" : "linear-gradient(135deg, #1E3A2F, #3D8A62)",
            cursor: loading ? "not-allowed" : "pointer", fontFamily: "Nunito, sans-serif",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            boxShadow: loading ? "none" : "0 4px 16px rgba(30,58,47,0.3)",
            marginBottom: 20,
          }}
        >
          {loading ? (
            <>
              <Loader2 style={{ width: 20, height: 20, color: "#9A8EAA" }} className="animate-spin" />
              <span style={{ fontSize: "1rem", fontWeight: 700, color: "#9A8EAA" }}>Generando reporte médico...</span>
            </>
          ) : (
            <>
              {report ? <RefreshCw style={{ width: 18, height: 18, color: "white" }} /> : <FileText style={{ width: 18, height: 18, color: "white" }} />}
              <Sparkles size={18} color="white" />
              <span style={{ fontSize: "1rem", fontWeight: 800, color: "white" }}>
                {report ? "Regenerar reporte" : "Generar reporte con IA"}
              </span>
            </>
          )}
        </button>

        {/* Error */}
        {error && (
          <div style={{ background: "#FFF0F3", border: "1.5px solid #F9C5D5", borderRadius: 16, padding: "14px 18px", marginBottom: 20, textAlign: "center" }}>
            <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#E8648A" }}>
              No se pudo conectar con la IA. Por favor intenta de nuevo.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!report && !loading && !error && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <Stethoscope size={64} color="#3D8A62" style={{ display: "block", margin: "0 auto 16px" }} />
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#1E3A2F", marginBottom: 8 }}>
              Reporte profesional para tu médico
            </h2>
            <p style={{ fontSize: "0.95rem", color: "#4A6754", fontWeight: 500, lineHeight: 1.65, marginBottom: 16 }}>
              La IA generará un resumen profesional de tu actividad física del último mes: ejercicios realizados, frecuencia, zonas trabajadas, progreso y recomendaciones.
            </p>
            <div style={{ background: "#EAF6FF", border: "1.5px solid #A8D8F0", borderRadius: 14, padding: "12px 16px", display: "inline-block" }}>
              <p style={{ fontSize: "0.82rem", color: "#1A5276", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                <Stethoscope size={14} color="#1A5276" />
                Este reporte es informativo y no reemplaza el criterio médico
              </p>
            </div>
          </div>
        )}

        {/* Report content */}
        {report && !loading && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            {/* Print button */}
            <button
              onClick={handlePrint}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 14, border: "2px solid #3D8A62", background: "white", cursor: "pointer", fontFamily: "Nunito, sans-serif", marginBottom: 20 }}
            >
              <Printer style={{ width: 18, height: 18, color: "#3D8A62" }} />
              <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#3D8A62" }}>Imprimir / Guardar como PDF</span>
            </button>

            {/* Report box */}
            <div
              ref={printRef}
              style={{ background: "white", borderRadius: 20, padding: "28px 24px", border: "1.5px solid #E8F5EE", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
            >
              {/* Report header */}
              <div style={{ borderBottom: "2px solid #1E3A2F", paddingBottom: 12, marginBottom: 20 }}>
                <h2 style={{ fontSize: "1.15rem", fontWeight: 900, color: "#1E3A2F", margin: "0 0 4px" }}>
                  Reporte de Actividad Física
                </h2>
                <p style={{ fontSize: "0.82rem", color: "#7A9B87", fontWeight: 600, margin: 0 }}>
                  OldHealthy · {new Date().toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>

              {/* Report body */}
              <div>{formatReport(report)}</div>

              {/* Disclaimer */}
              <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #E8F5EE" }}>
                <p style={{ fontSize: "0.75rem", color: "#9A8EAA", fontWeight: 500, lineHeight: 1.5 }}>
                  Este informe fue generado automáticamente por OldHealthy y es de carácter informativo. No sustituye el diagnóstico ni el criterio de un profesional médico.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
