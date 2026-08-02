import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const buildTypeOrmOptions = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const dbType = configService.get<string>('DB_TYPE')?.toLowerCase();

  if (dbType === 'sqlite') {
    return {
      type: 'better-sqlite3',
      database: configService.get<string>('DB_NAME') || 'database.sqlite',
      autoLoadEntities: true,
      synchronize: true,
      dropSchema: false,
    };
  }

  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST') || 'localhost',
    port: configService.get<number>('DB_PORT') || 5432,
    username: configService.get<string>('DB_USER') || 'postgres',
    password: configService.get<string>('DB_PASSWORD') || 'postgres',
    database: configService.get<string>('DB_NAME') || 'postgres',
    autoLoadEntities: true,
    synchronize: false,
  };
};
