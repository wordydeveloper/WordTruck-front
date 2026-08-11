import { http } from "./http";
import type { LoginDto, LoginResponseDto } from "./types";

export const authService = {
  login: (correo: string, password: string) => {
    const dto: LoginDto = { correo, password };
    return http.post<LoginResponseDto>("/api/usuarios/login", dto);
  },
};