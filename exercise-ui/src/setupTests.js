import '@testing-library/jest-dom';

// Prevent fetch calls from throwing unhandled rejections in tests
global.fetch = vi.fn(() => Promise.resolve({ json: () => Promise.resolve([]) }));
