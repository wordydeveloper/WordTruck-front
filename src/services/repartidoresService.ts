import { http } from "./http";
import type { RepartidorCreateDto, RepartidorDto, RepartidorUpdateDto } from "./types";

export const repartidoresService = {
  getAll: () => http.get<RepartidorDto[]>("/api/repartidores"),
  getById: (id: number) => http.get<RepartidorDto>(`/api/repartidores/${id}`),
  create: (dto: RepartidorCreateDto) => http.post<RepartidorDto>("/api/repartidores", dto),
  update: (id: number, dto: RepartidorUpdateDto) => http.put<void>(`/api/repartidores/${id}`, dto),
  remove: (id: number) => http.delete<void>(`/api/repartidores/${id}`),
};
