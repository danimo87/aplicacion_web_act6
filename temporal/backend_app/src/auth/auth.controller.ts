import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth') // 👈 Ruta: http://localhost:3000/api/auth
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login') // 👈 POST a http://localhost:3000/api/auth/login
  async login(@Body() body: any) {
    // Validamos primero al usuario
    const usuario = await this.authService.validarUsuario(body.email, body.password);
    
    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas o usuario no existe.');
    }
    
    // Si es correcto, le firmamos su Token
    return this.authService.login(usuario);
  }
}
