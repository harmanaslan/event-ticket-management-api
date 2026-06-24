import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private client: Redis | null = null;
  private isAvailable = false;
  private unavailableLogged = false;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = this.configService.get<number>('REDIS_PORT', 6379);

    this.client = new Redis({
      host,
      port,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      retryStrategy: (times) => {
        if (times > 5) {
          return null;
        }

        return Math.min(times * 500, 3000);
      },
    });

    this.client.on('ready', () => {
      const reconnected = this.unavailableLogged;
      this.isAvailable = true;
      this.unavailableLogged = false;

      if (reconnected) {
        this.logger.log(`Redis reconnected at ${host}:${port}`);
      } else {
        this.logger.log(`Redis connected at ${host}:${port}`);
      }
    });

    this.client.on('error', () => {
      this.markUnavailable();
    });

    this.client.on('end', () => {
      this.markUnavailable();
    });
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isCacheUsable()) {
      return null;
    }

    try {
      const value = await this.client!.get(key);

      if (!value) {
        return null;
      }

      return JSON.parse(value) as T;
    } catch {
      this.markUnavailable();
      return null;
    }
  }

  async set(
    key: string,
    value: unknown,
    ttlSeconds = 60,
  ): Promise<void> {
    if (!this.isCacheUsable()) {
      return;
    }

    try {
      await this.client!.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch {
      this.markUnavailable();
    }
  }

  async del(key: string): Promise<void> {
    if (!this.isCacheUsable()) {
      return;
    }

    try {
      await this.client!.del(key);
    } catch {
      this.markUnavailable();
    }
  }

  private isCacheUsable(): boolean {
    return this.client !== null && this.isAvailable;
  }

  private markUnavailable(): void {
    this.isAvailable = false;

    if (!this.unavailableLogged) {
      this.unavailableLogged = true;
      this.logger.warn('Redis is not available, cache will be skipped.');
    }
  }
}
