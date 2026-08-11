import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, loading, error } = useAuth();
  const [correo, setCorreo] = useState('wordy848@gmail.com');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(correo, password);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-900 text-slate-100">
      {/* Panel Izquierdo: Branding WordTruck */}
      <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-between bg-[#0b132b] border-r border-slate-800">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-amber-500/20">
              W
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">WordTruck</h1>
              <p className="text-xs text-slate-400 font-medium">Sistema de Gestión Logística</p>
            </div>
          </div>

          <div className="max-w-md mt-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
              Control total de tu <span className="text-amber-500">cadena logística</span>
            </h2>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed">
              Paquetes, clientes, seguimiento, facturación y operación conectados directamente con tu API ASP.NET Core.
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500 mt-12">
          © {new Date().getFullYear()} WordTruck Logistics System.
        </div>
      </div>

      {/* Panel Derecho: Formulario de Inicio de Sesión */}
      <div className="md:w-1/2 bg-white text-slate-900 p-8 md:p-16 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Iniciar sesión</h2>
            <p className="text-sm text-slate-500 mt-1">
              Use un usuario registrado en WordTruck.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Correo</label>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="ejemplo@correo.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Ingresando...' : 'Ingresar al sistema'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}