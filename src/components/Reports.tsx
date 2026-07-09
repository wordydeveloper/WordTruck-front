import { useState } from "react";

const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio"];
const deliveredData = [3820, 4150, 3980, 4600, 5100, 4890, 5420];
const transitData = [420, 380, 510, 460, 530, 490, 487];
const incidentData = [52, 48, 61, 44, 58, 63, 58];

const maxDelivered = Math.max(...deliveredData);

const topClients = [
  { name: "Distribuidora Morales S.A.", envios: 284, entregados: 271, tasa: "95.4%" },
  { name: "Farmacia El Sol", envios: 198, entregados: 193, tasa: "97.5%" },
  { name: "Electrónica Zenteno", envios: 175, entregados: 162, tasa: "92.6%" },
  { name: "Mueblería Confort", envios: 143, entregados: 138, tasa: "96.5%" },
  { name: "Clínica San Rafael", envios: 127, entregados: 125, tasa: "98.4%" },
];

const routePerf = [
  { ruta: "R-01", nombre: "CDMX Norte", paquetes: 1840, tiempo: "2.1 días", tasa: "96.2%" },
  { ruta: "R-02", nombre: "CDMX Sur", paquetes: 1620, tiempo: "1.9 días", tasa: "95.8%" },
  { ruta: "R-03", nombre: "GDL Zona Metro", paquetes: 980, tiempo: "2.8 días", tasa: "94.1%" },
  { ruta: "R-04", nombre: "MTY Centro", paquetes: 870, tiempo: "3.2 días", tasa: "93.7%" },
  { ruta: "R-05", nombre: "PUE-TLX", paquetes: 560, tiempo: "2.4 días", tasa: "96.8%" },
  { ruta: "R-06", nombre: "QRO-SLP", paquetes: 490, tiempo: "3.5 días", tasa: "92.4%" },
];

export default function Reports() {
  const [period, setPeriod] = useState("2024-07");
  const [tab, setTab] = useState<"resumen" | "clientes" | "rutas">("resumen");

  const tabs: { id: typeof tab; label: string }[] = [
    { id: "resumen", label: "Resumen General" },
    { id: "clientes", label: "Por Cliente" },
    { id: "rutas", label: "Por Ruta" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Controls */}
      <div style={{ background: "#fff", borderRadius: 12, padding: "18px 24px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 4 }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: "7px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13,
                fontWeight: 600,
                background: tab === t.id ? "#0d1b2a" : "transparent",
                color: tab === t.id ? "#fff" : "#64748b",
                transition: "all 0.15s"
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <input
            type="month" value={period} onChange={e => setPeriod(e.target.value)}
            style={{ padding: "7px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", color: "#374151" }}
          />
          <button style={{
            padding: "7px 16px", background: "#f59e0b", border: "none",
            borderRadius: 8, fontSize: 12, fontWeight: 700, color: "#0d1b2a", cursor: "pointer"
          }}>
            ↓ Exportar CSV
          </button>
        </div>
      </div>

      {tab === "resumen" && (
        <>
          {/* KPI Summary */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {[
              { label: "Total paquetes", val: "5,420", sub: "Julio 2024", color: "#3b82f6" },
              { label: "Entregados", val: "5,142", sub: "94.9% tasa", color: "#10b981" },
              { label: "Tiempo promedio", val: "2.4 días", sub: "–0.2 vs junio", color: "#f59e0b" },
              { label: "Incidencias", val: "58", sub: "1.07% del total", color: "#ef4444" },
            ].map(k => (
              <div key={k.label} style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500, marginBottom: 10 }}>{k.label}</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: k.color, fontFamily: "JetBrains Mono, monospace", letterSpacing: "-0.02em" }}>{k.val}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{k.sub}</div>
              </div>
            ))}
          </div>

          {/* Bar chart — monthly */}
          <div style={{ background: "#fff", borderRadius: 12, padding: "24px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Paquetes entregados — últimos 7 meses</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 24 }}>Volumen mensual acumulado</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 140 }}>
              {months.map((m, i) => (
                <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{ fontSize: 11, color: "#374151", fontFamily: "JetBrains Mono, monospace", fontWeight: 600 }}>
                    {(deliveredData[i] / 1000).toFixed(1)}k
                  </div>
                  <div
                    style={{
                      width: "100%", borderRadius: "4px 4px 0 0",
                      height: `${(deliveredData[i] / maxDelivered) * 110}px`,
                      background: i === 6 ? "#f59e0b" : i === months.length - 2 ? "#93c5fd" : "#e2e8f0",
                      transition: "background 0.15s"
                    }}
                  />
                  <span style={{ fontSize: 10, color: "#94a3b8" }}>{m.slice(0, 3)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Two small charts */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { title: "En tránsito por mes", data: transitData, color: "#3b82f6" },
              { title: "Incidencias por mes", data: incidentData, color: "#ef4444" },
            ].map(chart => {
              const mx = Math.max(...chart.data);
              return (
                <div key={chart.title} style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>{chart.title}</div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}>
                    {months.map((m, i) => (
                      <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{
                          width: "100%", borderRadius: "3px 3px 0 0",
                          height: `${(chart.data[i] / mx) * 64}px`,
                          background: i === 6 ? chart.color : chart.color + "44"
                        }} />
                        <span style={{ fontSize: 9, color: "#94a3b8" }}>{m.slice(0, 1)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === "clientes" && (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Top clientes por volumen</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>Rendimiento de entrega por cliente — {period}</div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["#", "Cliente", "Envíos", "Entregados", "Tasa de éxito", "Rendimiento"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#64748b", letterSpacing: "0.05em", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topClients.map((c, i) => {
                const pct = parseFloat(c.tasa);
                return (
                  <tr key={c.name} style={{ borderBottom: i < topClients.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: "#94a3b8", fontFamily: "JetBrains Mono, monospace" }}>{String(i + 1).padStart(2, "0")}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{c.name}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontFamily: "JetBrains Mono, monospace", color: "#374151" }}>{c.envios}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontFamily: "JetBrains Mono, monospace", color: "#374151" }}>{c.entregados}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: pct >= 96 ? "#10b981" : pct >= 93 ? "#f59e0b" : "#ef4444" }}>{c.tasa}</td>
                    <td style={{ padding: "12px 16px", width: 120 }}>
                      <div style={{ height: 6, background: "#f1f5f9", borderRadius: 99 }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: pct >= 96 ? "#10b981" : pct >= 93 ? "#f59e0b" : "#ef4444", borderRadius: 99 }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === "rutas" && (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Rendimiento por ruta</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>Volumen, tiempo y tasa de entrega — {period}</div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Ruta", "Nombre", "Paquetes", "Tiempo prom.", "Tasa entrega", "Rendimiento"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#64748b", letterSpacing: "0.05em", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {routePerf.map((r, i) => {
                const pct = parseFloat(r.tasa);
                return (
                  <tr key={r.ruta} style={{ borderBottom: i < routePerf.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, fontWeight: 700, background: "#fef3c7", color: "#b45309", padding: "3px 8px", borderRadius: 6 }}>{r.ruta}</span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500, color: "#0f172a" }}>{r.nombre}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontFamily: "JetBrains Mono, monospace", color: "#374151" }}>{r.paquetes.toLocaleString()}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontFamily: "JetBrains Mono, monospace", color: "#374151" }}>{r.tiempo}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: pct >= 96 ? "#10b981" : pct >= 93 ? "#f59e0b" : "#ef4444" }}>{r.tasa}</td>
                    <td style={{ padding: "12px 16px", width: 120 }}>
                      <div style={{ height: 6, background: "#f1f5f9", borderRadius: 99 }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: pct >= 96 ? "#10b981" : pct >= 93 ? "#f59e0b" : "#ef4444", borderRadius: 99 }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
