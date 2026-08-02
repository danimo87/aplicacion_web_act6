import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class PrestamosService {
  constructor(private dataSource: DataSource) {}

  // 1. REGISTRAR PRÉSTAMO (Historia 01-0001-0006)
  async crearPrestamo(id_usuario: number, id_libro: number) {
    // Paso A: Verificar disponibilidad y stock del libro
    const libro = await this.dataSource.query(
      `SELECT stock, id_estado_libro FROM tbl_libros WHERE id_libro = ?`,
      [id_libro]
    );

    if (!libro || libro.length === 0) {
      throw new NotFoundException('El libro solicitado no existe.');
    }

    if (libro[0].stock <= 0 || libro[0].id_estado_libro !== 1) {
      throw new BadRequestException('El libro no tiene stock disponible para préstamo.');
    }

    // Paso B: Insertar el registro de préstamo (Plazo de entrega: 7 días por defecto)
    await this.dataSource.query(
      `INSERT INTO tbl_prestamos (id_usuario, id_libro, fecha_devolucion, id_estado_prestamo)
       VALUES (?, ?, date('now','+7 days'), 1)`,
      [id_usuario, id_libro]
    );
    const nuevoPrestamo = await this.dataSource.query(
      `SELECT * FROM tbl_prestamos WHERE id_prestamo = last_insert_rowid()`
    );

    // Paso C: Descontar 1 del stock del libro
    await this.dataSource.query(
      `UPDATE tbl_libros SET stock = stock - 1 WHERE id_libro = ?`,
      [id_libro]
    );
    const libroActualizado = await this.dataSource.query(
      `SELECT stock FROM tbl_libros WHERE id_libro = ?`,
      [id_libro]
    );

    // Paso D: Si el stock llegó a 0, cambiar estado a 'No disponible' (2)
    if (libroActualizado[0].stock === 0) {
      await this.dataSource.query(
        `UPDATE tbl_libros SET id_estado_libro = 2 WHERE id_libro = ?`,
        [id_libro]
      );
    }

    return {
      mensaje: 'Préstamo registrado exitosamente',
      prestamo: nuevoPrestamo[0]
    };
  }

  // 2. REGISTRAR DEVOLUCIÓN (Historia 01-0001-0007)
  async registrarDevolucion(id_prestamo: number) {
    // Paso A: Buscar el préstamo activo para saber qué libro se está devolviendo
    const prestamo = await this.dataSource.query(
      `SELECT id_libro, id_estado_prestamo FROM tbl_prestamos WHERE id_prestamo = ?`,
      [id_prestamo]
    );

    if (!prestamo || prestamo.length === 0) {
      throw new NotFoundException('El registro de préstamo no existe.');
    }

    if (prestamo[0].id_estado_prestamo === 2) {
      throw new BadRequestException('Este libro ya fue devuelto anteriormente.');
    }

    const id_libro = prestamo[0].id_libro;

    // Paso B: Actualizar el préstamo con la fecha real y estado 'Devuelto' (2)
    await this.dataSource.query(
      `UPDATE tbl_prestamos 
       SET fecha_devolucion_real = date('now'), id_estado_prestamo = 2 
       WHERE id_prestamo = ?`,
      [id_prestamo]
    );

    // Paso C: Devolver el libro al inventario (Sumar stock y forzar estado 'Disponible' (1))
    await this.dataSource.query(
      `UPDATE tbl_libros 
       SET stock = stock + 1, id_estado_libro = 1 
       WHERE id_libro = ?`,
      [id_libro]
    );

    return { mensaje: 'Devolución procesada con éxito. Libro disponible nuevamente.' };
  }

  // 3. RENOVAR PRÉSTAMO (Historia 01-0001-0008)
  async renovarPrestamo(id_prestamo: number) {
    // Paso A: Obtener los datos del préstamo activo
    const prestamo = await this.dataSource.query(
      `SELECT id_libro, id_estado_prestamo FROM tbl_prestamos WHERE id_prestamo = ?`,
      [id_prestamo]
    );

    if (!prestamo || prestamo.length === 0) {
      throw new NotFoundException('El préstamo no existe.');
    }

    if (prestamo[0].id_estado_prestamo !== 1) {
      throw new BadRequestException('Solo se pueden renovar préstamos que estén activos.');
    }

    const id_libro = prestamo[0].id_libro;

    // Paso B: VALIDACIÓN CRUCIAL - Verificar si hay reservas activas (1) para este libro
    const reservas = await this.dataSource.query(
      `SELECT id_reserva FROM tbl_reservas WHERE id_libro = ? AND id_estado_reserva = 1`,
      [id_libro]
    );

    if (reservas && reservas.length > 0) {
      throw new BadRequestException(
        'No se puede renovar el préstamo porque el libro tiene una reserva activa por otro usuario.'
      );
    }

    // Paso C: Extender el plazo por 7 días más si no hay reservas
    await this.dataSource.query(
      `UPDATE tbl_prestamos 
       SET fecha_devolucion = date(fecha_devolucion, '+7 days') 
       WHERE id_prestamo = ?`,
      [id_prestamo]
    );
    const prestamoRenovado = await this.dataSource.query(
      `SELECT * FROM tbl_prestamos WHERE id_prestamo = ?`,
      [id_prestamo]
    );

    return {
      mensaje: 'Préstamo renovado por 7 días adicionales.',
      prestamo: prestamoRenovado[0]
    };
  }
}
