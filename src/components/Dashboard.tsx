import type { Screen } from "../App";

const kpis = [
  { label: "Paquetes Hoy", value: "1,284", delta: "+8.2%", color: "#3b82f6", icon: "📦" },
  { label: "En Tránsito", value: "487", delta: "+3.1%", color: "#f59e0b", icon: "🚚" },
  { label: "Entregados", value: "739", delta: "+12.4%", color: "#10b981", icon: "✅" },
  { label: "Con Incidencia", value: "58", delta: "-4.7%", color: "#ef4444", icon: "⚠️" },
];

const recentPackages = [
  { id: "PKT-20240709-001", cliente: "Distribuidora Morales S.A.", destino: "Av. Insurgentes 450, CDMX", estado: "En tránsito", hora: "08:42", peso: "2.3 kg" },
  { id: "PKT-20240709-002", cliente: "Farmacia El Sol", destino: "Blvd. Díaz Ordaz 120, GDL", estado: "Entregado", hora: "09:15", peso: "0.8 kg" },
  { id: "PKT-20240709-003", cliente: "Electrónica Zenteno", destino: "Calzada Madero 88, MTY", estado: "Pendiente", hora: "09:31", peso: "5.1 kg" },
  { id: "PKT-20240709-004", cliente: "Abarrotes La Paloma", destino: "Calle 5 de Mayo 22, PUE", estado: "En tránsito", hora: "10:05", peso: "12.4 kg" },
  { id: "PKT-20240709-005", cliente: "Servicios Integrales MX", destino: "Col. Narvarte, CDMX", estado: "Incidencia", hora: "10:18", peso: "3.6 kg" },
  { id: "PKT-20240709-006", cliente: "Librería Cultura", destino: "Zona Centro, QRO", estado: "Entregado", hora: "10:47", peso: "1.2 kg" },
];

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  "En tránsito": { bg: "#eff6ff", color: "#3b82f6", label: "En tránsito" },
  "Entregado": { bg: "#f0fdf4", color: "#16a34a", label: "Entregado" },
  "Pendiente": { bg: "#fefce8", color: "#ca8a04", label: "Pendiente" },
  "Incidencia": { bg: "#fef2f2", color: "#dc2626", label: "Incidencia" },
};

const activityData = [
  { hour: "06h", count: 42 },
  { hour: "07h", count: 87 },
  { hour: "08h", count: 156 },
  { hour: "09h", count: 214 },
  { hour: "10h", count: 198 },
  { hour: "11h", count: 176 },
  { hour: "12h", count: 134 },
  { hour: "13h", count: 88 },
  { hour: "14h", count: 143 },
  { hour: "15h", count: 189 },
  { hour: "16h", count: 167 },
  { hour: "17h", count: 95 },
];

const maxCount = Math.max(...activityData.map(d => d.count));

export default function Dashboard({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {kpis.map(k => (
          <div key={k.label} style={{
            background: "#fff", borderRadius: 12, padding: "20px 24px",
            border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: 12
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: k.color + "18", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18
              }}>
                {k.icon}
              </div>
              <span style={{
                fontSize: 11, fontWeight: 600, color: k.delta.startsWith("+") ? "#16a34a" : "#dc2626",
                background: k.delta.startsWith("+") ? "#f0fdf4" : "#fef2f2",
                padding: "2px 8px", borderRadius: 20
              }}>
                {k.delta}
              </span>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.03em", fontFamily: "JetBrains Mono, monospace" }}>
                {k.value}
              </div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Middle row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16 }}>
        {/* Activity chart */}
        <div style={{ background: "#fff", borderRadius: 12, padding: "24px", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Actividad del día</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>Paquetes procesados por hora — Hoy</div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#f59e0b", fontFamily: "JetBrains Mono, monospace" }}>1,284</div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 100 }}>
            {activityData.map((d, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div
                  style={{
                    width: "100%", borderRadius: 4,
                    height: `${(d.count / maxCount) * 80}px`,
                    background: i === 9 ? "#f59e0b" : "#e2e8f0",
                    transition: "background 0.15s",
                    cursor: "default",
                  }}
                  title={`${d.hour}: ${d.count} paquetes`}
                />
                <span style={{ fontSize: 9, color: "#94a3b8", fontFamily: "JetBrains Mono, monospace" }}>{d.hour}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status breakdown */}
        <div style={{ background: "#fff", borderRadius: 12, padding: "24px", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Distribución</div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 20 }}>Estado de paquetes activos</div>
          {[
            { label: "Entregados", pct: 57.6, color: "#10b981", val: 739 },
            { label: "En tránsito", pct: 37.9, color: "#3b82f6", val: 487 },
            { label: "Pendientes", pct: 3.0, color: "#f59e0b", val: 39 },
            { label: "Incidencias", pct: 4.5, color: "#ef4444", val: 58 },
          ].map(s => (
            <div key={s.label} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{s.label}</span>
                <span style={{ fontSize: 12, color: "#64748b", fontFamily: "JetBrains Mono, monospace" }}>{s.val.toLocaleString()} · {s.pct}%</span>
              </div>
              <div style={{ height: 6, background: "#f1f5f9", borderRadius: 99 }}>
                <div style={{ height: "100%", width: `${s.pct}%`, background: s.color, borderRadius: 99 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent packages table */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Paquetes recientes</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>Últimos movimientos del día</div>
          </div>
          <button
            onClick={() => onNavigate("consulta")}
            style={{
              padding: "7px 16px", background: "#f8fafc", border: "1px solid #e2e8f0",
              borderRadius: 8, fontSize: 12, fontWeight: 600, color: "#374151", cursor: "pointer"
            }}
          >
            Ver todos →
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["ID Paquete", "Cliente", "Destino", "Peso", "Hora", "Estado"].map(h => (
                <th key={h} style={{
                  padding: "10px 16px", textAlign: "left", fontSize: 11,
                  fontWeight: 600, color: "#64748b", letterSpacing: "0.05em",
                  textTransform: "uppercase", borderBottom: "1px solid #e2e8f0"
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentPackages.map((p, i) => {
              const cfg = statusConfig[p.estado];
              return (
                <tr key={p.id} style={{ borderBottom: i < recentPackages.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                  <td style={{ padding: "12px 16px", fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "#3b82f6", fontWeight: 500 }}>{p.id}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#0f172a", fontWeight: 500 }}>{p.cliente}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#64748b", maxWidth: 200 }}>{p.destino}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#374151", fontFamily: "JetBrains Mono, monospace" }}>{p.peso}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#64748b", fontFamily: "JetBrains Mono, monospace" }}>{p.hora}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      background: cfg.bg, color: cfg.color,
                      padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600
                    }}>
                      {cfg.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
