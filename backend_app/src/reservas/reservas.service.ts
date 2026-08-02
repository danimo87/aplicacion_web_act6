import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ReservasService {
  constructor(private dataSource: DataSource) {}

  async crearReserva(id_usuario: number, id_libro: number) {
    // 1. Verificar si el libro existe y ver su stock/estado
    const libro = await this.dataSource.query(
      `SELECT stock, id_estado_libro FROM tbl_libros WHERE id_libro = ?`,
      [id_libro]
    );

    if (!libro || libro.length === 0) {
      throw new NotFoundException('El libro que intentas reservar no existe.');
    }

    // 2. Regla de negocio: Solo se reserva si NO hay stock disponible (está prestado)
    if (libro[0].stock > 0 && libro[0].id_estado_libro === 1) {
      throw new BadRequestException(
        'No puedes reservar este libro porque actualmente tiene stock disponible para préstamo inmediato.'
      );
    }

    // 3. Verificar si este usuario ya tiene una reserva ACTIVA para este mismo libro
    const reservaExistente = await this.dataSource.query(
      `SELECT id_reserva FROM tbl_reservas WHERE id_usuario = ? AND id_libro = ? AND id_estado_reserva = 1`,
      [id_usuario, id_libro]
    );

    if (reservaExistente && reservaExistente.length > 0) {
      throw new BadRequestException('Ya tienes una reserva activa para este libro.');
    }

    // 4. Insertar la reserva (1 = Activa por defecto)
    await this.dataSource.query(
      `INSERT INTO tbl_reservas (id_usuario, id_libro, id_estado_reserva)
       VALUES (?, ?, 1)`,
      [id_usuario, id_libro]
    );

    const nuevaReserva = await this.dataSource.query(
      `SELECT * FROM tbl_reservas WHERE id_reserva = last_insert_rowid()`
    );

    return {
      mensaje: 'Reserva registrada con éxito. Te notificaremos cuando esté disponible.',
      reserva: nuevaReserva[0]
    };
  }

  async listarReservas() {
    return await this.dataSource.query(`
      SELECT
        r.id_reserva,
        r.id_usuario,
        r.id_libro,
        u.nombre || ' ' || u.apellido AS usuario,
        l.titulo AS libro_titulo,
        CURRENT_DATE AS fecha_reserva,
        r.id_estado_reserva
      FROM tbl_reservas r
      INNER JOIN tbl_usuarios u ON r.id_usuario = u.id_usuario
      INNER JOIN tbl_libros l ON r.id_libro = l.id_libro
      ORDER BY r.id_reserva DESC
    `);
  }
}
