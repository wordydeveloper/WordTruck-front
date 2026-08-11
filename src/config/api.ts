const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  let body: unknown = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }

  if (!response.ok) {
    const value = body as { mensaje?: string; message?: string; title?: string } | null;
    throw new ApiError(
      value?.mensaje || value?.message || value?.title || `Error HTTP ${response.status}`,
      response.status
    );
  }

  return body as T;
}

const json = (method: string, data?: unknown): RequestInit => ({
  method,
  ...(data !== undefined ? { body: JSON.stringify(data) } : {})
});

export const api = {
  setToken: setAuthToken,
  login: (data: { correo: string; password: string }) => request<LoginResponse>('/api/usuarios/login', json('POST', data)),
  usuarios: {
    all: () => request<Usuario[]>('/api/usuarios'),
    get: (id: number) => request<Usuario>(`/api/usuarios/${id}`),
    create: (data: UsuarioCreate) => request<Usuario>('/api/usuarios', json('POST', data)),
    update: (id: number, data: UsuarioUpdate) => request<void>(`/api/usuarios/${id}`, json('PUT', data)),
    remove: (id: number) => request<void>(`/api/usuarios/${id}`, json('DELETE')),
  },
  clientes: {
    all: () => request<Cliente[]>('/api/clientes'),
    get: (id: number) => request<Cliente>(`/api/clientes/${id}`),
    create: (data: ClienteCreate) => request<Cliente>('/api/clientes', json('POST', data)),
    update: (id: number, data: ClienteUpdate) => request<void>(`/api/clientes/${id}`, json('PUT', data)),
    remove: (id: number) => request<void>(`/api/clientes/${id}`, json('DELETE')),
  },
  paquetes: {
    all: () => request<Paquete[]>('/api/paquetes'),
    get: (id: number) => request<Paquete>(`/api/paquetes/${id}`),
    tracking: (value: string) => request<Paquete>(`/api/paquetes/tracking/${encodeURIComponent(value)}`),
    byCliente: (id: number) => request<Paquete[]>(`/api/paquetes/cliente/${id}`),
    create: (data: PaqueteCreate) => request<Paquete>('/api/paquetes', json('POST', data)),
    update: (id: number, data: PaqueteUpdate) => request<void>(`/api/paquetes/${id}`, json('PUT', data)),
    remove: (id: number) => request<void>(`/api/paquetes/${id}`, json('DELETE')),
    estado: (id: number, data: ActualizarEstado) => request<void>(`/api/paquetes/${id}/actualizar-estado`, json('POST', data)),
  },
  repartidores: {
    all: () => request<Repartidor[]>('/api/repartidores'),
    get: (id: number) => request<Repartidor>(`/api/repartidores/${id}`),
    create: (data: RepartidorCreate) => request<Repartidor>('/api/repartidores', json('POST', data)),
    update: (id: number, data: RepartidorUpdate) => request<void>(`/api/repartidores/${id}`, json('PUT', data)),
    remove: (id: number) => request<void>(`/api/repartidores/${id}`, json('DELETE')),
  },
  facturas: {
    all: () => request<Factura[]>('/api/facturas'),
    get: (id: number) => request<Factura>(`/api/facturas/${id}`),
    create: (data: FacturaCreate) => request<Factura>('/api/facturas', json('POST', data)),
    update: (id: number, data: FacturaUpdate) => request<void>(`/api/facturas/${id}`, json('PUT', data)),
    remove: (id: number) => request<void>(`/api/facturas/${id}`, json('DELETE')),
  },
};

export interface Usuario { usuarioId: number; rolId: number; rolNombre: string; nombre: string; apellido: string; correo: string; telefono?: string; estado: boolean; fechaRegistro: string; }
export interface UsuarioCreate { rolId: number; nombre: string; apellido: string; correo: string; telefono?: string; password: string; }
export interface UsuarioUpdate { rolId: number; nombre: string; apellido: string; correo: string; telefono?: string; estado: boolean; }
export interface LoginResponse { usuarioId: number; nombre: string; apellido: string; correo: string; rolNombre: string; token?: string; }
export interface Cliente { clienteId: number; usuarioId: number; nombre: string; apellido: string; correo: string; documento?: string; direccion?: string; }
export interface ClienteCreate { usuarioId: number; documento?: string; direccion?: string; }
export interface ClienteUpdate { documento?: string; direccion?: string; }
export interface Paquete { paqueteId: number; clienteId: number; tracking: string; peso: number; largo: number; ancho: number; alto: number; origen: string; destino: string; tarifa: number; estadoActual: number; estadoNombre: string; fechaRegistro: string; }
export interface PaqueteCreate { clienteId: number; peso: number; largo: number; ancho: number; alto: number; origen: string; destino: string; tarifa: number; }
export type PaqueteUpdate = Omit<PaqueteCreate, 'clienteId'>;
export interface ActualizarEstado { estadoId: number; usuarioId: number; observacion?: string; }
export interface Repartidor { repartidorId: number; usuarioId: number; nombre: string; apellido: string; licencia?: string; vehiculo?: string; }
export interface RepartidorCreate { usuarioId: number; licencia?: string; vehiculo?: string; }
export interface RepartidorUpdate { licencia?: string; vehiculo?: string; }
export interface Factura { facturaId: number; paqueteId: number; tracking: string; fecha: string; total: number; metodoPago: string; }
export interface FacturaCreate { paqueteId: number; total: number; metodoPago: string; }
export interface FacturaUpdate { total: number; metodoPago: string; }