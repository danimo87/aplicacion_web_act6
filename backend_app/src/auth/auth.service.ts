import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService, // 👈 Buscador de usuarios
    private jwtService: JwtService,           // 👈 Generador de tokens
  ) {}

  // 1. VALIDAR CREDENCIALES
  async validarUsuario(email: string, clavePlana: string): Promise<any> {
    const usuario = await this.usuariosService.buscarPorEmail(email);

    if (!usuario) {
      return null;
    }

    const storedPassword = usuario.password ?? '';
    const isBcryptHash = /^\$2[aby]\$/.test(storedPassword);
    let esValida = false;

    if (isBcryptHash) {
      esValida = await bcrypt.compare(clavePlana, storedPassword);
    } else {
      esValida = storedPassword === clavePlana;
      if (esValida) {
        const hashedPassword = await bcrypt.hash(clavePlana, 10);
        await this.usuariosService.actualizar(usuario.id_usuario, { password: hashedPassword });
      }
    }

    if (!esValida) {
      return null;
    }

    const { password, ...resultado } = usuario;
    return resultado;
  }

  // 2. GENERAR EL PASAPORTE (TOKEN JWT)
  async login(usuario: any) {
    // Aquí sellamos los datos dentro del Token. ¡Incluido el nombre del ROL!
    const payload = { 
      sub: usuario.id_usuario, 
      email: usuario.email, 
      rol: usuario.rol?.nombre_rol || 'Estudiante' // 👈 Así viaja el rol seguro
    };

    return {
      success: true,
      access_token: this.jwtService.sign(payload),
      usuario: {
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: payload.rol
      }
    };
  }
}
