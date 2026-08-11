import React, { useEffect, useState } from 'react';
import { facturasService } from '../services/facturasService';
import { paquetesService } from '../services/paquetesService';
import type { FacturaDto, PaqueteDto } from '../services/types';

export default function Reports() {
  const [facturas, setFacturas] = useState<FacturaDto[]>([]);
  const [paquetes, setPaquetes] = useState<PaqueteDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Campos del formulario para emitir factura
  const [paqueteId, setPaqueteId] = useState<string>('');
  const [total, setTotal] = useState<string>('');
  const [metodoPago, setMetodoPago] = useState<string>('Tarjeta');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [facturasData, paquetesData] = await Promise.all([
        facturasService.getAll(),
        paquetesService.getAll(),
      ]);
      setFacturas(facturasData || []);
      setPaquetes(paquetesData || []);
    } catch (err: any) {
      setError(err?.message || 'Error al conectar con la API de reportes.');
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

    const pId = parseInt(paqueteId, 10);
    const totalNum = parseFloat(total);

    if (isNaN(pId) || pId <= 0) {
      setError('Seleccione un paquete válido.');
      return;
    }

    if (isNaN(totalNum) || totalNum <= 0) {
      setError('El total debe ser un monto mayor a $0.00.');
      return;
    }

    setSubmitting(true);
    try {
      await facturasService.create({
        paqueteId: pId,
        total: totalNum,
        metodoPago: metodoPago,
      });

      setSuccessMsg('¡Factura creada y registrada en el sistema!');
      setPaqueteId('');
      setTotal('');
      setMetodoPago('Tarjeta');
      loadData();
    } catch (err: any) {
      setError(err?.message || 'No se pudo generar la factura para este paquete.');
    } finally {
      setSubmitting(false);
    }
  };

  // Cálculos dinámicos para los reportes
  const totalIngresos = facturas.reduce((acc, f) => acc + (f.total || 0), 0);
  const totalFacturas = facturas.length;
  const promedioFactura = totalFacturas > 0 ? totalIngresos / totalFacturas : 0;

  // Filtrar paquetes que aún no han sido facturados
  const paquetesFacturadosIds = new Set(facturas.map((f) => f.paqueteId));
  const paquetesSinFacturar = paquetes.filter((p) => !paquetesFacturadosIds.has(p.paqueteId));

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reportes y Facturación</h1>
          <p className="text-sm text-slate-500">Métricas en tiempo real e historial financiero de WordTruck</p>
        </div>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all flex items-center gap-2"
        >
          ↻ Actualizar
        </button>
      </div>

      {/* Tarjetas de Resumen KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Reporte Financiero</h3>
          <p className="text-3xl font-black text-slate-900">${totalIngresos.toFixed(2)}</p>
          <p className="text-xs font-semibold text-amber-600 mt-2">{totalFacturas} facturas emitidas</p>
          <span className="text-[11px] text-slate-400 block mt-1">Los datos se calculan directamente desde la API.</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Reporte de Paquetes</h3>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-medium text-slate-600">Registrados</span>
            <span className="text-2xl font-bold text-slate-900">{paquetes.length}</span>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-500">Pendientes de factura</span>
            <span className="text-xs font-bold text-amber-600">{paquetesSinFacturar.length}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Promedio por Factura</h3>
          <p className="text-3xl font-black text-slate-900">${promedioFactura.toFixed(2)}</p>
          <p className="text-xs font-semibold text-emerald-600 mt-2">Ticket medio de cobro</p>
          <span className="text-[11px] text-slate-400 block mt-1">Suma acumulada / Total de facturas</span>
        </div>
      </div>

      {/* Grid Principal: Listado y Formulario */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabla de Facturas */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Detalle de Facturas Emitidas</h2>

          {loading ? (
            <p className="text-sm text-slate-500 py-4">Cargando datos financieros...</p>
          ) : facturas.length === 0 ? (
            <p className="text-sm text-slate-400 py-4 text-center">No hay facturas registradas en la base de datos.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-2">ID Factura</th>
                    <th className="py-3 px-2">Código Tracking</th>
                    <th className="py-3 px-2">Total</th>
                    <th className="py-3 px-2">Método Pago</th>
                    <th className="py-3 px-2">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {facturas.map((item) => (
                    <tr key={item.facturaId} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-2 font-bold text-amber-600">#{item.facturaId}</td>
                      <td className="py-3 px-2 font-medium text-slate-900">
                        {item.tracking || `Paquete #${item.paqueteId}`}
                      </td>
                      <td className="py-3 px-2 font-black text-slate-900">${item.total.toFixed(2)}</td>
                      <td className="py-3 px-2">
                        <span className="px-2 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold">
                          {item.metodoPago}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-slate-500 text-xs">
                        {new Date(item.fecha).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Formulario para emitir nueva factura */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Emitir Nueva Factura</h2>
          <p className="text-xs text-slate-500 mb-4">Vincular un paquete y registrar su pago en la API</p>

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
              <label className="block text-xs font-bold text-slate-700 mb-1">Seleccionar Paquete</label>
              <select
                value={paqueteId}
                onChange={(e) => {
                  const id = e.target.value;
                  setPaqueteId(id);
                  // Rellenar automáticamente la tarifa del paquete si existe
                  const pkg = paquetes.find((p) => p.paqueteId === parseInt(id, 10));
                  if (pkg && pkg.tarifa) {
                    setTotal(pkg.tarifa.toString());
                  }
                }}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">-- Seleccionar paquete --</option>
                {paquetes.map((p) => (
                  <option key={p.paqueteId} value={p.paqueteId}>
                    #{p.paqueteId} - {p.tracking} ({p.origen} → {p.destino})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Monto Total ($)</label>
              <input
                type="number"
                step="0.01"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                placeholder="Ej: 500.00"
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Método de Pago</label>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Tarjeta">Tarjeta de Crédito / Débito</option>
                <option value="Efectivo">Efectivo contra entrega</option>
                <option value="Transferencia">Transferencia Bancaria</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
            >
              {submitting ? 'Procesando...' : 'Guardar Factura'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}