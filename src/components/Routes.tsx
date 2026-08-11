import React, { useEffect, useState } from 'react';
import { repartidoresService } from '../services/repartidoresService';
import type { RepartidorDto } from '../services/types';

export default function Routes() {
  const [repartidores, setRepartidores] = useState<RepartidorDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Campos Formulario Repartidor
  const [usuarioId, setUsuarioId] = useState<string>('');
  const [licencia, setLicencia] = useState<string>('');
  const [vehiculo, setVehiculo] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await repartidoresService.getAll();
      setRepartidores(data || []);
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

    const uId = parseInt(usuarioId, 10);
    if (isNaN(uId) || uId <= 0) {
      setError('Escriba un ID de usuario válido.');
      return;
    }

    setSubmitting(true);
    try {
      await repartidoresService.create({
        usuarioId: uId,
        licencia: licencia.trim() || undefined,
        vehiculo: vehiculo.trim() || undefined,
      });

      setSuccessMsg('¡Repartidor registrado correctamente!');
      setUsuarioId('');
      setLicencia('');
      setVehiculo('');
      loadData();
    } catch (err: any) {
      setError(err?.message || 'No se pudo crear el repartidor.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rutas de Entrega y Repartidores</h1>
          <p className="text-sm text-slate-500">Gestión de personal de entrega registrado en WordTruck</p>
        </div>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all"
        >
          ↻ Actualizar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabla de Repartidores */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Repartidores Activos</h2>

          {loading ? (
            <p className="text-sm text-slate-500 py-4">Cargando repartidores...</p>
          ) : repartidores.length === 0 ? (
            <p className="text-sm text-slate-400 py-4 text-center">No hay repartidores registrados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-2">ID</th>
                    <th className="py-3 px-2">Nombre y Apellido</th>
                    <th className="py-3 px-2">Usuario ID</th>
                    <th className="py-3 px-2">Licencia</th>
                    <th className="py-3 px-2">Vehículo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {repartidores.map((item) => (
                    <tr key={item.repartidorId} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-2 font-bold text-amber-600">#{item.repartidorId}</td>
                      <td className="py-3 px-2 font-semibold text-slate-900">{item.nombre} {item.apellido}</td>
                      <td className="py-3 px-2 text-slate-500">User #{item.usuarioId}</td>
                      <td className="py-3 px-2">{item.licencia || '-'}</td>
                      <td className="py-3 px-2 font-medium">{item.vehiculo || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Registro Repartidor */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Nuevo Repartidor</h2>
          <p className="text-xs text-slate-500 mb-4">Asignar rol de repartidor a un Usuario ID</p>

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

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Usuario ID (Número)</label>
              <input
                type="number"
                value={usuarioId}
                onChange={(e) => setUsuarioId(e.target.value)}
                placeholder="Ej: 3"
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Licencia de Conducir</label>
              <input
                type="text"
                value={licencia}
                onChange={(e) => setLicencia(e.target.value)}
                placeholder="Ej: 001-9999999-9"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Vehículo / Placa</label>
              <input
                type="text"
                value={vehiculo}
                onChange={(e) => setVehiculo(e.target.value)}
                placeholder="Ej: Motocicleta - Placa K01293"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
            >
              {submitting ? 'Procesando...' : 'Crear Repartidor'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}