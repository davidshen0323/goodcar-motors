import { useCallback, useEffect, useRef, useState } from 'react';
import { readStored, writeStored, STORAGE_EVENT } from '../lib/storage';
export type StoredUpdate<T> = (next: T | ((current: T) => T)) => boolean;
export function useStoredState<T>(
  key: string,
  fallback: T,
): [T, StoredUpdate<T>, string] {
  const initial = useRef(fallback);
  const [value, setValue] = useState<T>(() => readStored(key, initial.current));
  const [error, setError] = useState('');
  const current = useRef(value);
  useEffect(() => {
    const sync = (event: Event) => {
      if (
        event instanceof StorageEvent &&
        event.key !== key &&
        event.key !== null
      )
        return;
      if (event instanceof CustomEvent && event.detail.key !== key) return;
      const next = readStored(key, initial.current);
      current.current = next;
      setValue(next);
    };
    window.addEventListener('storage', sync);
    window.addEventListener(STORAGE_EVENT, sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener(STORAGE_EVENT, sync);
    };
  }, [key]);
  const update = useCallback<StoredUpdate<T>>(
    (next) => {
      const resolved =
        typeof next === 'function'
          ? (next as (current: T) => T)(current.current)
          : next;
      try {
        writeStored(key, resolved);
        current.current = resolved;
        setValue(resolved);
        setError('');
        return true;
      } catch {
        setError('無法儲存資料，請確認瀏覽器儲存空間後重試。');
        return false;
      }
    },
    [key],
  );
  return [value, update, error];
}
