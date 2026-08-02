import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ReportesService {
  constructor(private dataSource: DataSource) {}

  // Reporte 01-0001-0010: Historial Completo de Préstamos y Devoluciones
  async obtenerReportePrestamos() {
    return await this.dataSource.query(`
      SELECT 
        p.id_prestamo,
        u.nombre || ' ' || u.apellido AS usuario,
        u.email AS usuario_email,
        l.titulo AS libro_titulo,
        l.autor AS libro_autor,
        p.fecha_prestamo,
        p.fecha_devolucion AS fecha_limite_entrega,
        p.fecha_devolucion_real,
        ep.nombre_estado AS estado_prestamo
      FROM tbl_prestamos p
      INNER JOIN tbl_usuarios u ON p.id_usuario = u.id_usuario
      INNER JOIN tbl_libros l ON p.id_libro = l.id_libro
      INNER JOIN tbl_estado_prestamo ep ON p.id_estado_prestamo = ep.id_estado_prestamo
      ORDER BY p.fecha_prestamo DESC
    `);
  }

  // Reporte 01-0001-0011: Reporte del Inventario Bibliográfico
  async obtenerReporteInventario() {
    return await this.dataSource.query(`
      SELECT 
        l.id_libro,
        l.titulo,
        l.autor,
        l.tema,
        l.isbn,
        l.stock,
        l.editorial,
        el.nombre_estado AS estado_libro
      FROM tbl_libros l
      INNER JOIN tbl_estado_libro el ON l.id_estado_libro = el.id_estado_libro
      ORDER BY l.stock ASC, l.titulo ASC
    `);
  }
}
