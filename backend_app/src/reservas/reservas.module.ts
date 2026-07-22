import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservasService } from './reservas.service';
import { ReservasController } from './reservas.controller';
import { Reserva } from './reserva.entity';
import { EstadoReserva } from './estado-reserva.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva, EstadoReserva])],
  providers: [ReservasService],
  controllers: [ReservasController]
})
export class ReservasModule {}
