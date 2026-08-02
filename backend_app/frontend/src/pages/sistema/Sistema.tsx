import { useState, useEffect } from 'react';
import { sistemaApi } from '../../api/sistema';

export const Sistema = () => {
  const [configuraciones, setConfiguraciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<string | null>(null);
  const [valorEditado, setValorEditado] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [notificando, setNotificando] = useState(false);
  const [backup, setBackup] = useState<any>(null);

  useEffect(() => {
    cargarConfiguraciones();
  }, []);

  const cargarConfiguraciones = async () => {
    setLoading(true);
    try {
      const data = await sistemaApi.getConfig();
      setConfiguraciones(data);
    } catch (error) {
      console.error('Error al cargar configuraciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateConfig = async (clave: string) => {
    try {
      await sistemaApi.updateConfig(clave, valorEditado);
      setMessage({ type: 'success', text: 'Configuración actualizada exitosamente' });
      setEditando(null);
      setValorEditado('');
      cargarConfiguraciones();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error al actualizar configuración' });
    }
  };

  const handleNotificar = async () => {
    setNotificando(true);
    try {
      const result = await sistemaApi.notificarVencimientos();
      setMessage({ type: 'success', text: `Notificaciones enviadas: ${result.mensaje}` });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error al enviar notificaciones' });
    } finally {
      setNotificando(false);
    }
  };

  const handleBackup = async () => {
    try {
      const data = await sistemaApi.getBackup();
      setBackup(data);
      setMessage({ type: 'success', text: 'Backup generado exitosamente' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error al generar backup' });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Configuración del Sistema</h1>

      {message && (
        <div className={`p-4 rounded-md mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Acciones del Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Notificaciones de Vencimiento</h3>
          <p className="text-sm text-gray-500 mb-4">Enviar notificaciones a usuarios con préstamos vencidos</p>
          <button
            onClick={handleNotificar}
            disabled={notificando}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {notificando ? 'Enviando...' : 'Enviar Notificaciones'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Copia de Seguridad</h3>
          <p className="text-sm text-gray-500 mb-4">Generar respaldo completo de la base de datos</p>
          <button
            onClick={handleBackup}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            Generar Backup
          </button>
        </div>
      </div>

      {/* Backup Data */}
      {backup && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Backup Generado</h3>
          <p className="text-sm text-gray-500 mb-2">Fecha: {new Date(backup.fecha_respaldo).toLocaleString()}</p>
          <div className="text-sm text-gray-600">
            <p>Usuarios: {backup.data?.usuarios?.length || 0}</p>
            <p>Libros: {backup.data?.libros?.length || 0}</p>
            <p>Préstamos: {backup.data?.prestamos?.length || 0}</p>
            <p>Reservas: {backup.data?.reservas?.length || 0}</p>
          </div>
        </div>
      )}

      {/* Configuraciones */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuraciones</h2>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Cargando configuraciones...</div>
      ) : configuraciones.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No hay configuraciones disponibles</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clave</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {configuraciones.map((config) => (
                <tr key={config.clave} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{config.clave}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {editando === config.clave ? (
                      <input
                        type="text"
                        value={valorEditado}
                        onChange={(e) => setValorEditado(e.target.value)}
                        className="border border-gray-300 rounded-md px-2 py-1 w-full"
                        autoFocus
                      />
                    ) : (
                      config.valor
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    {editando === config.clave ? (
                      <>
                        <button
                          onClick={() => handleUpdateConfig(config.clave)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => setEditando(null)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setEditando(config.clave);
                          setValorEditado(config.valor);
                        }}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Editar
                      </button>
                    )}
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
