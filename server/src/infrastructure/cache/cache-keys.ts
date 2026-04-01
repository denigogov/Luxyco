// src/infrastructure/cache/cache-keys.ts
import { createHash } from 'crypto';

type Primitive = string | number | boolean | null;
type JSONValue = Primitive | JSONValue[] | { [k: string]: JSONValue };

// type guard to help TS narrow out undefined
function isDefined<T>(v: T | undefined | null): v is T {
  return v !== undefined && v !== null;
}

/**
 * Normalize query-like objects so semantically equivalent inputs
 * produce the same cache key.
 *
 * - removes undefined/null/""
 * - trims strings
 * - coerces numeric strings -> numbers
 * - sorts object keys recursively
 * - sorts arrays of primitives (so "3,1" == "1,3")
 */
export function normalizeForCacheKey(value: any): JSONValue | undefined {
  if (value === undefined || value === null) return undefined;

  // strings
  if (typeof value === 'string') {
    const s = value.trim();
    if (s === '') return undefined;

    // numeric string -> number
    if (/^-?\d+(\.\d+)?$/.test(s)) {
      const n = Number(s);
      if (Number.isFinite(n)) return n;
    }
    return s;
  }

  // numbers / booleans
  if (typeof value === 'number')
    return Number.isFinite(value) ? value : undefined;
  if (typeof value === 'boolean') return value;

  // arrays
  if (Array.isArray(value)) {
    const normalizedItems = value
      .map((v) => normalizeForCacheKey(v))
      .filter(isDefined);

    if (normalizedItems.length === 0) return undefined;

    const allPrimitive = normalizedItems.every(
      (v) => v === null || ['string', 'number', 'boolean'].includes(typeof v),
    );

    if (allPrimitive) {
      return (normalizedItems as Primitive[])
        .slice()
        .sort((a, b) => String(a).localeCompare(String(b)));
    }

    return normalizedItems;
  }

  // objects
  if (typeof value === 'object') {
    const obj = value as Record<string, any>;

    const entries = Object.keys(obj)
      .sort()
      .map((k) => [k, normalizeForCacheKey(obj[k])] as const)
      .filter((pair): pair is readonly [string, JSONValue] =>
        isDefined(pair[1]),
      );

    if (entries.length === 0) return undefined;

    const out: Record<string, JSONValue> = {};
    for (const [k, v] of entries) {
      out[k] = v; //  v is JSONValue
    }
    return out;
  }

  return undefined;
}

export function buildCacheKey(args: {
  namespace?: string; // "luxyco"
  module: string; // "customers" | "orders"
  scope: string; // "list" | "detail"
  version?: string; // "v1"
  query?: any;
}): string {
  const { namespace = 'luxyco', module, scope, version = 'v1', query } = args;

  const normalized = normalizeForCacheKey(query) ?? {};
  const serialized = JSON.stringify(normalized);

  const hash = createHash('md5').update(serialized).digest('hex');

  return `${namespace}:${module}:${scope}:${version}:${hash}`;
}

export function buildCustomersListCacheKey(query: any) {
  return buildCacheKey({
    module: 'customers',
    scope: 'list',
    query,
  });
}

export function buildCustomersOrderListCacheKey(query: any) {
  return buildCacheKey({
    module: 'customers',
    scope: 'order-list',
    query,
  });
}

export function buildOrdersListCacheKey(query: any) {
  return buildCacheKey({
    module: 'orders',
    scope: 'list',
    query,
  });
}

export function buildCustomerDetailCacheKey(args: {
  id: number;
  isActive: boolean;
}) {
  return buildCacheKey({
    module: 'customers',
    scope: 'detail',
    query: args,
  });
}

export function buildStatusListCacheKey() {
  return buildCacheKey({
    module: 'status',
    scope: 'list',
  });
}

export function buildDeliveryTypeListCacheKey() {
  return buildCacheKey({
    module: 'delivery-type',
    scope: 'list',
  });
}
export function buildServiceTypeListCacheKey() {
  return buildCacheKey({
    module: 'service-type',
    scope: 'list',
  });
}
export function buildOrderReferencesListCacheKey() {
  return buildCacheKey({
    module: 'orders',
    scope: 'references',
  });
}
