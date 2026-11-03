/** Local record identifiers; supports browsers without randomUUID on HTTP previews. */
export function createId(cryptoSource = globalThis.crypto) {
  if (typeof cryptoSource?.randomUUID === 'function')
    return cryptoSource.randomUUID();
  const bytes = cryptoSource.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join(
    '',
  );
}
