import { Controller, Post, Body } from '@nestjs/common';
import { ReservasService } from './reservas.service';

@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Post()
  crear(@Body() body: { id_usuario: number; id_libro: number }) {
    return this.reservasService.crearReserva(body.id_usuario, body.id_libro);
  }
}
