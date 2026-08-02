import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import * as bcrypt from 'bcryptjs'; // 👈 ¡Cambiado a 'bcryptjs'!

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  async crear(datosUsuario: Partial<Usuario>): Promise<Usuario> {
    const existe = await this.usuariosRepository.findOne({ 
      where: { email: datosUsuario.email } 
    });
    if (existe) {
      throw new BadRequestException('El correo electrónico ya está registrado.');
    }

    // Funciona exactamente igual con bcryptjs
    const salt = await bcrypt.genSalt(10);
    datosUsuario.password = await bcrypt.hash(datosUsuario.password!, salt);

    // Set default role if not provided (assuming role ID 1 is the default user role)
    if (!datosUsuario.id_rol) {
      datosUsuario.id_rol = 1;
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
