import { http } from "./http";
import type { FacturaCreateDto, FacturaDto, FacturaUpdateDto } from "./types";

export const facturasService = {
  getAll: () => http.get<FacturaDto[]>("/api/facturas"),
  getById: (id: number) => http.get<FacturaDto>(`/api/facturas/${id}`),
  create: (dto: FacturaCreateDto) => http.post<FacturaDto>("/api/facturas", dto),
  update: (id: number, dto: FacturaUpdateDto) => http.put<void>(`/api/facturas/${id}`, dto),
  remove: (id: number) => http.delete<void>(`/api/facturas/${id}`),
};
