import { setup } from '@nuxt/test-utils'
import { beforeAll, afterAll, beforeEach, vi } from 'vitest'
import { config } from '@vue/test-utils'

// Initialize Nuxt for integration tests only
beforeAll(async () => {
  // Only setup Nuxt for integration/e2e tests
  if (process.env.VITEST_ENV === 'nuxt' || process.env.VITEST_ENVIRONMENT === 'nuxt') {
    await setup({
      setupTimeout: 30000,
      rootDir: process.cwd(),
      server: true,
    })
  }
})

// Clean up after tests
afterAll(() => {
  vi.restoreAllMocks()
  if (typeof document !== 'undefined') {
    document.body.innerHTML = ''
  }
})

// Essential mocks
beforeEach(() => {
  vi.clearAllMocks()
})

// ResizeObserver mock for all environments
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))
}

// Chart.js mock for all environments
vi.mock('chart.js', () => ({
  Chart: vi.fn().mockImplementation(() => ({
    destroy: vi.fn(),
    update: vi.fn(),
    render: vi.fn(),
    resize: vi.fn(),
    data: { datasets: [] },
    options: {},
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
  defaults: { responsive: true, maintainAspectRatio: false },
}))

// Vue-chartjs mock for all environments
vi.mock('vue-chartjs', () => ({
  Bar: {
    name: 'MockBar',
    template: '<div data-testid="bar-chart">Bar Chart</div>',
    props: ['data', 'options'],
  },
  Scatter: {
    name: 'MockScatter', 
    template: '<div data-testid="scatter-chart">Scatter Chart</div>',
    props: ['data', 'options'],
  },
}))

// Environment-specific mocking
const isNuxtEnv = process.env.VITEST_ENV === 'nuxt' || process.env.VITEST_ENVIRONMENT === 'nuxt'
const isJsdomEnv = process.env.VITEST_ENV === 'jsdom' || process.env.VITEST_ENVIRONMENT === 'jsdom'

if (isJsdomEnv) {
  // Unit tests - unmock composables to test real implementations
  vi.unmock('~/composables/useGameAnalysis')
  vi.unmock('~/composables/useChartConfig')
} else if (isNuxtEnv) {
  // Integration tests - mock composables for lightweight testing
  vi.mock('~/composables/useChartConfig', () => ({
    useChartConfig: () => ({
      packageTypeColors: {
        normal: { bg: 'rgba(239, 68, 68, 0.7)', border: 'rgb(239, 68, 68)' },
        first_time_bonus: { bg: 'rgba(34, 197, 94, 0.7)', border: 'rgb(34, 197, 94)' },
      },
      typeLabels: {
        normal: 'Normal Purchase',
        first_time_bonus: 'First Time Bonus',
      },
      createChartOptions: vi.fn(() => ({
        responsive: true,
        maintainAspectRatio: false,
      })),
    }),
  }))

  vi.mock('~/composables/useGameAnalysis', () => ({
    useGameAnalysis: () => ({
      getProcessedPurchases: vi.fn(() => ({
        normal: [
          { 
            id: 'test1', 
            name: 'Test Purchase 1', 
            price: 9.99, 
            totalAmount: 1000, 
            pullsFromPurchase: 6, 
            leftoverAmount: 40, 
            costPerPull: 1.67 
          },
        ],
      })),
      generateChartsFromPurchases: vi.fn(() => ({
        scatterData: [
          { x: 6, y: 9.99, type: 'normal', purchaseName: 'Test Purchase 1' },
        ],
        barData: { 
          normal: [{ purchase: 'Test Purchase 1', costPerPull: 1.67 }],
        },
      })),
    }),
  }))
}

// Global Vue test utils config
config.global.mocks = {
  $t: (text: string) => text,
}

// Console cleanup
const originalConsole = global.console
global.console = {
  ...originalConsole,
  warn: vi.fn(),
  error: (...args) => {
    const message = args.join(' ')
    if (!message.includes('ResizeObserver') && 
        !message.includes('Chart.js') && 
        !message.includes('Context conflict')) {
      originalConsole.error(...args)
    }
  },
}