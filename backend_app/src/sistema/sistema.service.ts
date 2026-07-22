import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class SistemaService {
  constructor(private dataSource: DataSource) {}

  // 1. NOTIFICACIONES (Historia 01-0001-0012)
  async simularNotificacionesVencimiento() {
    const prestamosVencidos = await this.dataSource.query(`
      SELECT p.id_prestamo, u.email, u.nombre, l.titulo, p.fecha_devolucion
      FROM tbl_prestamos p
      INNER JOIN tbl_usuarios u ON p.id_usuario = u.id_usuario
      INNER JOIN tbl_libros l ON p.id_libro = l.id_libro
      WHERE p.id_estado_prestamo = 1 AND p.fecha_devolucion <= CURRENT_DATE
    `);

    const envios = prestamosVencidos.map(p => {
      console.log(`📧 [EMAIL SENT] Para: ${p.email} - Hola ${p.nombre}, tu préstamo del libro "${p.titulo}" venció el ${p.fecha_devolucion}. Por favor devuélvelo.`);
      return {
        email: p.email,
        usuario: p.nombre,
        libro: p.titulo,
        estado: 'Notificación enviada con éxito'
      };
    });

    return {
      mensaje: `Proceso ejecutado. Se notificó a ${envios.length} usuarios.`,
      detalles: envios
    };
  }

  // 2. RESPALDO DE INFORMACIÓN (Historia 01-0001-0013)
  async generarCopiaSeguridad() {
    const usuarios = await this.dataSource.query('SELECT * FROM tbl_usuarios');
    const libros = await this.dataSource.query('SELECT * FROM tbl_libros');
    const prestamos = await this.dataSource.query('SELECT * FROM tbl_prestamos');
    const reservas = await this.dataSource.query('SELECT * FROM tbl_reservas');

    return {
      fecha_respaldo: new Date().toISOString(),
      sistema: 'Biblioteca UTM-Dani',
      data: {
        usuarios,
        libros,
        prestamos,
        reservas
      }
    };
  }

  // 3. CONFIGURACIÓN (Historia 01-0001-0014)
  async obtenerConfiguraciones() {
    return await this.dataSource.query('SELECT * FROM tbl_configuracion');
  }

  async actualizarConfiguracion(clave: string, valor: string) {
    const update = await this.dataSource.query(
      'UPDATE tbl_configuracion SET valor = ? WHERE clave = ?',
      [valor, clave]
    );

    const resultado = await this.dataSource.query('SELECT * FROM tbl_configuracion WHERE clave = ?', [clave]);

    if (!resultado || resultado.length === 0) {
      throw new NotFoundException(`La configuración con la clave "${clave}" no existe.`);
    }

    return {
      mensaje: 'Configuración actualizada correctamente',
      configuracion: resultado[0]
    };
  }
}
