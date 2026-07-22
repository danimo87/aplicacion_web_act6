import { Controller, Post, Body, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { PrestamosService } from './prestamos.service';

@Controller('prestamos')
export class PrestamosController {
  constructor(private readonly prestamosService: PrestamosService) {}

  @Post()
  crear(@Body() body: { id_usuario: number; id_libro: number }) {
    return this.prestamosService.crearPrestamo(body.id_usuario, body.id_libro);
  }

  @Patch(':id/devolucion')
  devolucion(@Param('id', ParseIntPipe) id: number) {
    return this.prestamosService.registrarDevolucion(id);
  }

  @Patch(':id/renovar')
  renovar(@Param('id', ParseIntPipe) id: number) {
    return this.prestamosService.renovarPrestamo(id);
  }
}
