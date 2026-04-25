export interface Exercise {
  id: string;
  categoryId: string;
  name: string;
  difficulty: "Fácil" | "Moderado" | "Avanzado";
  maxPainLevel: number;
  duration: string;
  reps: string;
  sets: string;
  restTime: string;
  description: string;
  importance: string;
  dailyBenefit: string;
  videoId: string;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  shortName: string;
  description: string;
  emoji: string;
  gradient: string;
  lightBg: string;
  image: string;
}

export const categories: Category[] = [
  {
    id: "piernas-gluteos",
    name: "Piernas y Glúteos",
    shortName: "Piernas",
    description: "Fortalece tus piernas para caminar con más seguridad y estabilidad",
    emoji: "🦵",
    gradient: "from-emerald-500 to-teal-600",
    lightBg: "bg-emerald-50",
    image: "https://images.unsplash.com/photo-1637227929217-3b62679e6756?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: "core",
    name: "Core y Zona Central",
    shortName: "Core",
    description: "Mejora tu postura y reduce dolores de espalda con ejercicios centrales",
    emoji: "💪",
    gradient: "from-blue-500 to-indigo-600",
    lightBg: "bg-blue-50",
    image: "https://images.unsplash.com/photo-1747302653826-42c6cd7295f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: "brazos-superior",
    name: "Brazos y Parte Superior",
    shortName: "Brazos",
    description: "Gana fuerza en brazos y hombros para las actividades del día a día",
    emoji: "🤲",
    gradient: "from-orange-400 to-rose-500",
    lightBg: "bg-orange-50",
    image: "https://images.unsplash.com/photo-1767611092536-7745b4f5617f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: "movilidad-flexibilidad",
    name: "Movilidad y Flexibilidad",
    shortName: "Flexibilidad",
    description: "Mejora tu rango de movimiento y reduce la rigidez en articulaciones",
    emoji: "🧘",
    gradient: "from-violet-500 to-purple-600",
    lightBg: "bg-violet-50",
    image: "https://images.unsplash.com/photo-1758798469179-dea5d63257ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
];

export const exercises: Exercise[] = [
  // PIERNAS Y GLÚTEOS
  {
    id: "marcha-lugar-asistida",
    categoryId: "piernas-gluteos",
    name: "Marcha en el Lugar Asistida",
    difficulty: "Fácil",
    maxPainLevel: 3,
    duration: "5–8 min",
    reps: "30–60 segundos",
    sets: "2–3 series",
    restTime: "30–45 segundos entre series",
    description:
      "De pie, sosteniéndote de una silla firme o de la pared con ambas manos, levanta alternadamente las rodillas como si caminaras en el mismo sitio. Mantén el torso erguido, los hombros relajados y el ritmo constante. Si puedes, sube las rodillas hasta la altura de la cadera.",
    importance:
      "Activa el patrón básico de marcha y mantiene activos los músculos que usamos al caminar. Es el primer paso para recuperar o mantener una marcha segura y fluida.",
    dailyBenefit:
      "Mejora la seguridad al caminar dentro de casa y reduce la rigidez causada por la inactividad prolongada. Con el tiempo notarás que caminar se siente más natural y menos cansador.",
    videoId: "uX1CPosE6Bs",
    tags: ["marcha", "piernas", "circulación", "caminar"],
  },
  {
    id: "elevacion-talones",
    categoryId: "piernas-gluteos",
    name: "Elevación de Talones (Heel Raises)",
    difficulty: "Fácil",
    maxPainLevel: 3,
    duration: "6–8 min",
    reps: "10–15 repeticiones",
    sets: "2–3 series",
    restTime: "30–45 segundos entre series",
    description:
      "Párate detrás de una silla y apoya las manos en el respaldo para equilibrarte. Con los pies separados al ancho de las caderas, sube lentamente sobre las puntas de los pies elevando los talones del suelo. Mantén 2 segundos en la cima y baja despacio. Realiza el movimiento de forma controlada.",
    importance:
      "Fortalece las pantorrillas, que son los músculos clave en el impulso al caminar. Unas pantorrillas fuertes mejoran la propulsión en cada paso y la estabilidad general.",
    dailyBenefit:
      "Facilita subir escaleras, caminar con mayor estabilidad y reduce la sensación de piernas pesadas o cansadas al final del día.",
    videoId: "xDrezw4UkoE",
    tags: ["equilibrio", "piernas", "caídas", "pantorrillas"],
  },
  {
    id: "elevacion-puntas",
    categoryId: "piernas-gluteos",
    name: "Elevación de Puntas (Toe Raises)",
    difficulty: "Fácil",
    maxPainLevel: 3,
    duration: "6–8 min",
    reps: "10–15 repeticiones",
    sets: "2–3 series",
    restTime: "30–45 segundos entre series",
    description:
      "De pie, apoyándote en una silla o pared, levanta la parte delantera del pie (la punta) manteniendo los talones firmemente apoyados en el suelo. Mantén 2 segundos arriba y baja con control. Alterna o hazlo con ambos pies a la vez según tu comodidad.",
    importance:
      "Mejora el control del pie al caminar y fortalece los músculos tibiales anteriores, que son los responsables de levantar la punta del pie en cada paso. Esto previene el típico 'arrastre de pies'.",
    dailyBenefit:
      "Reduce significativamente el riesgo de caídas al evitar tropiezos con alfombras, bordillos o irregularidades del suelo. Te dará mayor seguridad al caminar en cualquier superficie.",
    videoId: "enJ6yYJerVw",
    tags: ["equilibrio", "piernas", "caídas", "marcha"],
  },
  {
    id: "sit-to-stand",
    categoryId: "piernas-gluteos",
    name: "Sentarse y Levantarse (Sit-to-Stand)",
    difficulty: "Moderado",
    maxPainLevel: 4,
    duration: "8–10 min",
    reps: "8–12 repeticiones",
    sets: "2–3 series",
    restTime: "45–60 segundos entre series",
    description:
      "Siéntate en el borde de una silla resistente con los pies separados al ancho de las caderas. Inclínate ligeramente hacia adelante, lleva el peso sobre los pies y levántate empujando con las piernas. Puedes apoyarte en los reposabrazos si lo necesitas al principio. Baja de vuelta lentamente y con control.",
    importance:
      "Es considerado uno de los ejercicios funcionales más importantes para adultos mayores. Mide y entrena la fuerza de los miembros inferiores de manera directa, replicando uno de los movimientos más frecuentes del día.",
    dailyBenefit:
      "Fundamental para mantener la independencia: levantarte del sofá, de la cama, del inodoro o de cualquier silla sin ayuda de otras personas. Reduce el agotamiento al realizar estas tareas.",
    videoId: "LPOmE3SVzSs",
    tags: ["fuerza", "piernas", "independencia", "caídas"],
  },
  {
    id: "abduccion-cadera",
    categoryId: "piernas-gluteos",
    name: "Abducción de Cadera de Pie",
    difficulty: "Fácil",
    maxPainLevel: 3,
    duration: "8–10 min",
    reps: "10–15 repeticiones por pierna",
    sets: "2–3 series",
    restTime: "30–45 segundos entre series",
    description:
      "Párate de lado a la silla y apoya una mano en el respaldo. Manteniendo el cuerpo erguido y la pierna recta, eleva lentamente la pierna exterior hacia el lado (sin inclinar el tronco). Mantén 2 segundos en la cima y baja con control. Repite y luego cambia de pierna.",
    importance:
      "Activa el glúteo medio, que es el músculo clave para la estabilidad pélvica al caminar. Sin este músculo trabajando bien, la pelvis se inclina a cada paso y aumenta el riesgo de caídas.",
    dailyBenefit:
      "Evita el balanceo del cuerpo al caminar (marcha en 'tumbos'), mejora el equilibrio lateral y reduce el riesgo de caídas al pisar en suelo irregular.",
    videoId: "fgklIjEjcXc",
    tags: ["glúteos", "equilibrio", "caídas", "marcha"],
  },
  {
    id: "extension-cadera",
    categoryId: "piernas-gluteos",
    name: "Extensión de Cadera de Pie",
    difficulty: "Fácil",
    maxPainLevel: 3,
    duration: "8–10 min",
    reps: "10–15 repeticiones por pierna",
    sets: "2–3 series",
    restTime: "30–45 segundos entre series",
    description:
      "De pie, apoyándote en el respaldo de una silla con ambas manos, lleva lentamente una pierna hacia atrás manteniéndola recta y sin arquear la espalda. Contrae el glúteo en la posición final, mantén 2 segundos y vuelve al inicio. Cambia de pierna al terminar la serie.",
    importance:
      "Fortalece el glúteo mayor, que es el músculo más grande del cuerpo y el principal responsable del impulso al caminar y de estabilizar la espalda baja.",
    dailyBenefit:
      "Mejora el impulso en cada paso al caminar, facilita subir escaleras y levantarse de posiciones bajas. También reduce el dolor de espalda baja asociado a glúteos débiles.",
    videoId: "QkV5YiwF9ds",
    tags: ["glúteos", "piernas", "marcha", "espalda"],
  },
  {
    id: "mini-sentadillas",
    categoryId: "piernas-gluteos",
    name: "Mini Sentadillas (Mini Squats)",
    difficulty: "Moderado",
    maxPainLevel: 4,
    duration: "8–10 min",
    reps: "8–12 repeticiones",
    sets: "2–3 series",
    restTime: "45–60 segundos entre series",
    description:
      "Párate frente a una silla o sujétate de una superficie estable. Con los pies separados al ancho de las caderas, dobla levemente las rodillas (solo 20–30° de flexión) como si fueras a sentarte pero sin llegar a la silla. Mantén la espalda recta, vuelve a ponerte de pie y repite.",
    importance:
      "Fortalece cuádriceps y glúteos de forma segura y controlada, con menor carga sobre las rodillas que una sentadilla completa. Es ideal para quienes tienen dolor de rodilla o limitación de flexión.",
    dailyBenefit:
      "Facilita agacharse para recoger objetos del suelo, levantarse de posiciones bajas sin dolor y mantener el equilibrio al bajar una escalera.",
    videoId: "5hWg9p_jpYs",
    tags: ["piernas", "glúteos", "rodillas", "fuerza"],
  },
  {
    id: "paso-al-frente",
    categoryId: "piernas-gluteos",
    name: "Paso al Frente (Step Forward)",
    difficulty: "Moderado",
    maxPainLevel: 3,
    duration: "8–10 min",
    reps: "8–12 repeticiones por pierna",
    sets: "2–3 series",
    restTime: "45 segundos entre series",
    description:
      "De pie, apoyándote en una silla si lo necesitas, da un paso controlado hacia adelante con una pierna. Apoya el talón primero, transfiere el peso hacia esa pierna y luego vuelve a la posición inicial. Alterna entre piernas manteniendo el torso recto durante todo el movimiento.",
    importance:
      "Entrena el control dinámico del cuerpo y la coordinación entre piernas durante el movimiento. Replica el inicio de la marcha, que es el momento de mayor riesgo de caída.",
    dailyBenefit:
      "Mejora la capacidad de iniciar la marcha con seguridad, cruzar umbrales de puertas, y reaccionar ante obstáculos del camino sin perder el equilibrio.",
    videoId: "V18OwzorOkY",
    tags: ["marcha", "coordinación", "equilibrio", "caídas"],
  },
  {
    id: "balance-unipodal",
    categoryId: "piernas-gluteos",
    name: "Balance Unipodal Asistido",
    difficulty: "Moderado",
    maxPainLevel: 2,
    duration: "6–8 min",
    reps: "15–30 segundos por pierna",
    sets: "2–3 series",
    restTime: "30–45 segundos entre series",
    description:
      "De pie junto a una silla o pared con una mano apoyada para mayor seguridad, levanta lentamente un pie del suelo y mantén el equilibrio sobre la otra pierna. Mantén la mirada al frente, el cuerpo recto y respira normalmente. Baja el pie con control y repite con la otra pierna.",
    importance:
      "Mejora el equilibrio estático, que es la capacidad de mantenerse firme en un punto. Es una de las habilidades más importantes para prevenir caídas en adultos mayores.",
    dailyBenefit:
      "Reduce el riesgo de caídas al vestirse (ponerse pantalones, calcetines o zapatos), al bajar del autobús o al pararse sobre superficies inestables como alfombras o césped.",
    videoId: "krJ9hyLOiQg",
    tags: ["equilibrio", "caídas", "estabilidad", "piernas"],
  },
  {
    id: "puente-gluteos",
    categoryId: "piernas-gluteos",
    name: "Puente de Glúteos (Glute Bridge)",
    difficulty: "Moderado",
    maxPainLevel: 3,
    duration: "8–10 min",
    reps: "10–15 repeticiones",
    sets: "2–3 series",
    restTime: "45 segundos entre series",
    description:
      "Recuéstate boca arriba con las rodillas dobladas, los pies apoyados en el suelo separados al ancho de la cadera y los brazos a los lados. Contrae el abdomen y los glúteos, y eleva la pelvis del suelo hasta formar una línea recta desde los hombros hasta las rodillas. Mantén 2–3 segundos y baja lentamente.",
    importance:
      "Fortalece glúteos y zona lumbar simultáneamente desde una posición acostada, lo que lo hace muy seguro para personas con problemas de equilibrio o de pie.",
    dailyBenefit:
      "Facilita levantarse de la cama por las mañanas, mejora la estabilidad pélvica al caminar y reduce el dolor en la zona baja de la espalda y caderas.",
    videoId: "NUFvi-gPojg",
    tags: ["glúteos", "espalda", "estabilidad", "caídas"],
  },

  // CORE
  {
    id: "activacion-abdominal",
    categoryId: "core",
    name: "Activación Abdominal Básica (Bracing)",
    difficulty: "Fácil",
    maxPainLevel: 2,
    duration: "5–7 min",
    reps: "10 repeticiones (5–10 seg c/u)",
    sets: "2–3 series",
    restTime: "30 segundos entre series",
    description:
      "Siéntate o recuéstate en una posición cómoda. Sin contener la respiración, contrae el abdomen como si te fueras a proteger de un golpe leve. Mantén esa tensión de 5 a 10 segundos mientras sigues respirando con normalidad. Relaja y repite.",
    importance:
      "Es la base de toda la estabilidad lumbo-pélvica. Aprender a activar el core de forma consciente es el primer paso para proteger la columna en cualquier movimiento.",
    dailyBenefit:
      "Mejora el control al levantarse, caminar y evitar movimientos bruscos que generen dolor lumbar. Con la práctica, el abdomen se activa de forma automática al moverse.",
    videoId: "yY-F5ckouCI",
    tags: ["core", "postura", "dolor lumbar", "estabilidad"],
  },
  {
    id: "inclinacion-pelvica",
    categoryId: "core",
    name: "Inclinación Pélvica (Pelvic Tilt)",
    difficulty: "Fácil",
    maxPainLevel: 2,
    duration: "6–8 min",
    reps: "10–15 repeticiones",
    sets: "2–3 series",
    restTime: "30 segundos entre series",
    description:
      "Recuéstate boca arriba con las rodillas dobladas y los pies apoyados en el suelo. Contrae el abdomen y presiona suavemente la zona lumbar contra el suelo, como si quisieras aplanar la curva de la espalda baja. Mantén 3–5 segundos y relaja. El movimiento es pequeño y controlado.",
    importance:
      "Reeduca la postura lumbar y reduce la rigidez en la espalda baja. Enseña al cuerpo la posición neutra correcta de la pelvis, que es fundamental para evitar lesiones.",
    dailyBenefit:
      "Facilita cambiar de posición en la cama y reduce molestias al estar sentado mucho tiempo. Notarás menos tensión en la espalda baja al final del día.",
    videoId: "44D6Xc2Fkek",
    tags: ["core", "espalda", "dolor lumbar", "postura"],
  },
  {
    id: "respiracion-diafragmatica",
    categoryId: "core",
    name: "Respiración Diafragmática",
    difficulty: "Fácil",
    maxPainLevel: 1,
    duration: "5–8 min",
    reps: "5–10 respiraciones profundas",
    sets: "2–3 series",
    restTime: "30 segundos entre series",
    description:
      "Siéntate o recuéstate cómodamente. Coloca una mano sobre el pecho y otra sobre el abdomen. Inhala lentamente por la nariz durante 4 segundos, dejando que el abdomen se expanda (la mano del abdomen debe subir, no la del pecho). Exhala despacio por la boca durante 6 segundos. Repite.",
    importance:
      "Activa el diafragma y el core profundo simultáneamente. Una respiración correcta es el fundamento de toda la estabilidad central y mejora la oxigenación de todo el cuerpo.",
    dailyBenefit:
      "Reduce la fatiga al caminar y mejora la resistencia en actividades básicas. También disminuye el estrés y la tensión muscular general, favoreciendo el bienestar.",
    videoId: "h2C4dwe6f4s",
    tags: ["core", "respiración", "relajación", "estabilidad"],
  },
  {
    id: "marcha-abdominal",
    categoryId: "core",
    name: "Marcha Abdominal (Dead Bug Básico)",
    difficulty: "Moderado",
    maxPainLevel: 3,
    duration: "7–10 min",
    reps: "8–12 repeticiones por lado",
    sets: "2–3 series",
    restTime: "30–45 segundos entre series",
    description:
      "Recuéstate boca arriba con las rodillas dobladas y los brazos extendidos hacia el techo. Activa el abdomen pegando la espalda al suelo. Lentamente baja un brazo hacia atrás o extiende una pierna hacia el frente, manteniendo el abdomen firme. Vuelve al centro y alterna lados.",
    importance:
      "Trabaja la coordinación entre el core y las extremidades, que es exactamente lo que ocurre al caminar. Mejora la estabilidad dinámica de la columna.",
    dailyBenefit:
      "Mejora la estabilidad al caminar, especialmente en superficies irregulares. Reduce el riesgo de perder el equilibrio al realizar movimientos combinados de brazos y piernas.",
    videoId: "XkTtXA3-IqU",
    tags: ["core", "coordinación", "equilibrio", "estabilidad"],
  },
  {
    id: "puente-basico",
    categoryId: "core",
    name: "Elevación de Pelvis (Puente Básico)",
    difficulty: "Moderado",
    maxPainLevel: 3,
    duration: "8–10 min",
    reps: "10–15 repeticiones",
    sets: "2–3 series",
    restTime: "45 segundos entre series",
    description:
      "Recuéstate boca arriba con las rodillas dobladas y los pies apoyados en el suelo. Contrae el abdomen y los glúteos, y eleva la cadera del suelo formando una línea recta desde hombros hasta rodillas. Mantén 2–3 segundos en la cima y baja con control. Evita arquear la espalda.",
    importance:
      "Fortalece la cadena posterior (glúteos, isquiotibiales y espalda baja) y mejora la estabilidad lumbar. Es uno de los ejercicios más completos y seguros para la zona central.",
    dailyBenefit:
      "Facilita levantarse de la cama o silla con menos esfuerzo y reduce el dolor en la zona baja de la espalda y caderas. También mejora la postura al caminar.",
    videoId: "lVKjC8F_6Yo",
    tags: ["core", "glúteos", "espalda", "estabilidad"],
  },
  {
    id: "plancha-modificada",
    categoryId: "core",
    name: "Plancha Modificada (Rodillas Apoyadas)",
    difficulty: "Moderado",
    maxPainLevel: 3,
    duration: "6–8 min",
    reps: "10–20 segundos",
    sets: "2–3 series",
    restTime: "45 segundos entre series",
    description:
      "Apoya los antebrazos y las rodillas en el suelo. Eleva las caderas para que tu cuerpo forme una línea recta desde las rodillas hasta los hombros. Activa el abdomen y los glúteos para mantener la posición. Respira de forma constante y evita dejar caer o elevar las caderas.",
    importance:
      "Mejora la resistencia del core de manera isométrica (sin movimiento). Fortalecer el core de esta forma es esencial para mantener la postura erguida durante actividades prolongadas.",
    dailyBenefit:
      "Permite mantener postura erguida por más tiempo sin fatiga, ya sea al caminar, estar de pie en una cola o realizar actividades del hogar.",
    videoId: "Po0yoKpRjNM",
    tags: ["core", "postura", "resistencia", "estabilidad"],
  },
  {
    id: "rotacion-tronco-sentado",
    categoryId: "core",
    name: "Rotaciones de Tronco Sentado",
    difficulty: "Fácil",
    maxPainLevel: 2,
    duration: "6–8 min",
    reps: "10–15 repeticiones por lado",
    sets: "2–3 series",
    restTime: "30 segundos entre series",
    description:
      "Siéntate erguido en una silla con los pies apoyados en el suelo y los brazos cruzados sobre el pecho. Gira lentamente el torso hacia un lado hasta donde llegues sin dolor o forzar, mantén 2 segundos y regresa al centro. Repite hacia el otro lado.",
    importance:
      "Mantiene la movilidad espinal y trabaja los músculos oblicuos, que son clave para todos los movimientos de giro. Previene la rigidez de la columna dorsal.",
    dailyBenefit:
      "Facilita acciones cotidianas como mirar hacia atrás al conducir o caminar, alcanzar objetos a los lados y girarse para hablar con alguien.",
    videoId: "V9iNr6CbEn4",
    tags: ["core", "movilidad", "columna", "flexibilidad"],
  },
  {
    id: "flexion-lateral-tronco",
    categoryId: "core",
    name: "Flexión Lateral de Tronco Sentado",
    difficulty: "Fácil",
    maxPainLevel: 2,
    duration: "6–8 min",
    reps: "10–15 repeticiones por lado",
    sets: "2–3 series",
    restTime: "30 segundos entre series",
    description:
      "Siéntate erguido en una silla con los pies bien apoyados. Desliza lentamente una mano por el lado de la silla hacia el suelo, inclinando el torso hacia ese lado. Mantén 2 segundos y regresa al centro. Alterna lados con movimiento controlado y sin inclinar la pelvis.",
    importance:
      "Mejora la movilidad lateral de la columna y el control de los músculos oblicuos. Contrarresta la tendencia a inclinarse hacia un lado que se desarrolla con la edad.",
    dailyBenefit:
      "Ayuda al vestirse, a recoger objetos del suelo o de los lados sin perder el equilibrio, y mejora la capacidad de alcanzar cosas sin levantarse.",
    videoId: "UFPiB97j6vU",
    tags: ["core", "movilidad", "columna", "equilibrio"],
  },
  {
    id: "extension-tronco-silla",
    categoryId: "core",
    name: "Extensión de Tronco en Silla",
    difficulty: "Fácil",
    maxPainLevel: 2,
    duration: "6–8 min",
    reps: "10–12 repeticiones",
    sets: "2–3 series",
    restTime: "30 segundos entre series",
    description:
      "Siéntate al borde de una silla con los pies apoyados y las manos en los muslos o en la nuca. Lleva los hombros hacia atrás y el torso ligeramente hacia atrás, expandiendo el pecho. Mantén 2–3 segundos y regresa a la posición inicial. No fuerces el movimiento.",
    importance:
      "Contrarresta la postura encorvada (cifosis) que se desarrolla progresivamente con la edad, al fortalecer los músculos extensores de la espalda.",
    dailyBenefit:
      "Mejora la postura al caminar y al estar sentado, y reduce el dolor en la zona dorsal y cervical asociado a la postura encorvada.",
    videoId: "1rn-nBatIM8",
    tags: ["core", "postura", "espalda", "columna"],
  },
  {
    id: "bird-dog-modificado",
    categoryId: "core",
    name: "Bird Dog Modificado",
    difficulty: "Moderado",
    maxPainLevel: 3,
    duration: "8–10 min",
    reps: "8–12 repeticiones por lado",
    sets: "2–3 series",
    restTime: "30–45 segundos entre series",
    description:
      "Colócate en cuatro apoyos (manos y rodillas en el suelo, espalda plana como una mesa). Activa el abdomen y extiende lentamente un brazo hacia adelante o una pierna hacia atrás, manteniendo la cadera y la espalda estables. Mantén 3 segundos y regresa. Alterna lados.",
    importance:
      "Trabaja la estabilidad cruzada del core, que es la coordinación entre brazo y pierna opuestos que usamos constantemente al caminar. Mejora el equilibrio y la coordinación.",
    dailyBenefit:
      "Mejora el equilibrio al moverse y la capacidad de reaccionar ante tropiezos. Reduce el riesgo de caídas al mejorar la coordinación automática del cuerpo.",
    videoId: "HtMI17DGuTk",
    tags: ["core", "coordinación", "equilibrio", "estabilidad"],
  },

  // BRAZOS Y PARTE SUPERIOR
  {
    id: "elevacion-frontal",
    categoryId: "brazos-superior",
    name: "Elevación Frontal con Botellas",
    difficulty: "Fácil",
    maxPainLevel: 3,
    duration: "6–8 min",
    reps: "10–12 repeticiones",
    sets: "2–3 series",
    restTime: "30–45 segundos entre series",
    description:
      "Siéntate o párate con la espalda recta sosteniendo una botella de agua en cada mano (o sin peso al inicio). Con los codos ligeramente doblados y las palmas hacia abajo, levanta ambos brazos al frente hasta la altura de los hombros de forma lenta y controlada. Mantén 1 segundo y baja despacio.",
    importance:
      "Fortalece los hombros (deltoides anterior) y mejora el control motor de los brazos. Una musculatura de hombro fuerte protege la articulación y reduce el riesgo de lesiones.",
    dailyBenefit:
      "Ayuda a levantar objetos ligeros como platos, bolsas o libros sin esfuerzo ni dolor. Mejora la capacidad de alcanzar objetos que están al frente o en estantes.",
    videoId: "",
    tags: ["brazos", "hombros", "fuerza", "actividad diaria"],
  },
  {
    id: "elevacion-lateral",
    categoryId: "brazos-superior",
    name: "Elevación Lateral Sentado",
    difficulty: "Fácil",
    maxPainLevel: 3,
    duration: "6–8 min",
    reps: "10–12 repeticiones",
    sets: "2–3 series",
    restTime: "30–45 segundos entre series",
    description:
      "Siéntate erguido en una silla con los pies apoyados en el suelo. Sostén una botella ligera en cada mano con las palmas hacia adentro. Lentamente levanta ambos brazos hacia los lados hasta la altura de los hombros, mantén 1 segundo y baja con control. Evita elevar los hombros hacia las orejas.",
    importance:
      "Activa el deltoides medial y mejora la estabilidad del hombro. Un hombro estable reduce el riesgo de lesiones y facilita todos los movimientos del brazo.",
    dailyBenefit:
      "Facilita movimientos laterales como abrir puertas girando el brazo, alcanzar objetos a los lados o colgar ropa. Mejora la independencia en tareas del hogar.",
    videoId: "",
    tags: ["brazos", "hombros", "estabilidad", "fuerza"],
  },
  {
    id: "curl-biceps",
    categoryId: "brazos-superior",
    name: "Curl de Bíceps con Botellas",
    difficulty: "Fácil",
    maxPainLevel: 3,
    duration: "8 min",
    reps: "10–15 repeticiones",
    sets: "2–3 series",
    restTime: "30–45 segundos entre series",
    description:
      "Siéntate o párate con la espalda recta. Sostén una botella de agua en cada mano con los codos pegados al cuerpo y las palmas hacia arriba. Dobla los codos llevando las botellas hacia los hombros, mantén 1 segundo en la cima y baja lentamente. Realiza el movimiento de forma controlada sin balancear el cuerpo.",
    importance:
      "Fortalece el bíceps braquial, músculo fundamental para todas las tareas que implican doblar el codo y levantar objetos. Es uno de los ejercicios más funcionales para el día a día.",
    dailyBenefit:
      "Mejora la capacidad de cargar bolsas del mercado, levantar objetos del suelo, abrir frascos y realizar tareas del hogar que requieren fuerza en los brazos.",
    videoId: "ykJmrZ5v0Oo",
    tags: ["brazos", "fuerza", "actividad diaria", "bíceps"],
  },
  {
    id: "flexiones-pared",
    categoryId: "brazos-superior",
    name: "Flexiones en Pared",
    difficulty: "Fácil",
    maxPainLevel: 3,
    duration: "6–8 min",
    reps: "8–12 repeticiones",
    sets: "2–3 series",
    restTime: "30–45 segundos entre series",
    description:
      "Párate frente a una pared a una distancia de un brazo. Apoya las palmas en la pared a la altura de los hombros. Dobla los codos inclinándote hacia la pared de forma controlada, mantén 1 segundo y empuja para volver a la posición inicial. Mantén el cuerpo recto como una tabla durante todo el movimiento.",
    importance:
      "Fortalece los músculos del pecho (pectoral) y los brazos (tríceps) de forma segura y adaptada. Al realizarse de pie contra la pared reduce drásticamente el riesgo respecto a una flexión en el suelo.",
    dailyBenefit:
      "Ayuda en movimientos de empuje cotidianos como abrir puertas pesadas, empujar un carro del supermercado o levantarse apoyando las manos en una superficie.",
    videoId: "",
    tags: ["brazos", "pecho", "fuerza", "tríceps"],
  },
  {
    id: "rotacion-hombros",
    categoryId: "brazos-superior",
    name: "Rotación de Hombros",
    difficulty: "Fácil",
    maxPainLevel: 2,
    duration: "5–6 min",
    reps: "10 repeticiones",
    sets: "2–3 series",
    restTime: "30 segundos entre series",
    description:
      "Siéntate o párate con la espalda recta y los brazos relajados a los lados. Realiza círculos lentos y amplios con ambos hombros: primero hacia adelante (5 círculos) y luego hacia atrás (5 círculos). Enfócate en hacer el movimiento lo más amplio y suave posible.",
    importance:
      "Mantiene y mejora la movilidad articular del hombro, que es fundamental para evitar la rigidez acumulada por la postura sentada y el paso del tiempo.",
    dailyBenefit:
      "Reduce la rigidez y el dolor en hombros y cuello que aparece por las mañanas o tras estar mucho tiempo en la misma posición. Facilita los movimientos del día a día.",
    videoId: "ZxRoSV3GHBM",
    tags: ["hombros", "movilidad", "rigidez", "cuello"],
  },
  {
    id: "apretar-pelota",
    categoryId: "brazos-superior",
    name: "Apretar Pelota (Grip Strength)",
    difficulty: "Fácil",
    maxPainLevel: 2,
    duration: "5–6 min",
    reps: "10–15 repeticiones",
    sets: "2–3 series",
    restTime: "30 segundos entre series",
    description:
      "Siéntate cómodamente con el codo apoyado en el muslo. Sostén una pelota de goma, antiestrés o similar en la palma de la mano. Aprieta con toda la fuerza posible durante 3–5 segundos y luego relaja completamente. Alterna entre manos en cada serie.",
    importance:
      "Fortalece los músculos de la mano, dedos y antebrazo. La fuerza de agarre es uno de los mejores indicadores de salud funcional y longevidad en adultos mayores.",
    dailyBenefit:
      "Mejora el agarre para abrir frascos, sostener utensilios, girar llaves, abotonarse la ropa y cualquier tarea que requiera fuerza y precisión en las manos.",
    videoId: "",
    tags: ["manos", "agarre", "fuerza", "antebrazo"],
  },
  {
    id: "elevacion-brazos-sin-peso",
    categoryId: "brazos-superior",
    name: "Elevación de Brazos sin Peso",
    difficulty: "Fácil",
    maxPainLevel: 2,
    duration: "5–6 min",
    reps: "10 repeticiones",
    sets: "2–3 series",
    restTime: "30 segundos entre series",
    description:
      "Siéntate erguido en una silla con los pies apoyados. Levanta lentamente ambos brazos hacia arriba (como si quisieras tocar el techo), expande el pecho y estira la columna. Mantén 2–3 segundos en la cima y baja suavemente. Coordina el movimiento con la respiración: sube al inhalar, baja al exhalar.",
    importance:
      "Mejora la movilidad global del hombro y la columna torácica. Al realizarse sin peso, es el ejercicio de brazo más seguro y accesible para cualquier nivel de condición física.",
    dailyBenefit:
      "Facilita todos los movimientos diarios que implican levantar los brazos, como peinarse, alcanzar objetos en estantes altos o ponerse una prenda por la cabeza.",
    videoId: "",
    tags: ["brazos", "hombros", "movilidad", "actividad diaria"],
  },
  {
    id: "remo-banda-elastica",
    categoryId: "brazos-superior",
    name: "Remo con Banda Elástica",
    difficulty: "Fácil",
    maxPainLevel: 3,
    duration: "7–8 min",
    reps: "10–12 repeticiones",
    sets: "2–3 series",
    restTime: "30–45 segundos entre series",
    description:
      "Siéntate en una silla con los pies apoyados en el suelo. Coloca el centro de una banda elástica alrededor de los pies. Sostén los extremos con ambas manos, estira la espalda y tira de la banda hacia tu cuerpo doblando los codos y juntando los omóplatos. Mantén 2 segundos y regresa con control.",
    importance:
      "Fortalece simultáneamente la espalda media (romboides, trapecio inferior) y los bíceps. Estos músculos son clave para mantener la postura erguida y prevenir la joroba.",
    dailyBenefit:
      "Mejora significativamente la postura al caminar, sentarse y estar de pie. También reduce el dolor en la espalda media y los hombros asociado a la postura encorvada.",
    videoId: "",
    tags: ["espalda", "brazos", "postura", "banda elástica"],
  },
  {
    id: "extension-brazos-frente",
    categoryId: "brazos-superior",
    name: "Extensión de Brazos al Frente",
    difficulty: "Fácil",
    maxPainLevel: 2,
    duration: "5–6 min",
    reps: "10 repeticiones",
    sets: "2–3 series",
    restTime: "30 segundos entre series",
    description:
      "Siéntate erguido en una silla con los pies apoyados. Extiende ambos brazos hacia adelante a la altura de los hombros con las palmas hacia abajo. Mantén la posición de 3 a 5 segundos con el abdomen activado. Baja lentamente los brazos y repite. Asegúrate de no arquear la espalda.",
    importance:
      "Activa los músculos estabilizadores del hombro y el core al mismo tiempo, trabajando el control postural bajo carga estática (isométrica).",
    dailyBenefit:
      "Ayuda en todos los movimientos de alcance: coger objetos en estantes, empujar o manejar objetos frente a ti. Mejora la coordinación general del brazo con el tronco.",
    videoId: "",
    tags: ["brazos", "estabilidad", "postura", "core"],
  },

  // MOVILIDAD Y FLEXIBILIDAD
  {
    id: "rutina-movilidad-general",
    categoryId: "movilidad-flexibilidad",
    name: "Rutina de Movilidad General (Principiantes)",
    difficulty: "Fácil",
    maxPainLevel: 2,
    duration: "5–10 min",
    reps: "5–10 minutos continuos",
    sets: "2–3 series",
    restTime: "30–60 segundos entre series",
    description:
      "Realiza una secuencia de movimientos suaves y lentos que recorren todo el cuerpo: empieza con círculos de cuello, sigue con hombros, muñecas, cintura, caderas y finaliza con tobillos. Cada movimiento se realiza de forma fluida, sin forzar, respirando profundamente. Es perfecta para calentar antes de ejercicios o para relajar al finalizar.",
    importance:
      "Prepara todas las articulaciones del cuerpo para el movimiento, mejora la flexibilidad global y relaja los músculos. Es el mejor punto de partida para cualquier persona que comienza a hacer ejercicio.",
    dailyBenefit:
      "Ayuda a moverse mejor y disminuye la rigidez matutina. Con práctica constante notarás que los movimientos cotidianos como agacharte, girar o estirarte se vuelven más fáciles y sin molestias.",
    videoId: "B4g9casB7uU",
    tags: ["movilidad", "flexibilidad", "principiantes", "calentamiento"],
  },
  {
    id: "muneca-dedos",
    categoryId: "movilidad-flexibilidad",
    name: "Ejercicios de Muñeca y Dedos",
    difficulty: "Fácil",
    maxPainLevel: 3,
    duration: "5–8 min",
    reps: "10–15 repeticiones o 30–60 s",
    sets: "2–3 series",
    restTime: "20–30 segundos entre series",
    description:
      "Siéntate cómodamente con los codos apoyados. Realiza círculos lentos con las muñecas en ambas direcciones (10 c/u), luego abre y cierra los dedos lentamente, después dobla los dedos hacia la palma uno a uno y finalmente sacude suavemente las manos para relajar. Realiza todo el ciclo sin apresurarte.",
    importance:
      "Mejora la movilidad, flexibilidad y fuerza de las manos y muñecas. Las manos rígidas son una queja muy frecuente en adultos mayores y estos ejercicios son la solución más segura y efectiva.",
    dailyBenefit:
      "Ayuda a escribir con mayor facilidad, agarrar objetos con más seguridad, abotonarse la ropa, abrir frascos y realizar cualquier actividad manual del hogar con menos esfuerzo y dolor.",
    videoId: "mkZfOh7Lx4s",
    tags: ["manos", "muñecas", "flexibilidad", "movilidad"],
  },
  {
    id: "movilidad-caderas",
    categoryId: "movilidad-flexibilidad",
    name: "Ejercicios para las Caderas",
    difficulty: "Moderado",
    maxPainLevel: 3,
    duration: "8–10 min",
    reps: "8–12 repeticiones o 30–60 s",
    sets: "2–3 series",
    restTime: "30–45 segundos entre series",
    description:
      "De pie apoyándote en una silla o sentado, realiza movimientos suaves de cadera: círculos amplios con las caderas en ambas direcciones, elevación alterna de rodillas al pecho, balanceo lateral de piernas y flexión-extensión de cadera. Cada movimiento debe ser lento y dentro del rango de comodidad.",
    importance:
      "Mejora la movilidad, estabilidad y equilibrio de la articulación de la cadera, que es la articulación más importante para la marcha y el movimiento funcional independiente.",
    dailyBenefit:
      "Facilita caminar, sentarse, levantarse y subir escalones con mucho menos esfuerzo y dolor. Una cadera móvil reduce significativamente el riesgo de caídas y lesiones.",
    videoId: "yx4O5v7SbaA",
    tags: ["cadera", "movilidad", "equilibrio", "marcha"],
  },
  {
    id: "movilidad-cuello",
    categoryId: "movilidad-flexibilidad",
    name: "Ejercicios para el Cuello",
    difficulty: "Fácil",
    maxPainLevel: 2,
    duration: "5–7 min",
    reps: "8–10 repeticiones o 20–30 s por movimiento",
    sets: "2–3 series",
    restTime: "20–30 segundos entre series",
    description:
      "Siéntate erguido con la espalda recta y los hombros relajados. Realiza lentamente: inclinación lateral (oreja al hombro), rotación de lado a lado, flexión hacia adelante (barbilla al pecho) y extensión suave hacia atrás. Mantén cada posición 3–5 segundos. Nunca hagas círculos completos ni fuerces el movimiento.",
    importance:
      "Reduce la rigidez y la tensión acumulada en la zona cervical, mejora la movilidad de las vértebras del cuello y alivia los dolores de cabeza por tensión que son muy comunes en adultos mayores.",
    dailyBenefit:
      "Ayuda a girar la cabeza con libertad para cruzar la calle, conducir o hablar con alguien. Mejora la postura y reduce el dolor de cuello y hombros al final del día.",
    videoId: "wE5av6dkjiM",
    tags: ["cuello", "flexibilidad", "rigidez", "postura"],
  },
  {
    id: "movilidad-tobillo",
    categoryId: "movilidad-flexibilidad",
    name: "Movilidad de Tobillo",
    difficulty: "Fácil",
    maxPainLevel: 3,
    duration: "6–8 min",
    reps: "10–15 repeticiones o 30–60 s por pie",
    sets: "2–3 series",
    restTime: "20–30 segundos entre series",
    description:
      "Siéntate en una silla con la espalda recta. Levanta un pie del suelo y realiza: círculos amplios con el tobillo en ambas direcciones (10 c/u), flexión y extensión del pie (apuntar hacia arriba y hacia abajo), y movimiento lateral de lado a lado. Repite con el otro pie. El movimiento debe salir del tobillo, no de la rodilla.",
    importance:
      "Mejora la movilidad del tobillo, favorece la circulación sanguínea en las piernas y mejora el equilibrio. Un tobillo con buen rango de movimiento es clave para una marcha segura.",
    dailyBenefit:
      "Facilita caminar, subir escalones y prevenir caídas al mejorar la estabilidad del pie. También reduce la hinchazón en pies y tobillos frecuente en personas que pasan mucho tiempo sentadas.",
    videoId: "F72y-6CPOP8",
    tags: ["tobillos", "movilidad", "equilibrio", "circulación"],
  },
];

// Ejercicios que requieren estar de pie — excluidos para usuarios en silla de ruedas,
// y balance-unipodal también excluido para usuarios con bastón o andador.
const STANDING_EXERCISE_IDS = new Set([
  "marcha-lugar-asistida",
  "elevacion-talones",
  "elevacion-puntas",
  "sit-to-stand",
  "abduccion-cadera",
  "extension-cadera",
  "mini-sentadillas",
  "paso-al-frente",
  "balance-unipodal",
  "flexiones-pared",
]);

export function deriveUserPainLevel(profile: Record<string, string | string[]>): number {
  const painAreas = (profile.painAreas as string[]) || [];
  const stiffness = profile.stiffness as string;

  if (painAreas.includes("No tengo dolor")) return 0;

  const stiffnessLevel =
    stiffness === "Casi todo el tiempo" ? 3 :
    stiffness === "Durante el día también" ? 2 :
    stiffness === "Solo por las mañanas" ? 1 : 0;

  return stiffnessLevel === 0 ? 1 : stiffnessLevel;
}

export function checkMedicalWarning(profile: Record<string, string | string[]>): boolean {
  const falls = profile.falls as string;
  const stiffness = profile.stiffness as string;
  const walkingAid = profile.walkingAid as string;
  const painAreas = (profile.painAreas as string[]) || [];

  const hasSeverePain =
    stiffness === "Casi todo el tiempo" && !painAreas.includes("No tengo dolor");
  const hasMultipleFalls = falls === "Dos o más caídas";
  const isWheelchairWithHighPain =
    walkingAid === "Uso silla de ruedas" && hasSeverePain;

  return hasSeverePain || hasMultipleFalls || isWheelchairWithHighPain;
}

export function getRecommendedExercises(profile: Record<string, string | string[]>): Exercise[] {
  const painAreas = (profile.painAreas as string[]) || [];
  const goals = (profile.goals as string[]) || [];
  const stiffnessZone = (profile.stiffnessZone as string[]) || [];
  const mobility = profile.mobility as string;
  const walkingAid = profile.walkingAid as string;
  const balance = profile.balance as string;
  const falls = profile.falls as string;
  const energy = profile.energy as string;

  const userPainLevel = deriveUserPainLevel(profile);

  const usesWheelchair =
    mobility === "Uso silla de ruedas" || walkingAid === "Uso silla de ruedas";
  const usesWalkingAid =
    mobility === "Uso bastón o andador" ||
    walkingAid === "Uso bastón" ||
    walkingAid === "Uso andador";
  const veryLowEnergy = energy === "Muy bajo, me canso fácilmente";

  // Construir el conjunto filtrado de ejercicios
  const pool = exercises.filter((ex) => {
    // Excluir ejercicios en los que el dolor del usuario supera el límite tolerado
    if (ex.maxPainLevel < userPainLevel) return false;

    // Usuarios en silla de ruedas no pueden hacer ejercicios de pie
    if (usesWheelchair && STANDING_EXERCISE_IDS.has(ex.id)) return false;

    // Usuarios con bastón o andador no deben intentar el equilibrio unipodal
    if (usesWalkingAid && ex.id === "balance-unipodal") return false;

    // Energía muy baja: solo ejercicios fáciles
    if (veryLowEnergy && ex.difficulty !== "Fácil") return false;

    return true;
  });

  // Puntuar cada ejercicio del conjunto
  const scored = pool.map((ex) => {
    let score = 0;

    // Zona de dolor → priorizar categoría correspondiente
    if (painAreas.includes("Piernas o rodillas")) {
      if (ex.categoryId === "piernas-gluteos") score += 3;
    }
    if (painAreas.includes("Espalda baja") || painAreas.includes("Espalda alta")) {
      if (ex.categoryId === "core") score += 3;
    }
    if (painAreas.includes("Cadera")) {
      if (ex.categoryId === "piernas-gluteos" || ex.categoryId === "movilidad-flexibilidad") score += 3;
      if (ex.id === "movilidad-caderas") score += 2;
    }
    if (painAreas.includes("Cuello o hombros")) {
      if (ex.categoryId === "brazos-superior" || ex.categoryId === "movilidad-flexibilidad") score += 3;
      if (ex.id === "movilidad-cuello") score += 2;
    }
    if (painAreas.includes("Pies o tobillos")) {
      if (ex.id === "movilidad-tobillo") score += 4;
    }

    // Historial de caídas → priorizar ejercicios de equilibrio
    if (falls === "Dos o más caídas") {
      if (ex.tags.includes("equilibrio")) score += 4;
      if (ex.tags.includes("caídas")) score += 3;
    } else if (falls === "Una caída") {
      if (ex.tags.includes("equilibrio")) score += 2;
    }

    // Dificultad de equilibrio
    if (balance === "Sí, tengo dificultades") {
      if (ex.tags.includes("equilibrio")) score += 3;
    } else if (balance === "A veces me siento inestable") {
      if (ex.tags.includes("equilibrio")) score += 2;
    }

    // Objetivos
    if (goals.includes("Mejorar el equilibrio") && ex.tags.includes("equilibrio")) score += 3;
    if (goals.includes("Mejorar la forma de caminar") && ex.tags.includes("marcha")) score += 3;
    if (goals.includes("Fortalecer músculos") && ex.difficulty !== "Fácil") score += 2;
    if (goals.includes("Reducir el dolor") && ex.difficulty === "Fácil") score += 2;
    if (goals.includes("Mejorar la postura") && ex.tags.includes("postura")) score += 3;
    if (goals.includes("Reducir la rigidez") && ex.categoryId === "movilidad-flexibilidad") score += 3;
    if (goals.includes("Tener más energía") && ex.difficulty === "Fácil") score += 1;

    // Zona de rigidez → ejercicios específicos
    if (stiffnessZone.includes("Cuello") && ex.id === "movilidad-cuello") score += 3;
    if (stiffnessZone.includes("Hombros") && ex.id === "rotacion-hombros") score += 3;
    if (stiffnessZone.includes("Caderas") && ex.id === "movilidad-caderas") score += 3;
    if (stiffnessZone.includes("Rodillas") && ex.id === "movilidad-tobillo") score += 2;
    if (stiffnessZone.includes("Manos o muñecas") && ex.id === "muneca-dedos") score += 3;
    if (stiffnessZone.includes("Tobillos o pies") && ex.id === "movilidad-tobillo") score += 3;

    // Preferir ejercicios fáciles para baja energía
    if (energy === "Bajo, me canso más de lo normal" && ex.difficulty === "Fácil") score += 1;

    return { exercise: ex, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Seleccionar los mejores ejercicios garantizando variedad (máx. 2 por categoría)
  const result: Exercise[] = [];
  const categoryCounts: Record<string, number> = {};

  for (const { exercise } of scored) {
    if (result.length >= 6) break;
    const catCount = categoryCounts[exercise.categoryId] ?? 0;
    if (catCount < 2) {
      result.push(exercise);
      categoryCounts[exercise.categoryId] = catCount + 1;
    }
  }

  // Si hay menos de 4, relajar el límite por categoría
  if (result.length < 4) {
    for (const { exercise } of scored) {
      if (result.length >= 4) break;
      if (!result.find((e) => e.id === exercise.id)) {
        result.push(exercise);
      }
    }
  }

  // Fallback si el conjunto de ejercicios estaba completamente vacío
  if (result.length === 0) {
    return [
      exercises.find((e) => e.id === "rutina-movilidad-general"),
      exercises.find((e) => e.id === "respiracion-diafragmatica"),
      exercises.find((e) => e.id === "movilidad-tobillo"),
      exercises.find((e) => e.id === "activacion-abdominal"),
    ].filter((e): e is Exercise => e !== undefined);
  }

  return result.slice(0, 6);
}