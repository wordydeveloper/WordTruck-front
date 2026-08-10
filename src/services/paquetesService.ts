import { http } from "./http";
import type { ActualizarEstadoDto, PaqueteCreateDto, PaqueteDto, PaqueteUpdateDto } from "./types";

export const paquetesService = {
  getAll: () => http.get<PaqueteDto[]>("/api/paquetes"),
  getById: (id: number) => http.get<PaqueteDto>(`/api/paquetes/${id}`),
  getByCliente: (clienteId: number) => http.get<PaqueteDto[]>(`/api/paquetes/cliente/${clienteId}`),
  getByTracking: (tracking: string) =>
    http.get<PaqueteDto>(`/api/paquetes/tracking/${encodeURIComponent(tracking)}`),
  create: (dto: PaqueteCreateDto) => http.post<PaqueteDto>("/api/paquetes", dto),
  update: (id: number, dto: PaqueteUpdateDto) => http.put<void>(`/api/paquetes/${id}`, dto),
  remove: (id: number) => http.delete<void>(`/api/paquetes/${id}`),
  actualizarEstado: (id: number, dto: ActualizarEstadoDto) =>
    http.post<void>(`/api/paquetes/${id}/actualizar-estado`, dto),
};
