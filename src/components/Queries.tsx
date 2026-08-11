import React, { useEffect, useState } from 'react';
import { paquetesService } from '../services/paquetesService';
import { useAuth } from '../context/AuthContext';
import type { PaqueteDto } from '../services/types';
import { ESTADOS } from '../services/types';

export default function Queries() {
  const { user } = useAuth();
  const [paquetes, setPaquetes] = useState<PaqueteDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  
  const [selectedPaquete, setSelectedPaquete] = useState<PaqueteDto | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadPaquetes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await paquetesService.getAll();
      setPaquetes(data || []);

      if (selectedPaquete) {
        const updated = data?.find((p) => p.paqueteId === selectedPaquete.paqueteId);
        if (updated) setSelectedPaquete(updated);
      }
    } catch (err: any) {
      setError(err?.message || 'Error al cargar paquetes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPaquetes();
  }, []);

  const handleEstadoChange = async (paqueteId: number, nuevoEstadoId: number) => {
    setUpdatingId(paqueteId);
    setError(null);
    setSuccessMsg(null);

    try {
      await paquetesService.actualizarEstado(paqueteId, {
        estadoId: nuevoEstadoId,
        usuarioId: user?.usuarioId || 1,
        observacion: 'Estado actualizado desde Consulta de Paquetes',
      });

      setSuccessMsg(`¡Estado del paquete #${paqueteId} actualizado correctamente!`);
      await loadPaquetes();
    } catch (err: any) {
      setError(err?.message || 'No se pudo cambiar el estado del paquete.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = paquetes.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.tracking?.toLowerCase().includes(q) ||
      p.origen?.toLowerCase().includes(q) ||
      p.destino?.toLowerCase().includes(q) ||
      p.estadoNombre?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Consulta de Paquetes</h1>
          <p className="text-sm text-slate-500">Listado, detalle y edición de estado en tiempo real</p>
        </div>
        <button
          onClick={loadPaquetes}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all"
        >
          ↻ Actualizar
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
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

        <div className="flex items-center justify-between gap-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar tracking, origen, destino, estado o cliente..."
            className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
            {filtered.length} resultados
          </span>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500 py-4">Cargando paquetes desde el servidor...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-slate-400 py-4 text-center">No hay paquetes que coincidan con la búsqueda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-2">Tracking</th>
                  <th className="py-3 px-2">Cliente</th>
                  <th className="py-3 px-2">Ruta</th>
                  <th className="py-3 px-2">Estado (Editable)</th>
                  <th className="py-3 px-2">Tarifa</th>
                  <th className="py-3 px-2">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filtered.map((p) => (
                  <tr key={p.paqueteId} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-2 font-bold text-slate-900">{p.tracking}</td>
                    <td className="py-3 px-2 text-slate-500">#{p.clienteId}</td>
                    <td className="py-3 px-2">{p.origen} → {p.destino}</td>
                    <td className="py-3 px-2">
                      <select
                        value={p.estadoActual || ESTADOS.REGISTRADO}
                        disabled={updatingId === p.paqueteId}
                        onChange={(e) => handleEstadoChange(p.paqueteId, parseInt(e.target.value, 10))}
                        className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500"
                      >
                        <option value={ESTADOS.REGISTRADO}>Registrado</option>
                        <option value={ESTADOS.EN_BODEGA}>En Bodega</option>
                        <option value={ESTADOS.EN_RUTA}>En Tránsito / Ruta</option>
                        <option value={ESTADOS.ENTREGADO}>Entregado</option>
                        <option value={ESTADOS.CANCELADO}>Cancelado</option>
                      </select>
                    </td>
                    <td className="py-3 px-2 font-bold text-slate-900">
                      ${p.tarifa ? p.tarifa.toFixed(2) : '0.00'}
                    </td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => setSelectedPaquete(selectedPaquete?.paqueteId === p.paqueteId ? null : p)}
                        className="px-3 py-1 bg-sky-100 hover:bg-sky-200 text-sky-900 font-semibold text-xs rounded-lg transition-all"
                      >
                        {selectedPaquete?.paqueteId === p.paqueteId ? 'Cerrar' : 'Ver'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Ficha Ampliada del Paquete */}
        {selectedPaquete && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">{selectedPaquete.tracking}</h3>
              <p className="text-xs text-slate-600">
                {selectedPaquete.origen} → {selectedPaquete.destino} · <span className="font-bold text-amber-600">{selectedPaquete.estadoNombre || 'Registrado'}</span>
              </p>
              <p className="text-xs text-slate-500">
                Dimensiones: {selectedPaquete.largo} × {selectedPaquete.ancho} × {selectedPaquete.alto} cm · Peso: {selectedPaquete.peso} kg
              </p>
            </div>
            <button
              onClick={() => setSelectedPaquete(null)}
              className="text-xs font-bold text-slate-700 hover:text-slate-900"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}