export const calcM2 = (width: string, height: string) => {
  const w = Number(width);
  const h = Number(height);

  if (!Number.isFinite(w) || !Number.isFinite(h)) return 0;
  if (w <= 0 || h <= 0) return 0;

  return w * h;
};
