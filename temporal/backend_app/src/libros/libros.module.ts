import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibrosService } from './libros.service';
import { LibrosController } from './libros.controller';
import { Libro } from './libro.entity';
import { EstadoLibro } from './estado-libro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Libro, EstadoLibro])],
  providers: [LibrosService],
  controllers: [LibrosController],
  exports: [LibrosService],
})
export class LibrosModule {}