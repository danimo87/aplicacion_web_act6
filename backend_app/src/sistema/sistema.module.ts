import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SistemaService } from './sistema.service';
import { SistemaController } from './sistema.controller';
import { Configuracion } from './configuracion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Configuracion])],
  controllers: [SistemaController],
  providers: [SistemaService],
})
export class SistemaModule {}