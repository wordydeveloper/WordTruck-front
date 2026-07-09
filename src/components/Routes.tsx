import { useState } from "react";

const routes = [
  { id: "R-01", nombre: "CDMX Norte", unidades: 8, conductores: 8, paquetesHoy: 312, entregados: 298, pendientes: 14, km: 240, status: "Activo", zonas: ["Gustavo A. Madero", "Azcapotzalco", "Tlalnepantla"] },
  { id: "R-02", nombre: "CDMX Sur", unidades: 6, conductores: 6, paquetesHoy: 274, entregados: 261, pendientes: 13, km: 195, status: "Activo", zonas: ["Benito Juárez", "Coyoacán", "Xochimilco"] },
  { id: "R-03", nombre: "GDL Zona Metro", unidades: 5, conductores: 5, paquetesHoy: 188, entregados: 172, pendientes: 16, km: 310, status: "Activo", zonas: ["Guadalajara", "Zapopan", "Tlaquepaque"] },
  { id: "R-04", nombre: "MTY Centro", unidades: 4, conductores: 4, paquetesHoy: 156, entregados: 140, pendientes: 16, km: 420, status: "Activo", zonas: ["Monterrey", "San Pedro", "Garza García"] },
  { id: "R-05", nombre: "PUE-TLX", unidades: 3, conductores: 3, paquetesHoy: 98, entregados: 94, pendientes: 4, km: 180, status: "Activo", zonas: ["Puebla Centro", "Tlaxcala", "Cholula"] },
  { id: "R-06", nombre: "QRO-SLP", unidades: 3, conductores: 3, paquetesHoy: 72, entregados: 65, pendientes: 7, km: 520, status: "Mantenimiento", zonas: ["Querétaro", "San Luis Potosí", "Celaya"] },
];

const units = [
  { placa: "QRO-2145-B", modelo: "Nissan Urvan 2022", ruta: "R-01", conductor: "Óscar Ramírez G.", km: "142,800", status: "En ruta" },
  { placa: "CDMX-9832-A", modelo: "Sprinter 316 2021", ruta: "R-02", conductor: "Lupita Méndez V.", km: "98,400", status: "En ruta" },
  { placa: "NL-4421-C", modelo: "Transit 350 2023", ruta: "R-04", conductor: "Juan Cortés H.", km: "45,200", status: "En base" },
  { placa: "JAL-7712-D", modelo: "Nissan Urvan 2020", ruta: "R-03", conductor: "Ana Flores R.", km: "188,300", status: "Mantenimiento" },
  { placa: "PUE-3356-B", modelo: "Sprinter 311 2022", ruta: "R-05", conductor: "Pedro Ibáñez L.", km: "76,100", status: "En ruta" },
];

const statusUnitColor: Record<string, { bg: string; color: string }> = {
  "En ruta": { bg: "#eff6ff", color: "#3b82f6" },
  "En base": { bg: "#f0fdf4", color: "#16a34a" },
  "Mantenimiento": { bg: "#fef2f2", color: "#dc2626" },
};

export default function Routes() {
  const [view, setView] = useState<"rutas" | "unidades">("rutas");
  const [selected, setSelected] = useState<typeof routes[0] | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Toggle */}
      <div style={{ background: "#fff", borderRadius: 12, padding: "16px 24px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 4 }}>
          {(["rutas", "unidades"] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: "7px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
              background: view === v ? "#0d1b2a" : "transparent",
              color: view === v ? "#fff" : "#64748b",
            }}>
              {v === "rutas" ? "🗺️ Rutas" : "🚚 Unidades"}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 12, color: "#94a3b8" }}>{routes.length} rutas · {units.length} unidades registradas</div>
      </div>

      {view === "rutas" && (
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, flex: 1 }}>
            {routes.map(r => {
              const pct = Math.round((r.entregados / r.paquetesHoy) * 100);
              const isActive = selected?.id === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelected(isActive ? null : r)}
                  style={{
                    background: "#fff", borderRadius: 12, padding: "20px",
                    border: `1.5px solid ${isActive ? "#f59e0b" : "#e2e8f0"}`,
                    cursor: "pointer", transition: "border-color 0.15s",
                    boxShadow: isActive ? "0 0 0 3px #fef3c7" : "none"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, fontWeight: 700, background: "#fef3c7", color: "#b45309", padding: "3px 10px", borderRadius: 6 }}>{r.id}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: r.status === "Activo" ? "#f0fdf4" : "#fef2f2", color: r.status === "Activo" ? "#16a34a" : "#dc2626" }}>{r.status}</span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>{r.nombre}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 16 }}>{r.zonas.join(" · ")}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                    {[
                      { l: "Unidades", v: r.unidades },
                      { l: "Paquetes", v: r.paquetesHoy },
                      { l: "Entregados", v: r.entregados },
                      { l: "Pendientes", v: r.pendientes },
                    ].map(s => (
                      <div key={s.l}>
                        <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.l}</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", fontFamily: "JetBrains Mono, monospace" }}>{s.v}</div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748b", marginBottom: 4 }}>
                      <span>Progreso de entrega</span>
                      <span style={{ fontWeight: 700, color: pct >= 90 ? "#10b981" : "#f59e0b" }}>{pct}%</span>
                    </div>
                    <div style={{ height: 5, background: "#f1f5f9", borderRadius: 99 }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: pct >= 90 ? "#10b981" : "#f59e0b", borderRadius: 99 }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {selected && (
            <div style={{ width: 260, flexShrink: 0, background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Detalle de ruta</div>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 16 }}>×</button>
              </div>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13, color: "#f59e0b", fontWeight: 700, marginBottom: 8 }}>{selected.id}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>{selected.nombre}</div>
              {[
                { l: "Kilómetros cubiertos", v: `${selected.km} km` },
                { l: "Unidades asignadas", v: String(selected.unidades) },
                { l: "Conductores", v: String(selected.conductores) },
                { l: "KM por unidad", v: `~${Math.round(selected.km / selected.unidades)} km` },
              ].map(r => (
                <div key={r.l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>{r.l}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", color: "#0f172a" }}>{r.v}</span>
                </div>
              ))}
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8, fontWeight: 600 }}>Zonas cubiertas</div>
                {selected.zonas.map(z => (
                  <div key={z} style={{ fontSize: 12, color: "#374151", padding: "4px 0", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
                    {z}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {view === "unidades" && (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Placa", "Modelo", "Ruta", "Conductor", "Kilometraje", "Estado"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#64748b", letterSpacing: "0.05em", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {units.map((u, i) => {
                const sc = statusUnitColor[u.status];
                return (
                  <tr key={u.placa} style={{ borderBottom: i < units.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                    <td style={{ padding: "12px 16px", fontFamily: "JetBrains Mono, monospace", fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{u.placa}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#374151" }}>{u.modelo}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, fontWeight: 700, background: "#fef3c7", color: "#b45309", padding: "3px 8px", borderRadius: 6 }}>{u.ruta}</span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#0f172a", fontWeight: 500 }}>{u.conductor}</td>
                    <td style={{ padding: "12px 16px", fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "#64748b" }}>{u.km} km</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ background: sc.bg, color: sc.color, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{u.status}</span>
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
