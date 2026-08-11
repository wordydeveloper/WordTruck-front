import React, { useEffect, useState } from 'react';
import { clientesService } from '../services/clientesService';
import { usuariosService } from '../services/usuariosService';
import type { ClienteDto, UsuarioDto } from '../services/types';

export default function Clients() {
  const [clientes, setClientes] = useState<ClienteDto[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Modo de creación: 'existente' (vincular a usuario existente) o 'nuevo' (crear usuario + cliente)
  const [mode, setMode] = useState<'existente' | 'nuevo'>('existente');

  // Campos Modo Existente
  const [usuarioId, setUsuarioId] = useState<string>('');
  const [documento, setDocumento] = useState<string>('');
  const [direccion, setDireccion] = useState<string>('');

  // Campos Modo Nuevo Usuario
  const [nombre, setNombre] = useState<string>('');
  const [apellido, setApellido] = useState<string>('');
  const [correo, setCorreo] = useState<string>('');
  const [telefono, setTelefono] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [clientesData, usuariosData] = await Promise.all([
        clientesService.getAll(),
        usuariosService.getAll(),
      ]);
      setClientes(clientesData || []);
      setUsuarios(usuariosData || []);
    } catch (err: any) {
      setError(err?.message || 'Error al conectar con la API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      if (mode === 'existente') {
        const numUsuarioId = parseInt(usuarioId, 10);
        if (isNaN(numUsuarioId) || numUsuarioId <= 0) {
          throw new Error('Seleccione un usuario válido de la lista.');
        }

        await clientesService.create({
          usuarioId: numUsuarioId,
          documento: documento.trim() || undefined,
          direccion: direccion.trim() || undefined,
        });
      } else {
        await clientesService.createFull({
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          correo: correo.trim(),
          telefono: telefono.trim() || undefined,
          password: password,
          documento: documento.trim() || undefined,
          direccion: direccion.trim() || undefined,
        });
      }

      setSuccessMsg('¡Cliente registrado correctamente en la base de datos!');
      
      // Limpiar formulario
      setUsuarioId('');
      setDocumento('');
      setDireccion('');
      setNombre('');
      setApellido('');
      setCorreo('');
      setTelefono('');
      setPassword('');

      loadData();
    } catch (err: any) {
      setError(err?.message || 'Ocurrió un error al registrar el cliente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clientes</h1>
          <p className="text-sm text-slate-500">Gestión de clientes y vinculación con la base de datos de WordTruck</p>
        </div>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all flex items-center gap-2"
        >
          ↻ Actualizar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabla de Clientes */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Clientes Registrados</h2>

          {loading ? (
            <p className="text-sm text-slate-500 py-4">Cargando datos desde la API ASP.NET Core...</p>
          ) : clientes.length === 0 ? (
            <p className="text-sm text-slate-400 py-4 text-center">No hay clientes registrados aún.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-2">ID</th>
                    <th className="py-3 px-2">Nombre y Apellido</th>
                    <th className="py-3 px-2">Correo</th>
                    <th className="py-3 px-2">Documento</th>
                    <th className="py-3 px-2">Dirección</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {clientes.map((item) => (
                    <tr key={item.clienteId} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-2 font-bold text-amber-600">#{item.clienteId}</td>
                      <td className="py-3 px-2 font-semibold text-slate-900">{item.nombre} {item.apellido}</td>
                      <td className="py-3 px-2 text-slate-500">{item.correo}</td>
                      <td className="py-3 px-2">{item.documento || '-'}</td>
                      <td className="py-3 px-2">{item.direccion || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Formulario de Registro */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Registrar Cliente</h2>
            <p className="text-xs text-slate-500">Selecciona el modo de registro</p>
          </div>

          {/* Selector de Modo */}
          <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => setMode('existente')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mode === 'existente' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Usuario Existente
            </button>
            <button
              type="button"
              onClick={() => setMode('nuevo')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mode === 'nuevo' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Nuevo Usuario
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-medium">
                {successMsg}
              </div>
            )}

            {mode === 'existente' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Seleccionar Usuario</label>
                <select
                  value={usuarioId}
                  onChange={(e) => setUsuarioId(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">-- Selecciona un usuario --</option>
                  {usuarios.map((u) => (
                    <option key={u.usuarioId} value={u.usuarioId}>
                      #{u.usuarioId} - {u.nombre} {u.apellido} ({u.correo})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                      placeholder="Ej: Carlos"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Apellido</label>
                    <input
                      type="text"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      required
                      placeholder="Ej: Gómez"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                    placeholder="carlos@gmail.com"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono</label>
                    <input
                      type="text"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="8091234567"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Contraseña</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Documento / Cédula</label>
              <input
                type="text"
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                placeholder="001-0000000-0"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Dirección</label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Calle, Sector, Ciudad"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 disabled:opacity-50 mt-2"
            >
              {submitting ? 'Procesando...' : 'Guardar Cliente'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}