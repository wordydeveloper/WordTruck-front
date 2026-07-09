import { useState } from "react";

const allPackages = [
  { id: "PKT-20240709-001", cliente: "Distribuidora Morales S.A.", remitente: "Electrónica Zenteno", destino: "Av. Insurgentes 450, CDMX", origen: "Calzada Madero 88, MTY", estado: "En tránsito", fecha: "2024-07-09", hora: "08:42", peso: "2.3 kg", tipo: "Estándar", ruta: "R-01" },
  { id: "PKT-20240709-002", cliente: "Farmacia El Sol", remitente: "Laboratorios Vida", destino: "Blvd. Díaz Ordaz 120, GDL", origen: "Col. Industrial, CDMX", estado: "Entregado", fecha: "2024-07-09", hora: "09:15", peso: "0.8 kg", tipo: "Express", ruta: "R-03" },
  { id: "PKT-20240709-003", cliente: "Electrónica Zenteno", remitente: "Samsung México", destino: "Calzada Madero 88, MTY", origen: "Santa Fe, CDMX", estado: "Pendiente", fecha: "2024-07-09", hora: "09:31", peso: "5.1 kg", tipo: "Estándar", ruta: "R-04" },
  { id: "PKT-20240709-004", cliente: "Abarrotes La Paloma", remitente: "Cenagas Norte", destino: "Calle 5 de Mayo 22, PUE", origen: "Zona Industrial, GDL", estado: "En tránsito", fecha: "2024-07-09", hora: "10:05", peso: "12.4 kg", tipo: "Estándar", ruta: "R-05" },
  { id: "PKT-20240709-005", cliente: "Servicios Integrales MX", remitente: "TechMéxico S.A.", destino: "Col. Narvarte, CDMX", origen: "Polanco, CDMX", estado: "Incidencia", fecha: "2024-07-09", hora: "10:18", peso: "3.6 kg", tipo: "Frágil", ruta: "R-02" },
  { id: "PKT-20240709-006", cliente: "Librería Cultura", remitente: "Editorial Patria", destino: "Zona Centro, QRO", origen: "Tepito, CDMX", estado: "Entregado", fecha: "2024-07-08", hora: "10:47", peso: "1.2 kg", tipo: "Estándar", ruta: "R-06" },
  { id: "PKT-20240708-089", cliente: "Clínica San Rafael", remitente: "Medisuministros", destino: "Av. Juárez 300, MTY", origen: "Doctores, CDMX", estado: "Entregado", fecha: "2024-07-08", hora: "14:20", peso: "4.5 kg", tipo: "Refrigerado", ruta: "R-04" },
  { id: "PKT-20240708-090", cliente: "Mueblería Confort", remitente: "Fábrica Mexicana de Muebles", destino: "Insurgentes Sur 800, CDMX", origen: "Ecatepec, EdoMex", estado: "En tránsito", fecha: "2024-07-08", hora: "15:38", peso: "28.0 kg", tipo: "Estándar", ruta: "R-01" },
  { id: "PKT-20240707-211", cliente: "Taller Automotriz Rápido", remitente: "Refacciones del Norte", destino: "Blvd. Lázaro C. 44, SLP", origen: "Monterrey, NL", estado: "Entregado", fecha: "2024-07-07", hora: "11:05", peso: "7.2 kg", tipo: "Urgente", ruta: "R-06" },
];

const statusConfig: Record<string, { bg: string; color: string }> = {
  "En tránsito": { bg: "#eff6ff", color: "#3b82f6" },
  "Entregado": { bg: "#f0fdf4", color: "#16a34a" },
  "Pendiente": { bg: "#fefce8", color: "#ca8a04" },
  "Incidencia": { bg: "#fef2f2", color: "#dc2626" },
};

export default function Queries() {
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("Todos");
  const [fechaFilter, setFechaFilter] = useState("");
  const [selected, setSelected] = useState<typeof allPackages[0] | null>(null);

  const filtered = allPackages.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.id.toLowerCase().includes(q) || p.cliente.toLowerCase().includes(q) || p.destino.toLowerCase().includes(q) || p.remitente.toLowerCase().includes(q);
    const matchEstado = estadoFilter === "Todos" || p.estado === estadoFilter;
    const matchFecha = !fechaFilter || p.fecha === fechaFilter;
    return matchSearch && matchEstado && matchFecha;
  });

  return (
    <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Filters */}
        <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", border: "1px solid #e2e8f0", marginBottom: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 160px 160px", gap: 12 }}>
            <div style={{ position: "relative" }}>
              <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por ID, cliente, remitente o destino..."
                style={{
                  width: "100%", padding: "9px 12px 9px 36px", border: "1.5px solid #e2e8f0",
                  borderRadius: 8, fontSize: 13.5, outline: "none", color: "#0f172a"
                }}
              />
            </div>
            <select
              value={estadoFilter} onChange={e => setEstadoFilter(e.target.value)}
              style={{ padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13.5, outline: "none", color: "#374151", background: "#fff" }}
            >
              {["Todos", "En tránsito", "Entregado", "Pendiente", "Incidencia"].map(s => <option key={s}>{s}</option>)}
            </select>
            <input
              type="date" value={fechaFilter} onChange={e => setFechaFilter(e.target.value)}
              style={{ padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13.5, outline: "none", color: "#374151" }}
            />
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: "#94a3b8" }}>
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Table */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["ID Paquete", "Cliente / Destino", "Peso", "Tipo", "Ruta", "Fecha", "Estado", ""].map(h => (
                  <th key={h} style={{
                    padding: "10px 14px", textAlign: "left", fontSize: 11,
                    fontWeight: 600, color: "#64748b", letterSpacing: "0.05em",
                    textTransform: "uppercase", borderBottom: "1px solid #e2e8f0"
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>No se encontraron paquetes con los filtros seleccionados.</td></tr>
              ) : filtered.map((p, i) => {
                const cfg = statusConfig[p.estado];
                const isSelected = selected?.id === p.id;
                return (
                  <tr key={p.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f1f5f9" : "none", background: isSelected ? "#fffbeb" : "transparent" }}>
                    <td style={{ padding: "11px 14px", fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "#3b82f6", fontWeight: 500, whiteSpace: "nowrap" }}>{p.id}</td>
                    <td style={{ padding: "11px 14px" }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "#0f172a" }}>{p.cliente}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>{p.destino}</div>
                    </td>
                    <td style={{ padding: "11px 14px", fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: "#374151" }}>{p.peso}</td>
                    <td style={{ padding: "11px 14px", fontSize: 12, color: "#64748b" }}>{p.tipo}</td>
                    <td style={{ padding: "11px 14px", fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: "#374151" }}>{p.ruta}</td>
                    <td style={{ padding: "11px 14px", fontSize: 12, color: "#64748b", whiteSpace: "nowrap" }}>{p.fecha}</td>
                    <td style={{ padding: "11px 14px" }}>
                      <span style={{ background: cfg.bg, color: cfg.color, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{p.estado}</span>
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <button
                        onClick={() => setSelected(isSelected ? null : p)}
                        style={{
                          padding: "4px 10px", background: isSelected ? "#fef3c7" : "#f8fafc",
                          border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 11,
                          fontWeight: 600, color: "#374151", cursor: "pointer"
                        }}
                      >
                        {isSelected ? "Cerrar" : "Detalle"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div style={{ width: 300, flexShrink: 0, background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Detalle del paquete</div>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 16 }}>×</button>
          </div>

          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13, color: "#f59e0b", fontWeight: 700, marginBottom: 16, padding: "8px 12px", background: "#fffbeb", borderRadius: 8, border: "1px solid #fde68a" }}>
            {selected.id}
          </div>

          {[
            { label: "Estado", value: selected.estado },
            { label: "Tipo", value: selected.tipo },
            { label: "Ruta", value: selected.ruta },
            { label: "Peso", value: selected.peso },
            { label: "Fecha", value: `${selected.fecha} ${selected.hora}` },
          ].map(r => (
            <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
              <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>{r.label}</span>
              <span style={{ fontSize: 12, color: "#0f172a", fontWeight: 600, fontFamily: r.label === "Ruta" || r.label === "Fecha" || r.label === "Peso" ? "JetBrains Mono, monospace" : "inherit" }}>{r.value}</span>
            </div>
          ))}

          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Remitente</div>
            <div style={{ fontSize: 13, color: "#0f172a", fontWeight: 500 }}>{selected.remitente}</div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{selected.origen}</div>
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Destinatario</div>
            <div style={{ fontSize: 13, color: "#0f172a", fontWeight: 500 }}>{selected.cliente}</div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{selected.destino}</div>
          </div>
        </div>
      )}
    </div>
  );
}
