import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonalModule } from './personal/personal.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { LibrosModule } from './libros/libros.module'; 
import { PrestamosModule } from './prestamos/prestamos.module';
import { ReservasModule } from './reservas/reservas.module';
import { ReportesModule } from './reportes/reportes.module';
import { SistemaModule } from './sistema/sistema.module';
import { buildTypeOrmOptions } from './config/typeorm.config';
import { SeedService } from './database/seed.service';

@Module({
  imports: [
    // 1. Configuramos las variables de entorno (.env) de manera global
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // 2. Conexión asíncrona y segura a Supabase con TypeORM
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => buildTypeOrmOptions(configService),
    }),
    
    // 3. Tu módulo de personal
    PersonalModule,
    
    UsuariosModule,
    
    AuthModule,
    
    LibrosModule,
    
    PrestamosModule,
    
    ReservasModule,
    
    ReportesModule,
    
    SistemaModule, 
  ],
  controllers: [AppController],
  providers: [AppService, SeedService],
})
export class AppModule {}