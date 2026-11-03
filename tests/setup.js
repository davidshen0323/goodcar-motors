import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
afterEach(() => {
  cleanup();
  globalThis.localStorage?.clear();
});
Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
  value: function () {
    this.open = true;
  },
});
Object.defineProperty(HTMLDialogElement.prototype, 'close', {
  value: function () {
    this.open = false;
  },
});
