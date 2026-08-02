import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { LibrosService } from './libros.service';

@Controller('libros') // Base: http://localhost:3000/libros (o /api/libros si tienes prefijo global)
export class LibrosController {
  constructor(private readonly librosService: LibrosService) {}

  // 🔍 Búsqueda: http://localhost:3000/libros/buscar?titulo=quijote
  @Get('buscar')
  async buscar(
    @Query('titulo') titulo?: string,
    @Query('autor') autor?: string,
    @Query('tema') tema?: string,
    @Query('isbn') isbn?: string,
  ) {
    return this.librosService.buscarLibros({ titulo, autor, tema, isbn });
  }

  // 📖 Catálogo completo: http://localhost:3000/libros
  @Get()
  async verCatalogo() {
    return this.librosService.obtenerCatalogo();
  }

  // 🆔 Ver un solo libro por ID: http://localhost:3000/libros/1
  @Get(':id')
  async obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.librosService.obtenerPorId(id);
  }

  // 📝 Crear libro: http://localhost:3000/libros (Envías JSON en el Body)
  @Post()
  async crear(@Body() datosLibro: any) {
    return this.librosService.crearLibro(datosLibro);
  }

  // 🔄 Editar libro: http://localhost:3000/libros/1 (Envías campos a cambiar en el Body)
  @Patch(':id')
  async actualizar(@Param('id', ParseIntPipe) id: number, @Body() datosActualizar: any) {
    return this.librosService.actualizarLibro(id, datosActualizar);
  }

  // 🗑️ Eliminar libro: http://localhost:3000/libros/1
  @Delete(':id')
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    await this.librosService.eliminarLibro(id);
    return { message: `El libro con ID ${id} fue retirado de la biblioteca exitosamente.` };
  }
}