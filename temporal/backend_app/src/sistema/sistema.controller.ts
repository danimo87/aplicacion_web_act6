import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { SistemaService } from './sistema.service';

@Controller('sistema')
export class SistemaController {
  constructor(private readonly sistemaService: SistemaService) {}

  @Post('notificar-vencimientos')
  notificar() {
    return this.sistemaService.simularNotificacionesVencimiento();
  }

  @Get('backup')
  backup() {
    return this.sistemaService.generarCopiaSeguridad();
  }

  @Get('config')
  getConfig() {
    return this.sistemaService.obtenerConfiguraciones();
  }

  @Patch('config/:clave')
  updateConfig(
    @Param('clave') clave: string,
    @Body('valor') body: { valor: string }
  ) {
    return this.sistemaService.actualizarConfiguracion(clave, body.valor);
  }
}

