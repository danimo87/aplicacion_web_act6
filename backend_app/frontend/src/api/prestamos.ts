import { api } from './axios';

export const prestamosApi = {
  create: async (id_usuario: number, id_libro: number): Promise<any> => {
    const response = await api.post('/prestamos', { id_usuario, id_libro });
    return response.data;
  },

  devolver: async (id_prestamo: number): Promise<any> => {
    const response = await api.patch(`/prestamos/${id_prestamo}/devolucion`);
    return response.data;
  },

  renovar: async (id_prestamo: number): Promise<any> => {
    const response = await api.patch(`/prestamos/${id_prestamo}/renovar`);
    return response.data;
  },
};