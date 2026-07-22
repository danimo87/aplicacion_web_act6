import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Bienvenido</h3>
          <p className="mt-2 text-xl font-semibold text-gray-900">
            {user?.nombre} {user?.apellido}
          </p>
          <p className="text-sm text-gray-600">Rol: {user?.rol}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Sistema</h3>
          <p className="mt-2 text-xl font-semibold text-gray-900">Biblioteca UTM</p>
          <p className="text-sm text-gray-600">Gestión bibliotecaria</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Estado</h3>
          <p className="mt-2 text-xl font-semibold text-green-600">Activo</p>
          <p className="text-sm text-gray-600">Sesión iniciada</p>
        </div>
      </div>
    </div>
  );
};