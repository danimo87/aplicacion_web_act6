import { api } from './axios';
import type { Libro } from '../types';

export const librosApi = {
  getAll: async (): Promise<Libro[]> => {
    const response = await api.get<Libro[]>('/libros');
    return response.data;
  },

  getById: async (id: number): Promise<Libro> => {
    const response = await api.get<Libro>(`/libros/${id}`);
    return response.data;
  },

  search: async (params: { titulo?: string; autor?: string; tema?: string; isbn?: string }): Promise<Libro[]> => {
    const response = await api.get<Libro[]>('/libros/buscar', { params });
    return response.data;
  },

  create: async (data: Partial<Libro>): Promise<Libro> => {
    const response = await api.post<Libro>('/libros', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Libro>): Promise<Libro> => {
    const response = await api.patch<Libro>(`/libros/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/libros/${id}`);
  },
};