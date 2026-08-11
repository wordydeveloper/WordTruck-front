/**
 * Tipos espejo de los DTOs expuestos por WordTruck.API (WordTruck.Business/Dtos).
 * Mantener sincronizados manualmente si el backend cambia sus contratos.
 */

// ---------- Usuarios ----------
export interface UsuarioDto {
  usuarioId: number;
  rolId: number;
  rolNombre: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string | null;
  estado: boolean;
  fechaRegistro: string;
}

export interface UsuarioCreateDto {
  rolId: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  password: string;
}

export interface UsuarioUpdateDto {
  rolId: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  estado: boolean;
}

export interface LoginDto {
  correo: string;
  password: string;
}

export interface LoginResponseDto {
  usuarioId: number;
  nombre: string;
  apellido: string;
  correo: string;
  rolNombre: string;
}

// Roles fijos sembrados en WordTruckContext (Rol.HasData)
export const ROLES = {
  ADMINISTRADOR: 1,
  CLIENTE: 2,
  REPARTIDOR: 3,
} as const;

// ---------- Clientes ----------
export interface ClienteDto {
  clienteId: number;
  usuarioId: number;
  nombre: string;
  apellido: string;
  correo: string;
  documento?: string | null;
  direccion?: string | null;
}

export interface ClienteCreateDto {
  usuarioId: number;
  documento?: string;
  direccion?: string;
}

export interface ClienteUpdateDto {
  documento?: string;
  direccion?: string;
}

// ---------- Paquetes ----------
export interface PaqueteDto {
  paqueteId: number;
  clienteId: number;
  tracking: string;
  peso: number;
  largo: number;
  ancho: number;
  alto: number;
  origen: string;
  destino: string;
  tarifa: number;
  estadoActual: number;
  estadoNombre: string;
  fechaRegistro: string;
}

export interface PaqueteCreateDto {
  clienteId: number;
  peso: number;
  largo: number;
  ancho: number;
  alto: number;
  origen: string;
  destino: string;
  tarifa: number;
}

export interface PaqueteUpdateDto {
  peso: number;
  largo: number;
  ancho: number;
  alto: number;
  origen: string;
  destino: string;
  tarifa: number;
}

export interface ActualizarEstadoDto {
  estadoId: number;
  usuarioId: number;
  observacion?: string;
}

// Estados fijos sembrados en WordTruckContext (Estado.HasData)
export const ESTADOS = {
  REGISTRADO: 1,
  EN_BODEGA: 2,
  EN_RUTA: 3,
  ENTREGADO: 4,
  CANCELADO: 5,
} as const;

// ---------- Facturas ----------
export interface FacturaDto {
  facturaId: number;
  paqueteId: number;
  tracking: string;
  fecha: string;
  total: number;
  metodoPago: string;
}

export interface FacturaCreateDto {
  paqueteId: number;
  total: number;
  metodoPago: string;
}

export interface FacturaUpdateDto {
  total: number;
  metodoPago: string;
}

// ---------- Repartidores ----------
export interface RepartidorDto {
  repartidorId: number;
  usuarioId: number;
  nombre: string;
  apellido: string;
  licencia?: string | null;
  vehiculo?: string | null;
}

export interface RepartidorCreateDto {
  usuarioId: number;
  licencia?: string;
  vehiculo?: string;
}

export interface RepartidorUpdateDto {
  licencia?: string;
  vehiculo?: string;
}

// ---------- Errores de la API ----------
export interface ApiErrorBody {
  mensaje?: string;
  detalle?: string;
  [key: string]: unknown;
}
