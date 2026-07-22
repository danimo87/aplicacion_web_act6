import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 👈 Lee el token desde el Header
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secreto_super_seguro_123', // La misma clave que en el modulo
    });
  }

  async validate(payload: any) {
    // Lo que retornemos aquí se inyectará automáticamente en la petición como "req.user"
    return { id_usuario: payload.sub, email: payload.email, rol: payload.rol };
  }
}