import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrestamosService } from './prestamos.service';
import { PrestamosController } from './prestamos.controller';
import { Prestamo } from './prestamo.entity';
import { EstadoPrestamo } from './estado-prestamo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Prestamo, EstadoPrestamo])],
  providers: [PrestamosService],
  controllers: [PrestamosController]
})
export class PrestamosModule {}
