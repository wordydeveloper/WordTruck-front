import { ESTADOS } from "../services/types";

export { ESTADOS };

export interface EstadoConfig {
  bg: string;
  color: string;
  label: string;
}

/**
 * Estados reales sembrados en el backend (WordTruckContext.HasData):
 * 1 Registrado, 2 En bodega, 3 En ruta, 4 Entregado, 5 Cancelado.
 */
export const ESTADO_CONFIG: Record<number, EstadoConfig> = {
  [ESTADOS.REGISTRADO]: { bg: "#fefce8", color: "#ca8a04", label: "Registrado" },
  [ESTADOS.EN_BODEGA]: { bg: "#eff6ff", color: "#3b82f6", label: "En bodega" },
  [ESTADOS.EN_RUTA]: { bg: "#eff6ff", color: "#3b82f6", label: "En ruta" },
  [ESTADOS.ENTREGADO]: { bg: "#f0fdf4", color: "#16a34a", label: "Entregado" },
  [ESTADOS.CANCELADO]: { bg: "#fef2f2", color: "#dc2626", label: "Cancelado" },
};

export function estadoConfigFor(estadoActual: number): EstadoConfig {
  return ESTADO_CONFIG[estadoActual] ?? { bg: "#f1f5f9", color: "#64748b", label: "Desconocido" };
}

export const ESTADO_OPCIONES = [
  { id: ESTADOS.REGISTRADO, label: "Registrado" },
  { id: ESTADOS.EN_BODEGA, label: "En bodega" },
  { id: ESTADOS.EN_RUTA, label: "En ruta" },
  { id: ESTADOS.ENTREGADO, label: "Entregado" },
  { id: ESTADOS.CANCELADO, label: "Cancelado" },
];
