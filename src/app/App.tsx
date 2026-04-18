import { RouterProvider } from "react-router";
import { router } from "./routes";
import "../styles/fonts.css";

export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        background: "#D8EDE2",
      }}
    >
      {/* Phone frame on desktop */}
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 0 60px rgba(0,0,0,0.2)",
        }}
      >
        <RouterProvider router={router} />
      </div>
    </div>
  );
}
