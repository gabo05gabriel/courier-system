import { useEffect, useState } from 'react';
import { api } from '../services/api';

const DEMO = {
  envios_total: 1280,
  envios_entregados: 1184,
  envios_pendientes: 96,
  rutas_activas: 12,
  ingresos_mes: 23540.75,
  tasa_entrega: 92.5,
  incidentes: 7,
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      // intenta el endpoint “oficial”
      const data = await api.request('/api/reportes/dashboard');
      setStats(data);
    } catch (err) {
      // si el backend devuelve 404 u otro error, usa demo y muestra aviso suave
      console.warn('Dashboard API error:', err);
      setError(err?.message || 'No se pudo cargar el dashboard.');
      setStats(DEMO);
    }
  }

  return (
    <div>
      <h2 className="fw-bold mb-4">📊 Dashboard</h2>

      {error && (
        <div className="alert alert-warning">
          {error} — mostrando datos de ejemplo.
        </div>
      )}

      {!stats ? (
        <p>Cargando Dashboard...</p>
      ) : (
        <>
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="card shadow-sm border-0 p-3">
                <h5>Envíos Totales</h5>
                <p className="display-6 fw-bold">{stats.envios_total}</p>
                <small className="text-muted">
                  {stats.envios_entregados} entregados, {stats.envios_pendientes} pendientes
                </small>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm border-0 p-3">
                <h5>Rutas Activas Hoy</h5>
                <p className="display-6 fw-bold">{stats.rutas_activas}</p>
                <small className="text-muted">Mensajeros en ruta</small>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm border-0 p-3">
                <h5>Ingresos del Mes</h5>
                <p className="display-6 fw-bold">
                  {Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(stats.ingresos_mes ?? 0)}
                </p>
                <small className="text-muted">Pagos registrados</small>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <div className="card shadow-sm border-0 p-3">
                <h5>Tasa de Entrega</h5>
                <p className="display-6 fw-bold">
                  {(stats.tasa_entrega ?? 0).toFixed(1)}% <span className="text-muted">completados</span>
                </p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card shadow-sm border-0 p-3">
                <h5>Incidentes</h5>
                <p className="display-6 fw-bold">{stats.incidentes}</p>
                <small className="text-muted">Últimos 7 días</small>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
