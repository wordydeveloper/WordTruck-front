import type { Screen } from "../App";
import Dashboard from "./Dashboard";
import PackageForm from "./PackageForm";
import Queries from "./Queries";
import Tracking from "./Tracking";
import Reports from "./Reports";
import Clients from "./Clients";
import Routes from "./Routes";

interface NavItem {
  id: Screen;
  label: string;
  icon: React.ReactNode;
  group?: string;
}

const navItems: NavItem[] = [
  {
    id: "dashboard", label: "Dashboard", group: "Principal",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
  },
  {
    id: "nuevo-paquete", label: "Nuevo Paquete", group: "Operaciones",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
  },
  {
    id: "consulta", label: "Consulta de Paquetes",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
  },
  {
    id: "seguimiento", label: "Seguimiento",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
  },
  {
    id: "clientes", label: "Clientes", group: "Administración",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
  },
  {
    id: "rutas", label: "Rutas de Entrega",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
  },
  {
    id: "reportes", label: "Reportes", group: "Análisis",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
  },
];

interface Props {
  screen: Screen;
  onNavigate: (s: Screen) => void;
  onLogout: () => void;
}

export default function Layout({ screen, onNavigate, onLogout }: Props) {
  const groups = ["Principal", "Operaciones", "Administración", "Análisis"];
  const grouped: Record<string, NavItem[]> = {};

  let currentGroup = "Principal";
  for (const item of navItems) {
    if (item.group) currentGroup = item.group;
    if (!item.group && currentGroup !== "Principal") {
      if (!grouped[currentGroup]) grouped[currentGroup] = [];
      grouped[currentGroup].push(item);
    } else {
      if (!grouped[currentGroup]) grouped[currentGroup] = [];
      grouped[currentGroup].push(item);
    }
  }

  const screenLabels: Record<Screen, string> = {
    dashboard: "Dashboard",
    "nuevo-paquete": "Nuevo Paquete",
    consulta: "Consulta de Paquetes",
    seguimiento: "Seguimiento",
    clientes: "Clientes",
    rutas: "Rutas de Entrega",
    reportes: "Reportes",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9" }}>
      {/* Sidebar */}
      <aside style={{
        width: 240, background: "#0d1b2a", display: "flex", flexDirection: "column",
        flexShrink: 0, position: "fixed", top: 0, left: 0, bottom: 0, overflowY: "auto"
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #1e3a5f" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, background: "#f59e0b", borderRadius: 7,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" fill="#0d1b2a"/>
              </svg>
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em" }}>WordTrack</div>
              <div style={{ color: "#475569", fontSize: 10, letterSpacing: "0.05em", textTransform: "uppercase" }}>Gestión Logística</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px" }}>
          {groups.map(group => {
            const items = grouped[group];
            if (!items || items.length === 0) return null;
            return (
              <div key={group} style={{ marginBottom: 24 }}>
                <div style={{
                  color: "#334155", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
                  textTransform: "uppercase", padding: "0 8px", marginBottom: 6
                }}>
                  {group}
                </div>
                {items.map(item => {
                  const active = screen === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 10,
                        padding: "9px 10px", borderRadius: 7, border: "none", cursor: "pointer",
                        background: active ? "rgba(245,158,11,0.12)" : "transparent",
                        color: active ? "#f59e0b" : "#94a3b8",
                        fontSize: 13.5, fontWeight: active ? 600 : 400,
                        textAlign: "left", transition: "all 0.15s", marginBottom: 2,
                        borderLeft: active ? "2px solid #f59e0b" : "2px solid transparent",
                      }}
                      onMouseEnter={e => { if (!active) (e.currentTarget.style.color = "#cbd5e1"); (e.currentTarget.style.background = "rgba(255,255,255,0.05)"); }}
                      onMouseLeave={e => { if (!active) { (e.currentTarget.style.color = "#94a3b8"); (e.currentTarget.style.background = "transparent"); } }}
                    >
                      <span style={{ opacity: active ? 1 : 0.7 }}>{item.icon}</span>
                      {item.label}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* User / logout */}
        <div style={{ padding: "16px 12px", borderTop: "1px solid #1e3a5f" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px" }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", background: "#1e3a5f",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#f59e0b", fontSize: 13, fontWeight: 700, flexShrink: 0
            }}>
              AD
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Administrador</div>
              <div style={{ color: "#475569", fontSize: 11 }}>admin@logitrack.com</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            style={{
              width: "100%", marginTop: 8, padding: "8px 10px", background: "transparent",
              border: "1px solid #1e3a5f", borderRadius: 7, color: "#64748b",
              fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center",
              gap: 8, transition: "all 0.15s"
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.style.color = "#ef4444"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e3a5f"; e.currentTarget.style.color = "#64748b"; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ marginLeft: 240, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Topbar */}
        <header style={{
          background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 28px",
          height: 56, display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 10
        }}>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 }}>
              {screenLabels[screen]}
            </h1>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>
              {new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              padding: "5px 12px", background: "#f0fdf4", border: "1px solid #86efac",
              borderRadius: 20, fontSize: 11, color: "#16a34a", fontWeight: 600,
              display: "flex", alignItems: "center", gap: 5
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
              Sistema operativo
            </div>
          </div>
        </header>

        {/* Screen content */}
        <main style={{ flex: 1, padding: "28px", overflowY: "auto" }}>
          {screen === "dashboard" && <Dashboard onNavigate={onNavigate} />}
          {screen === "nuevo-paquete" && <PackageForm />}
          {screen === "consulta" && <Queries />}
          {screen === "seguimiento" && <Tracking />}
          {screen === "clientes" && <Clients />}
          {screen === "rutas" && <Routes />}
          {screen === "reportes" && <Reports />}
        </main>
      </div>
    </div>
  );
}
