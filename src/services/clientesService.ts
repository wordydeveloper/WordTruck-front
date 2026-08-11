import { http } from "./http";
import type { ClienteCreateDto, ClienteDto, ClienteUpdateDto, UsuarioCreateDto } from "./types";
import { ROLES } from "./types";
import { usuariosService } from "./usuariosService";

export const clientesService = {
  getAll: () => http.get<ClienteDto[]>("/api/clientes"),
  getById: (id: number) => http.get<ClienteDto>(`/api/clientes/${id}`),
  create: (dto: ClienteCreateDto) => http.post<ClienteDto>("/api/clientes", dto),
  update: (id: number, dto: ClienteUpdateDto) => http.put<void>(`/api/clientes/${id}`, dto),
  remove: (id: number) => http.delete<void>(`/api/clientes/${id}`),

  async createFull(input: {
    nombre: string;
    apellido: string;
    correo: string;
    telefono?: string;
    password: string;
    documento?: string;
    direccion?: string;
  }): Promise<ClienteDto> {
    const usuarioDto: UsuarioCreateDto = {
      rolId: ROLES.CLIENTE,
      nombre: input.nombre,
      apellido: input.apellido,
      correo: input.correo,
      telefono: input.telefono,
      password: input.password,
    };
    const usuario = await usuariosService.create(usuarioDto);

    const clienteDto: ClienteCreateDto = {
      usuarioId: usuario.usuarioId,
      documento: input.documento,
      direccion: input.direccion,
    };
    return clientesService.create(clienteDto);
  },
};