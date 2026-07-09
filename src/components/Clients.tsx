import { useState } from "react";

const clients = [
  { id: "CLT-001", nombre: "Distribuidora Morales S.A.", contacto: "Ing. Roberto Morales", email: "r.morales@distmorales.com.mx", tel: "55 4821 0033", tipo: "Corporativo", status: "Activo", envios: 284, saldo: "$12,480.00" },
  { id: "CLT-002", nombre: "Farmacia El Sol", contacto: "Lic. Carmen Vega", email: "cvega@farmaciasol.mx", tel: "33 9812 4455", tipo: "PYME", status: "Activo", envios: 198, saldo: "$4,320.00" },
  { id: "CLT-003", nombre: "Electrónica Zenteno", contacto: "Sr. Marco Zenteno", email: "m.zenteno@ezenteno.com", tel: "81 3344 5566", tipo: "PYME", status: "Activo", envios: 175, saldo: "$7,850.00" },
  { id: "CLT-004", nombre: "Mueblería Confort", contacto: "Sra. Patricia Leal", email: "pleal@mueblesconfort.mx", tel: "55 7890 1122", tipo: "PYME", status: "Suspendido", envios: 143, saldo: "$0.00" },
  { id: "CLT-005", nombre: "Clínica San Rafael", contacto: "Dr. Alejandro Ruiz", email: "admin@clinicasanrafael.mx", tel: "81 2233 9900", tipo: "Corporativo", status: "Activo", envios: 127, saldo: "$9,110.00" },
  { id: "CLT-006", nombre: "Librería Cultura", contacto: "Sra. Fabiola Torres", email: "ftorres@libreriacultura.mx", tel: "44 2211 3345", tipo: "Particular", status: "Activo", envios: 89, saldo: "$1,240.00" },
  { id: "CLT-007", nombre: "Taller Automotriz Rápido", contacto: "Sr. Ernesto Campos", email: "ernesto@tallerrapido.mx", tel: "46 5543 2211", tipo: "Particular", status: "Activo", envios: 54, saldo: "$2,370.00" },
];

export default function Clients() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof clients[0] | null>(null);

  const filtered = clients.filter(c => {
    const q = search.toLowerCase();
    return !q || c.nombre.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.contacto.toLowerCase().includes(q);
  });

  return (
    <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Top bar */}
        <div style={{ background: "#fff", borderRadius: 12, padding: "18px 24px", border: "1px solid #e2e8f0", marginBottom: 20, display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cliente por nombre, ID o contacto..." style={{ width: "100%", padding: "9px 12px 9px 34px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13.5, outline: "none", color: "#0f172a" }} />
          </div>
          <button style={{ padding: "9px 20px", background: "#f59e0b", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, color: "#0d1b2a", cursor: "pointer", whiteSpace: "nowrap" }}>
            + Nuevo cliente
          </button>
        </div>

        {/* Table */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["ID", "Cliente / Contacto", "Tipo", "Envíos", "Saldo", "Estado", ""].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#64748b", letterSpacing: "0.05em", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f1f5f9" : "none", background: selected?.id === c.id ? "#fffbeb" : "transparent" }}>
                  <td style={{ padding: "11px 14px", fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#64748b" }}>{c.id}</td>
                  <td style={{ padding: "11px 14px" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{c.nombre}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{c.contacto}</div>
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    <span style={{
                      padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                      background: c.tipo === "Corporativo" ? "#eff6ff" : c.tipo === "PYME" ? "#f3e8ff" : "#f0fdf4",
                      color: c.tipo === "Corporativo" ? "#3b82f6" : c.tipo === "PYME" ? "#9333ea" : "#16a34a"
                    }}>{c.tipo}</span>
                  </td>
                  <td style={{ padding: "11px 14px", fontSize: 13, fontFamily: "JetBrains Mono, monospace", color: "#374151" }}>{c.envios}</td>
                  <td style={{ padding: "11px 14px", fontSize: 13, fontFamily: "JetBrains Mono, monospace", fontWeight: 600, color: "#0f172a" }}>{c.saldo}</td>
                  <td style={{ padding: "11px 14px" }}>
                    <span style={{
                      padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                      background: c.status === "Activo" ? "#f0fdf4" : "#fef2f2",
                      color: c.status === "Activo" ? "#16a34a" : "#dc2626"
                    }}>{c.status}</span>
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    <button onClick={() => setSelected(selected?.id === c.id ? null : c)} style={{ padding: "4px 10px", background: selected?.id === c.id ? "#fef3c7" : "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 11, fontWeight: 600, color: "#374151", cursor: "pointer" }}>
                      {selected?.id === c.id ? "Cerrar" : "Ver"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail */}
      {selected && (
        <div style={{ width: 280, flexShrink: 0, background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Ficha del cliente</div>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 16 }}>×</button>
          </div>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 16 }}>🏢</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>{selected.nombre}</div>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 20 }}>{selected.id}</div>
          {[
            { label: "Contacto", val: selected.contacto },
            { label: "Email", val: selected.email },
            { label: "Teléfono", val: selected.tel },
            { label: "Tipo", val: selected.tipo },
            { label: "Envíos totales", val: String(selected.envios) },
            { label: "Saldo pendiente", val: selected.saldo },
          ].map(r => (
            <div key={r.label} style={{ display: "flex", flexDirection: "column", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
              <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{r.label}</span>
              <span style={{ fontSize: 12, color: "#0f172a", fontWeight: 500, marginTop: 2 }}>{r.val}</span>
            </div>
          ))}
          <button style={{ width: "100%", marginTop: 20, padding: "9px", background: "#0d1b2a", border: "none", borderRadius: 8, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            Editar cliente
          </button>
        </div>
      )}
    </div>
  );
}
