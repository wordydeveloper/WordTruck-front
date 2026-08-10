import { http } from "./http";
import type { UsuarioCreateDto, UsuarioDto, UsuarioUpdateDto } from "./types";

export const usuariosService = {
  getAll: () => http.get<UsuarioDto[]>("/api/usuarios"),
  getById: (id: number) => http.get<UsuarioDto>(`/api/usuarios/${id}`),
  create: (dto: UsuarioCreateDto) => http.post<UsuarioDto>("/api/usuarios", dto),
  update: (id: number, dto: UsuarioUpdateDto) => http.put<void>(`/api/usuarios/${id}`, dto),
  remove: (id: number) => http.delete<void>(`/api/usuarios/${id}`),
};
