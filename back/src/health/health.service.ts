import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { readFileSync } from 'fs';
import { join } from 'path';

const DB_PING_TIMEOUT_MS = 2000;

const { version } = JSON.parse(
  readFileSync(join(__dirname, '../../package.json'), 'utf-8'),
) as { version: string };

export interface HealthStatus {
  status: 'ok' | 'error';
  version: string;
  database: 'up' | 'down';
}

@Injectable()
export class HealthService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async check(): Promise<HealthStatus> {
    const database = await this.pingDatabase();
    return {
      status: database === 'up' ? 'ok' : 'error',
      version,
      database,
    };
  }

  private async pingDatabase(): Promise<'up' | 'down'> {
    try {
      await Promise.race([
        this.dataSource.query('SELECT 1'),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), DB_PING_TIMEOUT_MS),
        ),
      ]);
      return 'up';
    } catch {
      return 'down';
    }
  }
}
