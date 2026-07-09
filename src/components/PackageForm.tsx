import { useState } from "react";

const inputStyle = (focused: boolean): React.CSSProperties => ({
  width: "100%", padding: "9px 12px", border: `1.5px solid ${focused ? "#f59e0b" : "#e2e8f0"}`,
  borderRadius: 8, fontSize: 13.5, outline: "none", background: "#fff",
  color: "#0f172a", fontFamily: "inherit", transition: "border-color 0.15s"
});

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 12, fontWeight: 600, color: "#374151",
  marginBottom: 5, letterSpacing: "0.01em"
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

export default function PackageForm() {
  const [focused, setFocused] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [trackingId] = useState("PKT-" + new Date().toISOString().slice(0, 10).replace(/-/g, "") + "-" + String(Math.floor(Math.random() * 900) + 100).padStart(3, "0"));

  const [form, setForm] = useState({
    remitente: "", remitenteTel: "", remitenteDir: "",
    destinatario: "", destinatarioTel: "", destinatarioDir: "",
    peso: "", alto: "", ancho: "", largo: "",
    tipo: "estándar", prioridad: "normal", descripcion: "", valorDeclarado: "",
    ruta: "", observaciones: ""
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const foc = (k: string) => ({ onFocus: () => setFocused(k), onBlur: () => setFocused(null) });

  if (submitted) {
    return (
      <div style={{
        maxWidth: 600, margin: "40px auto", background: "#fff", borderRadius: 16,
        padding: 48, border: "1px solid #e2e8f0", textAlign: "center"
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Paquete registrado</h2>
        <p style={{ color: "#64748b", marginBottom: 24 }}>El paquete ha sido ingresado al sistema exitosamente.</p>
        <div style={{
          background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10,
          padding: "16px 24px", marginBottom: 28, display: "inline-block"
        }}>
          <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>ID de seguimiento</div>
          <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", color: "#f59e0b" }}>{trackingId}</div>
        </div>
        <div>
          <button
            onClick={() => setSubmitted(false)}
            style={{
              padding: "10px 24px", background: "#f59e0b", border: "none",
              borderRadius: 8, fontSize: 14, fontWeight: 700, color: "#0d1b2a", cursor: "pointer"
            }}
          >
            Registrar otro paquete
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: "#94a3b8", fontFamily: "JetBrains Mono, monospace" }}>ID provisional: {trackingId}</div>
      </div>

      <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Remitente */}
        <div style={{ background: "#fff", borderRadius: 12, padding: "24px", border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 22, height: 22, background: "#fef3c7", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>📤</span>
            Datos del Remitente
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Nombre completo / Empresa *">
              <input style={inputStyle(focused === "remitente")} value={form.remitente} onChange={set("remitente")} {...foc("remitente")} placeholder="Ej. Distribuidora Morales S.A." required />
            </Field>
            <Field label="Teléfono de contacto *">
              <input style={inputStyle(focused === "remitenteTel")} value={form.remitenteTel} onChange={set("remitenteTel")} {...foc("remitenteTel")} placeholder="55 1234 5678" required />
            </Field>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Dirección de recolección *">
                <input style={inputStyle(focused === "remitenteDir")} value={form.remitenteDir} onChange={set("remitenteDir")} {...foc("remitenteDir")} placeholder="Calle, número, colonia, municipio, estado, CP" required />
              </Field>
            </div>
          </div>
        </div>

        {/* Destinatario */}
        <div style={{ background: "#fff", borderRadius: 12, padding: "24px", border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 22, height: 22, background: "#dbeafe", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>📥</span>
            Datos del Destinatario
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Nombre completo / Empresa *">
              <input style={inputStyle(focused === "destinatario")} value={form.destinatario} onChange={set("destinatario")} {...foc("destinatario")} placeholder="Ej. Farmacia El Sol" required />
            </Field>
            <Field label="Teléfono de contacto *">
              <input style={inputStyle(focused === "destinatarioTel")} value={form.destinatarioTel} onChange={set("destinatarioTel")} {...foc("destinatarioTel")} placeholder="81 9876 5432" required />
            </Field>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Dirección de entrega *">
                <input style={inputStyle(focused === "destinatarioDir")} value={form.destinatarioDir} onChange={set("destinatarioDir")} {...foc("destinatarioDir")} placeholder="Calle, número, colonia, municipio, estado, CP" required />
              </Field>
            </div>
          </div>
        </div>

        {/* Paquete */}
        <div style={{ background: "#fff", borderRadius: 12, padding: "24px", border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 22, height: 22, background: "#f3e8ff", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>📦</span>
            Características del Paquete
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            <Field label="Peso (kg) *">
              <input type="number" step="0.1" min="0.1" style={inputStyle(focused === "peso")} value={form.peso} onChange={set("peso")} {...foc("peso")} placeholder="2.5" required />
            </Field>
            <Field label="Alto (cm)">
              <input type="number" style={inputStyle(focused === "alto")} value={form.alto} onChange={set("alto")} {...foc("alto")} placeholder="30" />
            </Field>
            <Field label="Ancho (cm)">
              <input type="number" style={inputStyle(focused === "ancho")} value={form.ancho} onChange={set("ancho")} {...foc("ancho")} placeholder="20" />
            </Field>
            <Field label="Largo (cm)">
              <input type="number" style={inputStyle(focused === "largo")} value={form.largo} onChange={set("largo")} {...foc("largo")} placeholder="15" />
            </Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 16 }}>
            <Field label="Tipo de envío">
              <select style={{ ...inputStyle(focused === "tipo"), background: "#fff" }} value={form.tipo} onChange={set("tipo")} {...foc("tipo")}>
                <option value="estándar">Estándar</option>
                <option value="express">Express (24h)</option>
                <option value="sameday">Same Day</option>
                <option value="fragil">Frágil</option>
                <option value="refrigerado">Refrigerado</option>
              </select>
            </Field>
            <Field label="Prioridad">
              <select style={{ ...inputStyle(focused === "prioridad"), background: "#fff" }} value={form.prioridad} onChange={set("prioridad")} {...foc("prioridad")}>
                <option value="normal">Normal</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </Field>
            <Field label="Valor declarado (MXN)">
              <input type="number" style={inputStyle(focused === "valorDeclarado")} value={form.valorDeclarado} onChange={set("valorDeclarado")} {...foc("valorDeclarado")} placeholder="500.00" />
            </Field>
          </div>
          <div style={{ marginTop: 16 }}>
            <Field label="Descripción del contenido *">
              <textarea
                rows={2}
                style={{ ...inputStyle(focused === "descripcion"), resize: "vertical" }}
                value={form.descripcion} onChange={set("descripcion")} {...foc("descripcion")}
                placeholder="Describa brevemente el contenido del paquete"
                required
              />
            </Field>
          </div>
        </div>

        {/* Ruta y observaciones */}
        <div style={{ background: "#fff", borderRadius: 12, padding: "24px", border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 22, height: 22, background: "#dcfce7", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>🗺️</span>
            Asignación y Observaciones
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
            <Field label="Ruta asignada">
              <select style={{ ...inputStyle(focused === "ruta"), background: "#fff" }} value={form.ruta} onChange={set("ruta")} {...foc("ruta")}>
                <option value="">Sin asignar</option>
                <option value="R-01">R-01 · CDMX Norte</option>
                <option value="R-02">R-02 · CDMX Sur</option>
                <option value="R-03">R-03 · GDL Zona Metro</option>
                <option value="R-04">R-04 · MTY Centro</option>
                <option value="R-05">R-05 · PUE-TLX</option>
                <option value="R-06">R-06 · QRO-SLP</option>
              </select>
            </Field>
            <Field label="Observaciones especiales">
              <textarea
                rows={2}
                style={{ ...inputStyle(focused === "observaciones"), resize: "vertical" }}
                value={form.observaciones} onChange={set("observaciones")} {...foc("observaciones")}
                placeholder="Instrucciones especiales de manejo, acceso o entrega..."
              />
            </Field>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <button
            type="button"
            onClick={() => setForm({ remitente: "", remitenteTel: "", remitenteDir: "", destinatario: "", destinatarioTel: "", destinatarioDir: "", peso: "", alto: "", ancho: "", largo: "", tipo: "estándar", prioridad: "normal", descripcion: "", valorDeclarado: "", ruta: "", observaciones: "" })}
            style={{
              padding: "10px 24px", background: "#fff", border: "1.5px solid #e2e8f0",
              borderRadius: 8, fontSize: 13.5, fontWeight: 600, color: "#64748b", cursor: "pointer"
            }}
          >
            Limpiar formulario
          </button>
          <button
            type="submit"
            style={{
              padding: "10px 28px", background: "#f59e0b", border: "none",
              borderRadius: 8, fontSize: 13.5, fontWeight: 700, color: "#0d1b2a", cursor: "pointer"
            }}
          >
            Registrar paquete →
          </button>
        </div>
      </form>
    </div>
  );
}
