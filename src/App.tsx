import { useState } from "react";
import Login from "./components/Login";
import Layout from "./components/Layout";

export type Screen =
  | "dashboard"
  | "nuevo-paquete"
  | "consulta"
  | "seguimiento"
  | "reportes"
  | "clientes"
  | "rutas";

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [screen, setScreen] = useState<Screen>("dashboard");

  if (!authenticated) {
    return <Login onLogin={() => setAuthenticated(true)} />;
  }

  return (
    <Layout
      screen={screen}
      onNavigate={setScreen}
      onLogout={() => setAuthenticated(false)}
    />
  );
}
