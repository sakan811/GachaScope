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

// Chart.js mock for testing - more comprehensive
vi.mock('chart.js', () => ({
  Chart: vi.fn().mockImplementation(() => ({
    destroy: vi.fn(),
    update: vi.fn(),
    render: vi.fn(),
  })),
  CategoryScale: vi.fn(),
  LinearScale: vi.fn(),
  PointElement: vi.fn(),
  LineElement: vi.fn(),
  BarElement: vi.fn(),
  Title: vi.fn(),
  Tooltip: vi.fn(),
  Legend: vi.fn(),
  register: vi.fn(),
  registerables: [],
}))

// Vue-chartjs mock
vi.mock('vue-chartjs', () => ({
  Bar: {
    name: 'Bar',
    template: '<div data-testid="bar-chart">Bar Chart</div>',
    props: ['data', 'options'],
  },
  Scatter: {
    name: 'Scatter',
    template: '<div data-testid="scatter-chart">Scatter Chart</div>',
    props: ['data', 'options'],
  },
}))

// Console cleanup for cleaner test output
const originalConsole = global.console
global.console = {
  ...originalConsole,
  warn: vi.fn(),
  error: (...args) => {
    // Still log actual errors but filter out known test warnings
    const message = args.join(' ')
    if (!message.includes('ResizeObserver') && !message.includes('Chart.js')) {
      originalConsole.error(...args)
    }
  },
}
