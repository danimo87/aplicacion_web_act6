import { useState, useEffect } from 'react';
import { prestamosApi } from '../../api/prestamos';
import { reportesApi } from '../../api/reportes';
import { librosApi } from '../../api/libros';
import { usuariosApi } from '../../api/usuarios';
import type { Libro, Usuario } from '../../types';

export const Prestamos = () => {
  const [prestamos, setPrestamos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [libros, setLibros] = useState<Libro[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id_usuario: 0, id_libro: 0 });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [prestamosData, librosData, usuariosData] = await Promise.all([
        fetchPrestamos(),
        librosApi.getAll(),
        usuariosApi.getAll(),
      ]);
      setPrestamos(prestamosData);
      setLibros(librosData);
      setUsuarios(usuariosData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrestamos = async () => {
    try {
      const rows = await reportesApi.getPrestamos();
      return rows.map((r: any) => ({
        id_prestamo: r.id_prestamo,
        usuario: { nombre: r.usuario },
        libro: { titulo: r.libro_titulo, autor: r.libro_autor },
        fecha_prestamo: r.fecha_prestamo,
        fecha_devolucion: r.fecha_limite_entrega || r.fecha_devolucion,
        fecha_devolucion_real: r.fecha_devolucion_real,
        id_estado_prestamo:
          r.id_estado_prestamo ?? (r.estado_prestamo && r.estado_prestamo.toLowerCase().includes('dev') ? 2 : 1),
      }));
    } catch (error) {
      console.error('Error fetching prestamos:', error);
      return [];
    }
  };

  const handleCreate = async () => {
    if (!formData.id_usuario || !formData.id_libro) {
      setMessage({ type: 'error', text: 'Selecciona un usuario y un libro' });
      return;
    }

    try {
      await prestamosApi.create(formData.id_usuario, formData.id_libro);
      setMessage({ type: 'success', text: 'Préstamo registrado exitosamente' });
      setShowModal(false);
      setFormData({ id_usuario: 0, id_libro: 0 });
      cargarDatos();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error al registrar préstamo' });
    }
  };

  const handleDevolucion = async (id_prestamo: number) => {
    if (!confirm('¿Registrar devolución de este libro?')) return;

    try {
      await prestamosApi.devolver(id_prestamo);
      setMessage({ type: 'success', text: 'Devolución registrada exitosamente' });
      cargarDatos();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error al registrar devolución' });
    }
  };

  const handleRenovar = async (id_prestamo: number) => {
    if (!confirm('¿Renovar este préstamo por 7 días más?')) return;

    try {
      await prestamosApi.renovar(id_prestamo);
      setMessage({ type: 'success', text: 'Préstamo renovado exitosamente' });
      cargarDatos();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error al renovar préstamo' });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Préstamos</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          Nuevo Préstamo
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-md mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500">Cargando préstamos...</div>
      ) : prestamos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No hay préstamos registrados</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Libro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Préstamo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Devolución</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {prestamos.map((prestamo) => (
                <tr key={prestamo.id_prestamo} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{prestamo.id_prestamo}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{prestamo.usuario?.nombre || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{prestamo.libro?.titulo || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(prestamo.fecha_prestamo).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(prestamo.fecha_devolucion).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      prestamo.id_estado_prestamo === 1 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {prestamo.id_estado_prestamo === 1 ? 'Activo' : 'Devuelto'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    {prestamo.id_estado_prestamo === 1 && (
                      <>
                        <button
                          onClick={() => handleDevolucion(prestamo.id_prestamo)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Devolver
                        </button>
                        <button
                          onClick={() => handleRenovar(prestamo.id_prestamo)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Renovar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Nuevo Préstamo */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nuevo Préstamo</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.id_usuario}
                  onChange={(e) => setFormData({ ...formData, id_usuario: Number(e.target.value) })}
                >
                  <option value={0}>Seleccionar usuario</option>
                  {usuarios.map((u) => (
                    <option key={u.id_usuario} value={u.id_usuario}>
                      {u.nombre} {u.apellido} - {u.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Libro</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.id_libro}
                  onChange={(e) => setFormData({ ...formData, id_libro: Number(e.target.value) })}
                >
                  <option value={0}>Seleccionar libro</option>
                  {libros.filter(l => l.stock > 0).map((l) => (
                    <option key={l.id_libro} value={l.id_libro}>
                      {l.titulo} - Stock: {l.stock}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Registrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};