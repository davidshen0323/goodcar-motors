export const STORAGE_EVENT = 'application-storage-change';
export type StorageReader = Pick<Storage, 'getItem'>;
export function readStored<T>(
  key: string,
  fallback: T,
  storage?: StorageReader,
): T {
  try {
    const raw = (storage ?? window.localStorage).getItem(key);
    if (raw === null) return structuredClone(fallback);
    const value: unknown = JSON.parse(raw);
    if (Array.isArray(fallback) && !Array.isArray(value))
      return structuredClone(fallback);
    if (value === null || typeof value !== typeof fallback)
      return structuredClone(fallback);
    return value as T;
  } catch {
    return structuredClone(fallback);
  }
}
export function writeStored<T>(
  key: string,
  value: T,
  storage?: Pick<Storage, 'setItem'>,
) {
  (storage ?? window.localStorage).setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key } }));
}
