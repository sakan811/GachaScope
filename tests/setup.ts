import { beforeEach, vi } from 'vitest'

// Global test setup - simplified from original
beforeEach(() => {
  // Clear any previous mocks
  vi.clearAllMocks()
})

// Essential global mocks only
globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Chart.js mock for testing
vi.mock('chart.js', () => ({
  Chart: vi.fn(),
  registerables: []
}))

// Console cleanup for cleaner test output
global.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn()
}