import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PersonalService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  // 1. Consulta para la tabla de Usuarios (Tu base)
  async getAllPersonal(): Promise<any> {
    const query = `SELECT * FROM tbl_usuarios LIMIT 10`;
    const result = await this.dataSource.query(query);
    return result;
  }

  // 2. Nueva consulta para la tabla de Roles
  async getAllRoles(): Promise<any> {
    const query = `SELECT * FROM tbl_rol LIMIT 10`;
    const result = await this.dataSource.query(query);
    return result;
  }

  // 3. ¡Puntos extra! Consulta combinada (INNER JOIN)
  // Muestra los usuarios junto con el nombre del rol que tienen asignado
  async getPersonalConRoles(): Promise<any> {
    const query = `
      SELECT 
        u.id_usuario, 
        u.nombre, 
        u.apellido, 
        u.email, 
        r.id_rol
      FROM tbl_usuarios u
      INNER JOIN tbl_rol r ON u.id_rol = r.id_rol
      LIMIT 10
    `;
    const result = await this.dataSource.query(query);
    return result;
  }
}
