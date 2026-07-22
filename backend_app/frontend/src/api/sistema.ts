import { api } from './axios';

export const sistemaApi = {
  getConfig: async (): Promise<any[]> => {
    const response = await api.get('/sistema/config');
    return response.data;
  },

  updateConfig: async (clave: string, valor: string): Promise<any> => {
    const response = await api.patch(`/sistema/config/${clave}`, { valor });
    return response.data;
  },

  notificarVencimientos: async (): Promise<any> => {
    const response = await api.post('/sistema/notificar-vencimientos');
    return response.data;
  },

  getBackup: async (): Promise<any> => {
    const response = await api.get('/sistema/backup');
    return response.data;
  },
};