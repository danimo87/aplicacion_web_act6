export interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  id_rol: number;
  rol?: Rol;
  password?: string;
}

export interface Rol {
  id_rol: number;
  nombre_rol: string;
}

export interface Libro {
  id_libro: number;
  titulo: string;
  autor: string;
  tema?: string;
  isbn: string;
  stock: number;
  editorial?: string;
  id_estado_libro: number;
  estado?: EstadoLibro;
}

export interface EstadoLibro {
  id_estado_libro: number;
  nombre_estado: string;
}

export interface Prestamo {
  id_prestamo: number;
  id_usuario: number;
  id_libro: number;
  fecha_prestamo: string;
  fecha_devolucion: string;
  fecha_devolucion_real?: string;
  id_estado_prestamo: number;
  usuario?: Usuario;
  libro?: Libro;
}

export interface Reserva {
  id_reserva: number;
  id_usuario: number;
  id_libro: number;
  fecha_reserva: string;
  id_estado_reserva: number;
}

export interface AuthResponse {
  success: boolean;
  access_token: string;
  usuario: {
    nombre: string;
    apellido: string;
    rol: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
}