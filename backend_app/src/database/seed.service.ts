import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    try {
      // Estado libros
      const estadoLibros = await this.dataSource.query('SELECT COUNT(*) as cnt FROM tbl_estado_libro');
      const cntLibros = estadoLibros && estadoLibros[0] ? (estadoLibros[0].cnt ?? estadoLibros[0]['COUNT(*)'] ?? 0) : 0;
      if (cntLibros === 0) {
        this.logger.log('Seeding tbl_estado_libro');
        await this.dataSource.query("INSERT INTO tbl_estado_libro (nombre_estado) VALUES ('Disponible'), ('No disponible')");
      }

      // Estado prestamos
      const estadoPrestamos = await this.dataSource.query('SELECT COUNT(*) as cnt FROM tbl_estado_prestamo');
      const cntPrest = estadoPrestamos && estadoPrestamos[0] ? (estadoPrestamos[0].cnt ?? estadoPrestamos[0]['COUNT(*)'] ?? 0) : 0;
      if (cntPrest === 0) {
        this.logger.log('Seeding tbl_estado_prestamo');
        await this.dataSource.query("INSERT INTO tbl_estado_prestamo (nombre_estado) VALUES ('Activo'), ('Devuelto')");
      }

      // Estado reservas
      const estadoReservas = await this.dataSource.query('SELECT COUNT(*) as cnt FROM tbl_estado_reserva');
      const cntRes = estadoReservas && estadoReservas[0] ? (estadoReservas[0].cnt ?? estadoReservas[0]['COUNT(*)'] ?? 0) : 0;
      if (cntRes === 0) {
        this.logger.log('Seeding tbl_estado_reserva');
        await this.dataSource.query("INSERT INTO tbl_estado_reserva (nombre_estado) VALUES ('Activa'), ('Completada')");
      }

      this.logger.log('DB seeding complete');
    } catch (err) {
      this.logger.error('DB seeding failed', err as any);
    }
  }
}
