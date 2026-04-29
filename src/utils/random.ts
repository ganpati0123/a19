/**
 * Deterministic-friendly random helpers.
 *
 * `seedRandom` lets us seed the PRNG so that mock screens render with a
 * stable shape across reloads. This avoids the jarring "skeleton flicker
 * and then everything moves around" effect that random data typically
 * produces.
 */

let _seed = 0x12345678;

export function seedRandom(seed: number) {
  _seed = seed >>> 0;
}

export function nextRandom(): number {
  _seed = (_seed * 1664525 + 1013904223) >>> 0;
  return _seed / 0xffffffff;
}

export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(nextRandom() * items.length)];
}

export function pickWeighted<T>(items: readonly { value: T; weight: number }[]): T {
  const total = items.reduce((acc, x) => acc + x.weight, 0);
  let r = nextRandom() * total;
  for (const item of items) {
    r -= item.weight;
    if (r <= 0) return item.value;
  }
  return items[items.length - 1].value;
}

export function range(min: number, max: number): number {
  return min + Math.floor(nextRandom() * (max - min + 1));
}

export function rangeFloat(min: number, max: number): number {
  return min + nextRandom() * (max - min);
}

export function sample<T>(items: readonly T[], count: number): T[] {
  const arr = [...items];
  const out: T[] = [];
  for (let i = 0; i < count && arr.length > 0; i += 1) {
    const idx = Math.floor(nextRandom() * arr.length);
    out.push(arr.splice(idx, 1)[0]);
  }
  return out;
}

export function shuffle<T>(items: readonly T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(nextRandom() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function chance(probability: number): boolean {
  return nextRandom() < probability;
}

/**
 * Returns a hex-style color hash for a given seed string. Used to pick
 * deterministic avatar/category colors without requiring a server.
 */
export function colorFor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const palette = [
    '#5A4BFF',
    '#1FB6FF',
    '#1BB76E',
    '#F4A622',
    '#E5484D',
    '#FF66C4',
    '#3D8BFF',
    '#3CDB95',
    '#7A4BFF',
    '#FF8A3D',
    '#0EA5E9',
    '#9333EA',
    '#10B981',
    '#F472B6',
    '#FACC15',
  ];
  return palette[h % palette.length];
}
