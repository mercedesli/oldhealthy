export interface QuestionOption {
  value: string;
  emoji?: string;
}

export interface Question {
  id: string;
  question: string;
  subtitle?: string;
  type: "options" | "multi" | "text" | "scale";
  options?: QuestionOption[];
  placeholder?: string;
  minLabel?: string;
  maxLabel?: string;
}

export const questions: Question[] = [
  {
    id: "name",
    question: "¿Cómo te llamas?",
    subtitle: "Tu nombre nos ayudará a personalizar tu experiencia",
    type: "text",
    placeholder: "Escribe tu nombre aquí...",
  },
  {
    id: "age",
    question: "¿Cuántos años tienes?",
    subtitle: "Esto nos ayuda a adaptar los ejercicios a tu etapa de vida",
    type: "options",
    options: [
      { value: "60-64 años", emoji: "🌟" },
      { value: "65-69 años", emoji: "🌟" },
      { value: "70-74 años", emoji: "🌟" },
      { value: "75-79 años", emoji: "🌟" },
      { value: "80 o más años", emoji: "🌟" },
    ],
  },
  {
    id: "sex",
    question: "¿Cuál es tu sexo?",
    subtitle: "Algunos ejercicios varían según el sexo biológico",
    type: "options",
    options: [
      { value: "Masculino", emoji: "👨" },
      { value: "Femenino", emoji: "👩" },
      { value: "Prefiero no decirlo", emoji: "🙂" },
    ],
  },
  {
    id: "mobility",
    question: "¿Cómo describirías tu movilidad actual?",
    subtitle: "Sé honesto, esto nos ayuda a recomendarte ejercicios seguros",
    type: "options",
    options: [
      { value: "Me muevo sin dificultad", emoji: "🚶" },
      { value: "Tengo algo de dificultad", emoji: "🚶" },
      { value: "Necesito apoyo ocasional", emoji: "🤝" },
      { value: "Uso bastón o andador", emoji: "🦯" },
      { value: "Uso silla de ruedas", emoji: "♿" },
    ],
  },
  {
    id: "balance",
    question: "¿Tienes problemas de equilibrio?",
    subtitle: "Esto nos permite incluir ejercicios preventivos de caídas",
    type: "options",
    options: [
      { value: "No, tengo buen equilibrio", emoji: "✅" },
      { value: "A veces me siento inestable", emoji: "⚠️" },
      { value: "Sí, tengo dificultades", emoji: "🆘" },
    ],
  },
  {
    id: "falls",
    question: "¿Has tenido caídas en el último año?",
    subtitle: "Las caídas son uno de los riesgos más comunes en adultos mayores",
    type: "options",
    options: [
      { value: "No he tenido caídas", emoji: "✅" },
      { value: "Una caída", emoji: "1️⃣" },
      { value: "Dos o más caídas", emoji: "⚠️" },
    ],
  },
  {
    id: "painAreas",
    question: "¿Tienes dolor en alguna zona del cuerpo?",
    subtitle: "Puedes seleccionar varias opciones",
    type: "multi",
    options: [
      { value: "No tengo dolor", emoji: "✅" },
      { value: "Cuello o hombros", emoji: "💆" },
      { value: "Espalda alta", emoji: "🫱" },
      { value: "Espalda baja", emoji: "🫲" },
      { value: "Cadera", emoji: "🦴" },
      { value: "Piernas o rodillas", emoji: "🦵" },
      { value: "Pies o tobillos", emoji: "🦶" },
    ],
  },
  {
    id: "sitToStand",
    question: "¿Puedes levantarte de una silla sin ayuda?",
    subtitle: "Esto indica la fuerza de tus piernas y core",
    type: "options",
    options: [
      { value: "Sí, sin dificultad", emoji: "💪" },
      { value: "Sí, pero con esfuerzo", emoji: "😤" },
      { value: "Necesito apoyarme en los brazos", emoji: "🤲" },
      { value: "Necesito ayuda de alguien", emoji: "🤝" },
    ],
  },
  {
    id: "stiffness",
    question: "¿Sientes rigidez en tus articulaciones?",
    subtitle: "La rigidez es muy común y tiene solución con los ejercicios correctos",
    type: "options",
    options: [
      { value: "No siento rigidez", emoji: "✅" },
      { value: "Solo por las mañanas", emoji: "🌅" },
      { value: "Durante el día también", emoji: "☀️" },
      { value: "Casi todo el tiempo", emoji: "😓" },
    ],
  },
  {
    id: "stiffnessZone",
    question: "¿Dónde sientes más rigidez?",
    subtitle: "Selecciona la zona más afectada",
    type: "multi",
    options: [
      { value: "No aplica", emoji: "✅" },
      { value: "Cuello", emoji: "💆" },
      { value: "Hombros", emoji: "🤷" },
      { value: "Caderas", emoji: "🦴" },
      { value: "Rodillas", emoji: "🦵" },
      { value: "Manos o muñecas", emoji: "🤲" },
      { value: "Tobillos o pies", emoji: "🦶" },
    ],
  },
  {
    id: "activity",
    question: "¿Cuál es tu actividad física diaria habitual?",
    subtitle: "Tu nivel actual nos ayuda a no sobrecargarte ni limitarte",
    type: "options",
    options: [
      { value: "Muy sedentario, casi no me muevo", emoji: "🛋️" },
      { value: "Camino un poco en casa", emoji: "🏠" },
      { value: "Camino 15-30 min al día", emoji: "🚶" },
      { value: "Camino más de 30 min al día", emoji: "🏃" },
      { value: "Hago algún ejercicio regular", emoji: "💪" },
    ],
  },
  {
    id: "energy",
    question: "¿Cómo describes tu nivel de energía?",
    subtitle: "Esto nos ayuda a calibrar la intensidad de los ejercicios",
    type: "options",
    options: [
      { value: "Muy bajo, me canso fácilmente", emoji: "😴" },
      { value: "Bajo, me canso más de lo normal", emoji: "😓" },
      { value: "Moderado, me mantengo activo", emoji: "😊" },
      { value: "Bueno, tengo bastante energía", emoji: "😃" },
    ],
  },
  {
    id: "walkingAid",
    question: "¿Utilizas algún apoyo para caminar?",
    subtitle: "Algunos ejercicios se adaptan según el apoyo que usas",
    type: "options",
    options: [
      { value: "No uso apoyo", emoji: "🚶" },
      { value: "Uso bastón", emoji: "🦯" },
      { value: "Uso andador", emoji: "🦼" },
      { value: "Uso silla de ruedas", emoji: "♿" },
    ],
  },
  {
    id: "recentExercise",
    question: "¿Has hecho ejercicios en los últimos 6 meses?",
    subtitle: "Esto define si eres principiante o tienes algo de base",
    type: "options",
    options: [
      { value: "No, soy completamente nuevo", emoji: "🌱" },
      { value: "He hecho algo ocasionalmente", emoji: "🌿" },
      { value: "He mantenido una rutina básica", emoji: "🌳" },
    ],
  },
  {
    id: "goals",
    question: "¿Cuáles son tus objetivos principales?",
    subtitle: "Selecciona todos los que apliquen",
    type: "multi",
    options: [
      { value: "Mejorar la forma de caminar", emoji: "🚶" },
      { value: "Reducir el dolor", emoji: "💊" },
      { value: "Fortalecer músculos", emoji: "💪" },
      { value: "Mejorar el equilibrio", emoji: "⚖️" },
      { value: "Tener más energía", emoji: "⚡" },
      { value: "Mejorar la postura", emoji: "🧍" },
      { value: "Reducir la rigidez", emoji: "🤸" },
    ],
  },
];
