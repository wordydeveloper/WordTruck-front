import { useState } from "react";

const trackingData: Record<string, { cliente: string; destino: string; peso: string; tipo: string; ruta: string; eventos: { fecha: string; hora: string; lugar: string; descripcion: string; tipo: "ok" | "warn" | "active" }[] }> = {
  "PKT-20240709-001": {
    cliente: "Distribuidora Morales S.A.",
    destino: "Av. Insurgentes 450, CDMX",
    peso: "2.3 kg", tipo: "Estándar", ruta: "R-01",
    eventos: [
      { fecha: "2024-07-09", hora: "08:42", lugar: "Centro de Distribución MTY", descripcion: "Paquete recibido y registrado en sistema", tipo: "ok" },
      { fecha: "2024-07-09", hora: "09:10", lugar: "Centro de Distribución MTY", descripcion: "Clasificado y asignado a ruta R-01", tipo: "ok" },
      { fecha: "2024-07-09", hora: "10:30", lugar: "Terminal Aérea MTY", descripcion: "En tránsito hacia CDMX", tipo: "ok" },
      { fecha: "2024-07-09", hora: "13:15", lugar: "Aeropuerto CDMX", descripcion: "Llegó a hub de distribución CDMX", tipo: "ok" },
      { fecha: "2024-07-09", hora: "14:50", lugar: "Ruta R-01 Norte", descripcion: "Paquete en reparto con unidad V-112", tipo: "active" },
    ],
  },
  "PKT-20240709-005": {
    cliente: "Servicios Integrales MX",
    destino: "Col. Narvarte, CDMX",
    peso: "3.6 kg", tipo: "Frágil", ruta: "R-02",
    eventos: [
      { fecha: "2024-07-09", hora: "10:00", lugar: "Sucursal Polanco", descripcion: "Paquete recibido", tipo: "ok" },
      { fecha: "2024-07-09", hora: "10:18", lugar: "Hub CDMX Sur", descripcion: "En procesamiento", tipo: "ok" },
      { fecha: "2024-07-09", hora: "11:45", lugar: "Ruta R-02", descripcion: "Intento de entrega fallido — domicilio cerrado", tipo: "warn" },
    ],
  },
};

export default function Tracking() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<typeof trackingData[string] | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [searchedId, setSearchedId] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const id = query.trim().toUpperCase();
    setSearchedId(id);
    if (trackingData[id]) {
      setResult(trackingData[id]);
      setNotFound(false);
    } else {
      setResult(null);
      setNotFound(true);
    }
  };

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      {/* Search */}
      <div style={{ background: "#fff", borderRadius: 12, padding: "28px", border: "1px solid #e2e8f0", marginBottom: 24 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Rastrear paquete</h2>
        <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 20 }}>
          Ingrese el ID de seguimiento para ver el estado y recorrido del paquete. Pruebe: <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#f59e0b", fontSize: 12 }}>PKT-20240709-001</span>
        </p>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: 12 }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="PKT-YYYYMMDD-###"
            style={{
              flex: 1, padding: "11px 16px", border: "1.5px solid #e2e8f0", borderRadius: 8,
              fontSize: 14, fontFamily: "JetBrains Mono, monospace", outline: "none",
              letterSpacing: "0.05em", color: "#0f172a"
            }}
          />
          <button
            type="submit"
            style={{
              padding: "11px 28px", background: "#f59e0b", border: "none",
              borderRadius: 8, fontSize: 14, fontWeight: 700, color: "#0d1b2a", cursor: "pointer"
            }}
          >
            Rastrear
          </button>
        </form>
      </div>

      {/* Not found */}
      {notFound && (
        <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 12, padding: "24px", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
          <div style={{ fontWeight: 700, color: "#dc2626", marginBottom: 4 }}>Paquete no encontrado</div>
          <div style={{ color: "#64748b", fontSize: 13 }}>
            No se encontró ningún paquete con el ID <span style={{ fontFamily: "JetBrains Mono, monospace" }}>{searchedId}</span>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div>
          {/* Package header */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "24px", marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13, color: "#f59e0b", fontWeight: 700, marginBottom: 6 }}>{searchedId}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>{result.cliente}</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>{result.destino}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                {[
                  { label: "Peso", val: result.peso },
                  { label: "Tipo", val: result.tipo },
                  { label: "Ruta", val: result.ruta },
                ].map(r => (
                  <div key={r.label} style={{ marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>{r.label}: </span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", fontFamily: "JetBrains Mono, monospace" }}>{r.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "24px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 24 }}>Historial de seguimiento</div>
            <div style={{ position: "relative" }}>
              {/* Vertical line */}
              <div style={{ position: "absolute", left: 15, top: 12, bottom: 12, width: 2, background: "#e2e8f0" }} />

              {[...result.eventos].reverse().map((ev, i) => {
                const dotColor = ev.tipo === "active" ? "#f59e0b" : ev.tipo === "warn" ? "#ef4444" : "#10b981";
                return (
                  <div key={i} style={{ display: "flex", gap: 20, marginBottom: i < result.eventos.length - 1 ? 24 : 0, position: "relative" }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%", background: dotColor + "18",
                      border: `2px solid ${dotColor}`, display: "flex", alignItems: "center",
                      justifyContent: "center", flexShrink: 0, zIndex: 1,
                      boxShadow: ev.tipo === "active" ? `0 0 0 4px ${dotColor}22` : "none"
                    }}>
                      {ev.tipo === "active" && <div style={{ width: 8, height: 8, borderRadius: "50%", background: dotColor }} />}
                      {ev.tipo === "warn" && <span style={{ fontSize: 12 }}>⚠</span>}
                      {ev.tipo === "ok" && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={dotColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                    <div style={{ flex: 1, paddingBottom: 4 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: "#0f172a" }}>{ev.descripcion}</div>
                        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap", marginLeft: 16 }}>
                          {ev.fecha} {ev.hora}
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>📍 {ev.lugar}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
