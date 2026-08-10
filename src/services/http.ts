import type { ApiErrorBody } from "./types";

const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000"
).replace(/\/+$/, "");

const STORAGE_KEY = "wordtruck.session";

export class ApiError extends Error {
  status: number;
  body: ApiErrorBody | null;

  constructor(status: number, message: string, body: ApiErrorBody | null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export class NetworkError extends Error {
  constructor(message = "No se pudo conectar con el servidor. Verifique que el backend esté en ejecución.") {
    super(message);
    this.name = "NetworkError";
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  signal?: AbortSignal;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, signal } = options;

  const headers: Record<string, string> = {
    "Accept": "application/json",
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  // Inyectar Token Bearer si existe en localStorage
  try {
    const sessionRaw = localStorage.getItem(STORAGE_KEY);
    if (sessionRaw) {
      const session = JSON.parse(sessionRaw);
      if (session?.token) {
        headers["Authorization"] = `Bearer ${session.token}`;
      }
    }
  } catch {
    // Ignorar fallo de parseo de sesión
  }

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new NetworkError();
  }

  if (response.status === 204) {
    return undefined as T;
  }

  // Leer cuerpo como texto e intentar parsear JSON independientemente del Content-Type devuelto
  const text = await response.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const mensaje =
      (data as ApiErrorBody | null)?.mensaje ||
      (data as ApiErrorBody | null)?.detalle ||
      (data as { title?: string } | null)?.title ||
      `Error ${response.status} al comunicarse con ${path}`;
    throw new ApiError(response.status, mensaje, data as ApiErrorBody | null);
  }

  return data as T;
}

export const http = {
  get: <T>(path: string, signal?: AbortSignal) => request<T>(path, { method: "GET", signal }),
  post: <T>(path: string, body?: unknown, signal?: AbortSignal) => request<T>(path, { method: "POST", body, signal }),
  put: <T>(path: string, body?: unknown, signal?: AbortSignal) => request<T>(path, { method: "PUT", body, signal }),
  delete: <T>(path: string, signal?: AbortSignal) => request<T>(path, { method: "DELETE", signal }),
};

export { BASE_URL };