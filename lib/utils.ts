// utils.ts

type Entry<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T];

export function filterObject<T extends object>(obj: T, fn: (entry: Entry<T>, i: number, arr: Entry<T>[]) => boolean) {
  return Object.fromEntries((Object.entries(obj) as Entry<T>[]).filter(fn)) as Partial<T>;
}

/** Key type is limited due to https://github.com/microsoft/TypeScript/pull/37457 */
export function mapValues<I, O>(obj: Record<string, I>, fn: (value: I) => O): Record<string, O> {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fn(v)]));
}
