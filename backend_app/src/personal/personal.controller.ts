import { Controller, Get } from '@nestjs/common';
import { PersonalService } from './personal.service';

@Controller('personal')
export class PersonalController {
  constructor(private readonly personalService: PersonalService) {}

  // 1. Ruta base para usuarios: http://localhost:3000/personal
  @Get()
  async getAllPersonal() {
    return this.personalService.getAllPersonal();
  }

  // 2. Nueva ruta para roles: http://localhost:3000/personal/roles
  @Get('roles')
  async getAllRoles() {
    return this.personalService.getAllRoles();
  }

  // 3. Nueva ruta combinada (JOIN): http://localhost:3000/personal/detalles
  @Get('detalles')
  async getPersonalConRoles() {
    return this.personalService.getPersonalConRoles();
  }
}