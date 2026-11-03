import { it, expect } from 'vitest';
import { createId } from '../src/shared/lib/id';
it('supports HTTP previews without randomUUID', () => {
  const id = createId({ getRandomValues: (bytes) => bytes.fill(10) });
  expect(id).toBe('0a'.repeat(16));
});
