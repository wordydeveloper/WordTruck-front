import { useState } from "react";

interface Props {
  onLogin: () => void;
}

export default function Login({ onLogin }: Props) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !pass) { setError("Complete todos los campos."); return; }
    setLoading(true);
    setTimeout(() => {
      if (user === "admin" && pass === "admin123") {
        onLogin();
      } else {
        setError("Usuario o contraseña incorrectos.");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#0d1b2a" }}>
      {/* Left panel */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "60px", background: "linear-gradient(145deg, #0d1b2a 0%, #132338 100%)",
        borderRight: "1px solid #1e3a5f"
      }}>
        <div style={{ maxWidth: 480 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48 }}>
            <div style={{
              width: 44, height: 44, background: "#f59e0b", borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="#0d1b2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 9l-8 6-8-6" stroke="#0d1b2a" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div style={{ color: "#ffffff", fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em" }}>WordTrack</div>
              <div style={{ color: "#64748b", fontSize: 12 }}>Sistema de Gestión Logística</div>
            </div>
          </div>

          <h1 style={{ color: "#ffffff", fontSize: 36, fontWeight: 700, lineHeight: 1.15, marginBottom: 16, letterSpacing: "-0.03em" }}>
            Control total de tu<br />
            <span style={{ color: "#f59e0b" }}>cadena logística</span>
          </h1>
          <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.7, marginBottom: 40 }}>
            Gestión integral de paquetes, rutas, clientes y reportes en tiempo real para operaciones de paquetería y mensajería.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { icon: "📦", label: "Seguimiento en tiempo real de paquetes" },
              { icon: "🗺️", label: "Optimización de rutas de entrega" },
              { icon: "📊", label: "Reportes y analítica operacional" },
            ].map((f) => (
              <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 18 }}>{f.icon}</span>
                <span style={{ color: "#94a3b8", fontSize: 14 }}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        width: 480, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "60px 48px", background: "#f8fafc"
      }}>
        <div style={{ width: "100%" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 6, letterSpacing: "-0.02em" }}>
            Iniciar sesión
          </h2>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 32 }}>
            Ingrese sus credenciales para continuar
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>
                Usuario
              </label>
              <input
                type="text"
                value={user}
                onChange={e => { setUser(e.target.value); setError(""); }}
                placeholder="admin"
                style={{
                  width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0",
                  borderRadius: 8, fontSize: 14, outline: "none", background: "#fff",
                  color: "#0f172a", transition: "border-color 0.15s"
                }}
                onFocus={e => (e.target.style.borderColor = "#f59e0b")}
                onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>
                Contraseña
              </label>
              <input
                type="password"
                value={pass}
                onChange={e => { setPass(e.target.value); setError(""); }}
                placeholder="••••••••"
                style={{
                  width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0",
                  borderRadius: 8, fontSize: 14, outline: "none", background: "#fff",
                  color: "#0f172a", transition: "border-color 0.15s"
                }}
                onFocus={e => (e.target.style.borderColor = "#f59e0b")}
                onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
              />
            </div>

            {error && (
              <div style={{
                background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8,
                padding: "10px 14px", color: "#dc2626", fontSize: 13
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "12px", background: loading ? "#d97706" : "#f59e0b",
                color: "#0d1b2a", border: "none", borderRadius: 8, fontSize: 14,
                fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.01em", transition: "background 0.15s", marginTop: 4
              }}
            >
              {loading ? "Verificando..." : "Ingresar al sistema"}
            </button>
          </form>

          <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 32, textAlign: "center" }}>
            Demo: usuario <span style={{ fontFamily: "monospace", color: "#64748b" }}>admin</span> / contraseña <span style={{ fontFamily: "monospace", color: "#64748b" }}>admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
