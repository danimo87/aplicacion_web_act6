import { Controller, Post, Body, Get, Put, Delete, Param, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './usuario.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // 👈 Protege las rutas con el guardia

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('registro') // 👈 Ruta pública para que cualquiera se registre
  async registrar(@Body() datos: Partial<Usuario>) {
    return this.usuariosService.crear(datos);
  }

  @Get()
  @UseGuards(JwtAuthGuard) // 👈 Candado activado
  async listar() {
    return this.usuariosService.buscarTodos();
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard) // 👈 Candado activado
  async editar(@Param('id') id: number, @Body() cambios: Partial<Usuario>) {
    return this.usuariosService.actualizar(id, cambios);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) // 👈 Candado activado
  async borrar(@Param('id') id: number) {
    return this.usuariosService.eliminar(id);
  }
}
