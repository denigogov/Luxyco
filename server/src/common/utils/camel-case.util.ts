function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase());
}

export function keysToCamel<T = any>(input: T): any {
  if (Array.isArray(input)) {
    return input.map((item) => keysToCamel(item));
  }

  if (input !== null && typeof input === 'object') {
    const result: any = {};
    for (const key of Object.keys(input)) {
      const camelKey = toCamelCase(key);
      result[camelKey] = keysToCamel((input as any)[key]);
    }
    return result;
  }

  return input;
}
