import { createBrowserRouter } from "react-router";
import { AppLayout } from "./components/AppLayout";
import { Welcome } from "./pages/Welcome";
import { Questionnaire } from "./pages/Questionnaire";
import { Home } from "./pages/Home";
import { CategoryExercises } from "./pages/CategoryExercises";
import { ExerciseDetail } from "./pages/ExerciseDetail";
import { MedicalWarning } from "./pages/MedicalWarning";
import { WeeklySummary } from "./pages/WeeklySummary";

export const router = createBrowserRouter([
  {
    Component: AppLayout,
    children: [
      { path: "/",                         Component: Welcome },
      { path: "/cuestionario",             Component: Questionnaire },
      { path: "/aviso-medico",             Component: MedicalWarning },
      { path: "/inicio",                   Component: Home },
      { path: "/categoria/:categoryId",    Component: CategoryExercises },
      { path: "/ejercicio/:exerciseId",    Component: ExerciseDetail },
      { path: "/resumen-semanal",          Component: WeeklySummary },
      { path: "*",                         Component: Welcome },
    ],
  },
]);
