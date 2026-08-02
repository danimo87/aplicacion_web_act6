import { useState, useEffect } from 'react';
import { usuariosApi } from '../../api/usuarios';
import type { Usuario } from '../../types';

export const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const data = await usuariosApi.getAll();
      setUsuarios(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    
    try {
      await usuariosApi.delete(id);
      setUsuarios(usuarios.filter(u => u.id_usuario !== id));
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Gestión de Usuarios</h1>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Cargando usuarios...</div>
      ) : usuarios.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No hay usuarios registrados</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usuarios.map((usuario) => (
                <tr key={usuario.id_usuario} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{usuario.id_usuario}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{usuario.nombre} {usuario.apellido}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{usuario.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{usuario.telefono || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{usuario.rol?.nombre_rol || 'Sin rol'}</td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(usuario.id_usuario)}>
                      Eliminar
                    </button>
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