import { createBrowserRouter } from "react-router";
import { AppLayout } from "./components/AppLayout";
import { Welcome } from "./pages/Welcome";
import { Questionnaire } from "./pages/Questionnaire";
import { Home } from "./pages/Home";
import { CategoryExercises } from "./pages/CategoryExercises";
import { ExerciseDetail } from "./pages/ExerciseDetail";
import { MedicalWarning } from "./pages/MedicalWarning";
import { WeeklySummary } from "./pages/WeeklySummary";
import { WeeklyRoutine } from "./pages/WeeklyRoutine";
import { MedicalReport } from "./pages/MedicalReport";
import { Profile } from "./pages/Profile";

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
      { path: "/perfil",                    Component: Profile },
      { path: "/rutina-semanal",           Component: WeeklyRoutine },
      { path: "/reporte-medico",           Component: MedicalReport },
      { path: "*",                         Component: Welcome },
    ],
  },
]);
