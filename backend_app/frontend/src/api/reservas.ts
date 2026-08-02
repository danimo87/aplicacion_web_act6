import { api } from './axios';

export const reservasApi = {
  create: async (id_usuario: number, id_libro: number): Promise<any> => {
    const response = await api.post('/reservas', { id_usuario, id_libro });
    return response.data;
  },
  getAll: async (): Promise<any[]> => {
    const response = await api.get('/reservas');
    return response.data;
  },
};