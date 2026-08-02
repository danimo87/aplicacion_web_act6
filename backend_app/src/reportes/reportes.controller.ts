import { Controller, Get } from '@nestjs/common';
import { ReportesService } from './reportes.service';

@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get('prestamos')
  getPrestamos() {
    return this.reportesService.obtenerReportePrestamos();
  }

  @Get('inventario')
  getInventario() {
    return this.reportesService.obtenerReporteInventario();
  }
}
