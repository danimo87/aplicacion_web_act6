import { Module } from '@nestjs/common';
import { PrestamosService } from './prestamos.service';
import { PrestamosController } from './prestamos.controller';

@Module({
  providers: [PrestamosService],
  controllers: [PrestamosController]
})
export class PrestamosModule {}
