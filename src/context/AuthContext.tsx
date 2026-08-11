import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authService } from "../services/authService";
import { ApiError, NetworkError } from "../services/http";
import type { LoginResponseDto } from "../services/types";

const STORAGE_KEY = "wordtruck.session";

interface AuthContextValue {
  user: LoginResponseDto | null;
  loading: boolean;
  error: string;
  login: (correo: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoginResponseDto | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as LoginResponseDto) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (correo: string, password: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await authService.login(correo, password);
      setUser(response);
      return true;
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("Correo o contraseña incorrectos.");
      } else if (err instanceof NetworkError) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado al iniciar sesión.");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
