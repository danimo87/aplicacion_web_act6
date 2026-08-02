import { useState, useEffect } from 'react';
import { reportesApi } from '../../api/reportes';

export const Reportes = () => {
  const [prestamos, setPrestamos] = useState<any[]>([]);
  const [inventario, setInventario] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'prestamos' | 'inventario'>('prestamos');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [prestamosData, inventarioData] = await Promise.all([
        reportesApi.getPrestamos(),
        reportesApi.getInventario(),
      ]);
      setPrestamos(prestamosData);
      setInventario(inventarioData);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reportes</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('prestamos')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'prestamos'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Historial de Préstamos
          </button>
          <button
            onClick={() => setActiveTab('inventario')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'inventario'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Reporte de Inventario
          </button>
        </nav>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Cargando reportes...</div>
      ) : activeTab === 'prestamos' ? (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Libro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Préstamo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Límite</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {prestamos.map((p) => (
                <tr key={p.id_prestamo} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{p.id_prestamo}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{p.usuario || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{p.usuario_email || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{p.libro_titulo || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(p.fecha_prestamo).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(p.fecha_limite_entrega).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      p.estado_prestamo === 'Activo' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {p.estado_prestamo || 'N/A'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Autor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tema</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ISBN</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventario.map((l) => (
                <tr key={l.id_libro} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{l.id_libro}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{l.titulo}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{l.autor}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{l.tema || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{l.isbn}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{l.stock}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      l.estado_libro === 'Disponible' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {l.estado_libro || 'N/A'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};