import { Prisma } from '@prisma/client';

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase());
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function keysToCamel<T = any>(input: T): any {
  // null / undefined → return as-is
  if (input === null || input === undefined) return input;

  // primitives → return as-is
  if (typeof input !== 'object') return input;

  // Dates: keep or convert to ISO string (pick one)
  if (input instanceof Date) {
    // option 1: keep Date object
    // return input;

    // option 2 (usually nicer for frontend): ISO string
    return input.toISOString();
  }

  // Prisma Decimal → convert to number (or string if you prefer)
  if (Prisma.Decimal && input instanceof Prisma.Decimal) {
    return input.toNumber(); // or input.toString()
  }

  // Arrays
  if (Array.isArray(input)) {
    return input.map((item) => keysToCamel(item));
  }

  // Only transform plain objects (not Dates, Decimals, Buffers, etc.)
  if (!isPlainObject(input)) {
    return input;
  }

  const result: any = {};
  for (const key of Object.keys(input)) {
    const camelKey = toCamelCase(key);
    result[camelKey] = keysToCamel((input as any)[key]);
  }
  return result;
}
