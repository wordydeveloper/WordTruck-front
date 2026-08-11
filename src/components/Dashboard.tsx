import React, { useEffect, useState } from 'react';
import { paquetesService } from '../services/paquetesService';
import { clientesService } from '../services/clientesService';
import { facturasService } from '../services/facturasService';
import type { PaqueteDto, ClienteDto, FacturaDto } from '../services/types';
import { ESTADOS } from '../services/types';

export default function Dashboard() {
  const [paquetes, setPaquetes] = useState<PaqueteDto[]>([]);
  const [clientes, setClientes] = useState<ClienteDto[]>([]);
  const [facturas, setFacturas] = useState<FacturaDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [paquetesData, clientesData, facturasData] = await Promise.all([
        paquetesService.getAll(),
        clientesService.getAll(),
        facturasService.getAll(),
      ]);

      setPaquetes(paquetesData || []);
      setClientes(clientesData || []);
      setFacturas(facturasData || []);
    } catch (err: any) {
      setError(err?.message || 'Error al cargar los datos del Dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Cálculos dinámicos
  const totalPaquetes = paquetes.length;
  const enTransito = paquetes.filter(
    (p) => p.estadoActual === ESTADOS.EN_RUTA || p.estadoActual === ESTADOS.EN_BODEGA
  ).length;
  const entregados = paquetes.filter((p) => p.estadoActual === ESTADOS.ENTREGADO).length;
  const totalClientes = clientes.length;
  const totalFacturacion = facturas.reduce((acc, f) => acc + (f.total || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Resumen operativo y métricas en tiempo real</p>
        </div>
        <button
          onClick={loadDashboardData}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all"
        >
          ↻ Actualizar
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium">
          {error}
        </div>
      )}

      {/* Tarjetas de Indicadores KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-sky-50/60 border border-sky-100 p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-500">Paquetes</p>
          <p className="text-3xl font-black text-slate-900 mt-1">{loading ? '...' : totalPaquetes}</p>
        </div>

        <div className="bg-amber-50/60 border border-amber-100 p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-500">En tránsito / Bodega</p>
          <p className="text-3xl font-black text-slate-900 mt-1">{loading ? '...' : enTransito}</p>
        </div>

        <div className="bg-emerald-50/60 border border-emerald-100 p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-500">Entregados</p>
          <p className="text-3xl font-black text-slate-900 mt-1">{loading ? '...' : entregados}</p>
        </div>

        <div className="bg-indigo-50/60 border border-indigo-100 p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-500">Clientes</p>
          <p className="text-3xl font-black text-slate-900 mt-1">{loading ? '...' : totalClientes}</p>
        </div>
      </div>

      {/* Tablas de Paquetes Recientes y Facturación */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Paquetes Recientes */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-4">Paquetes recientes</h2>

          {loading ? (
            <p className="text-sm text-slate-500 py-4">Cargando paquetes...</p>
          ) : paquetes.length === 0 ? (
            <p className="text-sm text-slate-400 py-4 text-center">No hay paquetes registrados.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {paquetes.slice(0, 5).map((p) => (
                <div key={p.paqueteId} className="py-3 flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-900">{p.tracking}</span>
                  <span className="text-slate-500">{p.origen} → {p.destino}</span>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs">
                    {p.estadoNombre || 'Registrado'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resumen Facturación */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1">Facturación</h2>
            <p className="text-3xl font-black text-slate-900 mt-2">${totalFacturacion.toFixed(2)}</p>
            <p className="text-xs text-slate-500 mt-1">{facturas.length} facturas registradas</p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <span className="text-xs text-emerald-600 font-semibold">✓ Conectado con SQL Server</span>
          </div>
        </div>
      </div>
    </div>
  );
}