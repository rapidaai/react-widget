import '@testing-library/jest-dom';

// jsdom doesn't implement scrollIntoView — stub it globally
window.Element.prototype.scrollIntoView = jest.fn();

// Stub window.chatbotConfig so configs/index.ts doesn't blow up at import time
Object.defineProperty(window, 'chatbotConfig', {
  value: {
    assistant_id: 'test-assistant-id',
    api_base: 'https://test.rapida.ai',
    token: 'test-token',
    user: { name: 'Test User', user_id: 'user-123' },
  },
  writable: true,
});

// Stub localStorage for EnvironmentProvider's userId persistence
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = v; },
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Silence known console.error noise (React warnings + expected app-level errors in tests)
const originalError = console.error;
beforeEach(() => {
  console.error = (...args: any[]) => {
    const msg = typeof args[0] === 'string' ? args[0] : '';
    if (
      msg.includes('Warning:') ||
      msg.includes('Please provide an assistant_id') ||
      msg.includes('Please provide an authentication token')
    ) return;
    originalError(...args);
  };
});
afterEach(() => {
  console.error = originalError;
});
