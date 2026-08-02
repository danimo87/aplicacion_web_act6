import { api } from './axios';

export const reportesApi = {
  getPrestamos: async (): Promise<any[]> => {
    const response = await api.get('/reportes/prestamos');
    return response.data;
  },

  getInventario: async (): Promise<any[]> => {
    const response = await api.get('/reportes/inventario');
    return response.data;
  },
};