import { ConfigService } from '@nestjs/config';
import { buildTypeOrmOptions } from './typeorm.config';

describe('buildTypeOrmOptions', () => {
  it('returns sqlite configuration when DB_TYPE=sqlite', () => {
    const configService = {
      get: jest.fn((key: string) => {
        if (key === 'DB_TYPE') {
          return 'sqlite';
        }
        if (key === 'DB_NAME') {
          return 'db.sqlite';
        }
        return undefined;
      }),
    } as unknown as ConfigService;

    const config = buildTypeOrmOptions(configService);

    expect(config.type).toBe('better-sqlite3');
    expect(config.database).toBe('db.sqlite');
    expect(config.synchronize).toBe(true);
  });
});
