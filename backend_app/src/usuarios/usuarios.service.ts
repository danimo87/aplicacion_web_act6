import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Rol } from './rol.entity';
import * as bcrypt from 'bcryptjs'; // 👈 ¡Cambiado a 'bcryptjs'!

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
    @InjectRepository(Rol)
    private rolesRepository: Repository<Rol>,
  ) {}

  private async getDefaultRole(): Promise<Rol> {
    let rol = await this.rolesRepository.findOne({
      where: { nombre_rol: 'Estudiante' },
    });

    if (!rol) {
      rol = this.rolesRepository.create({ nombre_rol: 'Estudiante' });
      rol = await this.rolesRepository.save(rol);
    }

    return rol;
  }

  async crear(datosUsuario: Partial<Usuario>): Promise<Usuario> {
    const existe = await this.usuariosRepository.findOne({ 
      where: { email: datosUsuario.email } 
    });
    if (existe) {
      throw new BadRequestException('El correo electrónico ya está registrado.');
    }

    if (!datosUsuario.id_rol) {
      const defaultRole = await this.getDefaultRole();
      datosUsuario.id_rol = defaultRole.id_rol;
    }

    const nuevoUsuario = this.usuariosRepository.create(datosUsuario);
    return this.usuariosRepository.save(nuevoUsuario);
  }

async buscarPorEmail(email: string): Promise<Usuario | null> {
    return this.usuariosRepository.findOne({ 
      where: { email },
      relations: { rol: true }, // 👈 ¡Cambiado a formato de objeto tipado!
    });
  }
  // LISTAR TODOS LOS USUARIOS
  async buscarTodos(): Promise<Usuario[]> {
    return this.usuariosRepository.find({ relations: { rol: true } });
  }

  // ACTUALIZAR UN USUARIO
  async actualizar(id: number, cambios: Partial<Usuario>): Promise<Usuario> {
    if (cambios.password) {
      const salt = await bcrypt.genSalt(10);
      cambios.password = await bcrypt.hash(cambios.password, salt);
    }
    await this.usuariosRepository.update(id, cambios);
    return this.usuariosRepository.findOne({ where: { id_usuario: id } }) as any;
  }

  // ELIMINAR UN USUARIO
  async eliminar(id: number): Promise<{ message: string }> {
    await this.usuariosRepository.delete(id);
    return { message: `Usuario con ID ${id} eliminado correctamente.` };
  }
}
