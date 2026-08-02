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
    
    if (usuario) {
      // Compara la clave que escribió el usuario con la encriptada de Supabase
      const esValida = await bcrypt.compare(clavePlana, usuario.password);
      if (esValida) {
        // Quitamos la contraseña del objeto por seguridad antes de retornarlo
        const { password, ...resultado } = usuario;
        return resultado;
      }
    }
    return null;
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
