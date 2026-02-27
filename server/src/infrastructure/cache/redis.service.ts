import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import type Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.constants';

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(@Inject(REDIS_CLIENT) private readonly client: Redis) {}

  async get<T = unknown>(key: string): Promise<T | null> {
    const raw = await this.client.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return raw as unknown as T;
    }
  }

  async set<T = unknown>(key: string, value: T, ttlSeconds?: number) {
    try {
      const payload = JSON.stringify(value);
      if (ttlSeconds && ttlSeconds > 0) {
        await this.client.set(key, payload, 'EX', ttlSeconds);
      } else {
        await this.client.set(key, payload);
      }
    } catch (err) {
      console.error(`[RedisService] Failed to set key "${key}":`, err);
    }
  }

  async del(key: string | string[]): Promise<number> {
    const keys = Array.isArray(key) ? key : [key];
    if (!keys.length) return 0;
    return this.client.del(...keys);
  }

  async delByPrefix(prefix: string): Promise<number> {
    const pattern = `${prefix}*`;
    let cursor = '0';
    let totalDeleted = 0;

    do {
      const [nextCursor, keys] = await this.client.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        1000,
      );
      cursor = nextCursor;

      if (keys.length) {
        totalDeleted += await this.client.del(...keys);
      }
    } while (cursor !== '0');

    return totalDeleted;
  }

  async flushAll(): Promise<'OK'> {
    return this.client.flushdb();
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
