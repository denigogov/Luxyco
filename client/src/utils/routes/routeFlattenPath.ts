export function flattenIncludePaths(includePaths: any): string[] {
  const result: string[] = [];

  function scan(obj: any) {
    if (!obj || typeof obj !== "object") return;

    for (const key in obj) {
      const value = obj[key];

      if (value === true) {
        result.push(key);
        continue;
      }

      if (value === false) continue;

      if (typeof value === "object") {
        scan(value);
      }
    }
  }

  scan(includePaths);
  return result;
}
