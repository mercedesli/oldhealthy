import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Check, ChevronRight, Loader2 } from "lucide-react";
import { questions } from "../data/questionnaire";
import { sendQuestionnaireEmail, EMAILJS_CONFIG } from "../utils/emailService";
import { checkMedicalWarning, deriveUserPainLevel } from "../data/exercises";
import { supabase, getUserId } from "../../lib/supabase";

async function saveProfileToSupabase(answers: Record<string, string | string[]>) {
  try {
    const { error } = await supabase.from("perfiles_usuario").insert({
      usuario_id:       getUserId(),
      nombre:           (answers.name     as string) || "",
      edad:             (answers.age      as string) || "",
      movilidad:        (answers.walkingAid as string) || (answers.mobility as string) || "",
      nivel_dolor:      deriveUserPainLevel(answers),
      zonas_dolor:      (answers.painAreas  as string[]) || [],
      nivel_energia:    (answers.energy   as string) || "",
      historial_caidas: (answers.falls    as string) || "",
      objetivos:        (answers.goals    as string[]) || [],
    });
    if (error) console.warn("[Supabase] perfil:", error.message);
  } catch {
    // Supabase no disponible — localStorage ya tiene el dato
  }
}

export function Questionnaire() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [textInput, setTextInput] = useState("");
  const [direction, setDirection] = useState(1);
  const [isSending, setIsSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState<"idle" | "sent" | "failed">("idle");

  const question = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;
  const currentAnswer = answers[question.id];

  const isAnswered = () => {
    if (question.type === "text") return textInput.trim().length > 0;
    if (question.type === "multi") return Array.isArray(currentAnswer) && currentAnswer.length > 0;
    return !!currentAnswer;
  };

  const handleOptionSelect = (value: string) => {
    if (question.type === "multi") {
      const current = (answers[question.id] as string[]) || [];
      // Special rule: "No tengo dolor" / "No aplica" deselects all others
      if (value === "No tengo dolor" || value === "No aplica" || value === "No uso apoyo") {
        setAnswers({ ...answers, [question.id]: [value] });
        return;
      }
      const withoutNone = current.filter(
        (v) => v !== "No tengo dolor" && v !== "No aplica" && v !== "No uso apoyo"
      );
      const updated = withoutNone.includes(value)
        ? withoutNone.filter((v) => v !== value)
        : [...withoutNone, value];
      setAnswers({ ...answers, [question.id]: updated });
    } else {
      setAnswers({ ...answers, [question.id]: value });
      // Auto-advance after selection for single choice
      setTimeout(() => {
        handleNext(value);
      }, 300);
    }
  };

  const handleNext = (immediateValue?: string) => {
    const val = immediateValue !== undefined ? immediateValue : currentAnswer;
    let updatedAnswers = { ...answers };
    if (immediateValue !== undefined) {
      updatedAnswers = { ...answers, [question.id]: immediateValue };
    }
    if (question.type === "text") {
      updatedAnswers = { ...answers, [question.id]: textInput };
    }
    setAnswers(updatedAnswers);

    if (currentStep < questions.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
      setTextInput(typeof updatedAnswers[questions[currentStep + 1]?.id] === "string" ? updatedAnswers[questions[currentStep + 1]?.id] as string : "");
    } else {
      // Save profile and send email notification
      localStorage.setItem("userProfile", JSON.stringify(updatedAnswers));
      saveProfileToSupabase(updatedAnswers);
      const needsWarning = checkMedicalWarning(updatedAnswers);
      setIsSending(true);
      sendQuestionnaireEmail(updatedAnswers).then(({ success }) => {
        setEmailStatus(success ? "sent" : "failed");
        setTimeout(() => navigate(needsWarning ? "/aviso-medico" : "/inicio"), 1800);
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
      const prevQuestion = questions[currentStep - 1];
      const prevAnswer = answers[prevQuestion.id];
      setTextInput(typeof prevAnswer === "string" ? prevAnswer : "");
    } else {
      navigate("/");
    }
  };

  const isMultiSelected = (value: string) => {
    return Array.isArray(currentAnswer) && currentAnswer.includes(value);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F7F4F8", fontFamily: "Nunito, sans-serif" }}>
      {/* Header */}
      <div className="sticky top-0 z-20 px-4 pt-12 pb-4" style={{ background: "#F7F4F8" }}>
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={handleBack}
            className="w-11 h-11 rounded-full flex items-center justify-center active:scale-90 transition-transform"
            style={{ background: "#FDE8F0" }}
          >
            <ChevronLeft className="w-5 h-5" style={{ color: "#E8648A" }} />
          </button>
          <div className="flex-1">
            <p style={{ fontSize: "0.82rem", color: "#7A9B87", fontWeight: 600 }}>
              Pregunta {currentStep + 1} de {questions.length}
            </p>
          </div>
          <span style={{ fontSize: "0.82rem", color: "#3B9ED4", fontWeight: 700 }}>
            {Math.round(progress)}%
          </span>
        </div>
        {/* Tricolor progress bar */}
        <div className="w-full rounded-full h-2.5" style={{ background: "#E8E0EE" }}>
          <motion.div
            className="h-2.5 rounded-full"
            style={{ background: "linear-gradient(90deg, #3D8A62, #3B9ED4, #E8648A)" }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.3 }}
          >
            {/* Question text */}
            <div className="mb-6 mt-2">
              <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#1E3A2F", lineHeight: 1.3, marginBottom: "0.5rem" }}>
                {question.question}
              </h2>
              {question.subtitle && (
                <p style={{ fontSize: "1rem", color: "#4A6754", fontWeight: 500, lineHeight: 1.5 }}>
                  {question.subtitle}
                </p>
              )}
              {question.type === "multi" && (
                <p style={{ fontSize: "0.85rem", color: "#7A9B87", fontWeight: 600, marginTop: "0.25rem" }}>
                  ✓ Puedes seleccionar varias opciones
                </p>
              )}
            </div>

            {/* Options */}
            {(question.type === "options" || question.type === "multi") && (
              <div className="flex flex-col gap-3">
                {question.options?.map((option) => {
                  const isSelected =
                    question.type === "multi"
                      ? isMultiSelected(option.value)
                      : currentAnswer === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleOptionSelect(option.value)}
                      className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left active:scale-98 transition-all"
                      style={{
                        background: isSelected ? "#EAF6FF" : "white",
                        border: isSelected ? "2.5px solid #3B9ED4" : "2px solid #E8E0EE",
                        boxShadow: isSelected ? "0 2px 12px rgba(59,158,212,0.18)" : "0 1px 4px rgba(0,0,0,0.06)",
                      }}
                    >
                      {option.emoji && (
                        <span style={{ fontSize: "1.5rem" }}>{option.emoji}</span>
                      )}
                      <span style={{ flex: 1, fontSize: "1.05rem", fontWeight: isSelected ? 700 : 600, color: isSelected ? "#0D3C6E" : "#2D4A38", fontFamily: "Nunito, sans-serif" }}>
                        {option.value}
                      </span>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#3B9ED4" }}>
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Text input */}
            {question.type === "text" && (
              <div>
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={question.placeholder}
                  autoFocus
                  className="w-full px-5 py-4 rounded-2xl outline-none"
                  style={{
                    fontSize: "1.2rem",
                    fontFamily: "Nunito, sans-serif",
                    fontWeight: 600,
                    color: "#1E3A2F",
                    background: "white",
                    border: "2px solid #A8D8F0",
                    boxShadow: "0 2px 8px rgba(59,158,212,0.12)",
                  }}
                  onKeyDown={(e) => e.key === "Enter" && isAnswered() && handleNext()}
                />
                {textInput.trim() && (
                  <p style={{ fontSize: "0.85rem", color: "#E8648A", marginTop: "0.5rem", fontWeight: 700 }}>
                    ¡Hola, {textInput}! 👋
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom button (for multi and text) */}
      {(question.type === "multi" || question.type === "text") && (
        <div className="sticky bottom-0 px-5 py-5" style={{ background: "linear-gradient(to top, #F7F4F8 70%, transparent)" }}>
          <button
            onClick={() => handleNext()}
            disabled={!isAnswered() || isSending}
            className="w-full py-5 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
            style={{
              background: isAnswered() && !isSending ? "linear-gradient(135deg, #3D8A62, #3B9ED4)" : "#E0D8EA",
              border: "none",
              boxShadow: isAnswered() && !isSending ? "0 4px 16px rgba(59,158,212,0.35)" : "none",
            }}
          >
            {isSending ? (
              <>
                <Loader2 className="w-5 h-5 text-white animate-spin" />
                <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "white", fontFamily: "Nunito, sans-serif" }}>
                  Guardando tu perfil...
                </span>
              </>
            ) : (
              <>
                <span style={{ fontSize: "1.1rem", fontWeight: 800, color: isAnswered() ? "white" : "#9A8EAA", fontFamily: "Nunito, sans-serif" }}>
                  {currentStep === questions.length - 1 ? "Ver mis ejercicios ✨" : "Continuar"}
                </span>
                {isAnswered() && <ChevronRight className="w-5 h-5 text-white" />}
              </>
            )}
          </button>

          {/* Email status badge — only shown on last step after attempt */}
          {currentStep === questions.length - 1 && emailStatus !== "idle" && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-3"
              style={{
                fontSize: "0.82rem",
                fontWeight: 700,
                color: emailStatus === "sent" ? "#3D8A62" : "#9A8EAA",
              }}
            >
              {emailStatus === "sent"
                ? `✅ Notificación enviada a ${EMAILJS_CONFIG.RECIPIENT_EMAIL}`
                : "⚠️ No se pudo enviar el email (configura EmailJS)"}
            </motion.p>
          )}
        </div>
      )}
    </div>
  );
}