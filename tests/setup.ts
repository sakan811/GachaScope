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

// Mock @nuxtjs/color-mode module and all its runtime components completely
vi.mock('@nuxtjs/color-mode', () => ({
  default: {},
  useColorMode: () => ({
    preference: 'system',
    value: 'light',
    unknown: false,
    forced: false,
    setColorTheme: vi.fn(),
    removeColorScheme: vi.fn(),
  }),
}))

// Mock the specific runtime files that cause resolution issues with full function definitions
vi.mock('@nuxtjs/color-mode/dist/runtime/plugin.client.js', () => ({
  default: function defineNuxtPlugin() {
    return {
      name: 'color-mode-mock-client',
      setup: vi.fn(() => Promise.resolve()),
    }
  },
}))

vi.mock('@nuxtjs/color-mode/dist/runtime/plugin.server.js', () => ({
  default: function defineNuxtPlugin() {
    return {
      name: 'color-mode-mock-server',
      setup: vi.fn(() => Promise.resolve()),
    }
  },
}))

vi.mock('@nuxtjs/color-mode/dist/runtime/composables.js', () => ({
  useColorMode: vi.fn(() => ({
    preference: 'system',
    value: 'light',
    unknown: false,
    forced: false,
    setColorTheme: vi.fn(),
    removeColorScheme: vi.fn(),
  })),
}))

// Mock Nuxt's internal color-mode aliases
vi.mock('#color-mode/client', () => ({
  default: {},
}))

vi.mock('#color-mode/server', () => ({
  default: {},
}))

// Mock #imports that color-mode plugins try to use
vi.mock('#imports', () => ({
  useState: vi.fn(_key => ({
    value: {
      preference: 'system',
      value: 'light',
      unknown: false,
      forced: false,
    },
  })),
  defineNuxtPlugin: vi.fn(fn => fn),
  useNuxtApp: vi.fn(() => ({})),
  useCookie: vi.fn(() => ({ value: null })),
}))

// Global fallback for useColorMode in all test environments
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
  globalThis.useColorMode = vi.fn(() => ({
    preference: 'system',
    value: 'light',
    unknown: false,
    forced: false,
    setColorTheme: vi.fn(),
    removeColorScheme: vi.fn(),
  }))
}

// Environment-specific mocking
const isNuxtEnv = process.env.VITEST_ENV === 'nuxt' || process.env.VITEST_ENVIRONMENT === 'nuxt'
const isJsdomEnv = process.env.VITEST_ENV === 'jsdom' || process.env.VITEST_ENVIRONMENT === 'jsdom'

if (isJsdomEnv) {
  // Unit tests - unmock composables and utils to test real implementations
  vi.unmock('~/composables/useGameAnalysis')
  vi.unmock('~/composables/useChartConfig')
  vi.unmock('~/utils/gameRegistry')
}
else if (isNuxtEnv) {
  // Integration tests - mock composables and utils for lightweight testing

  // Mock useColorMode for Nuxt environment - don't use mockNuxtImport as it causes issues
  // The composable will be available through the global mock above
  vi.mock('~/utils/gameRegistry', () => ({
    getGameById: vi.fn((gameId: string) => {
      if (gameId === 'hsr') {
        return {
          metadata: {
            id: 'hsr',
            name: 'Honkai: Star Rail',
            shortName: 'HSR',
            currency: { name: 'Oneiric Shards', shortName: 'Shards' },
            pull: { name: 'Warp', cost: 160 },
            analysisConfig: { maxScenarios: 50, includeMultiPackage: true, maxPackageMultiplier: 3 },
          },
          packages: {
            normal: [{ id: 'test1', name: 'Test Package', baseAmount: 1000, price: 9.99, extraAmount: 0, purchaseType: 'normal', currency: 'shards' }],
            first_time_bonus: [{ id: 'test2', name: 'Test Bonus Package', baseAmount: 2000, price: 9.99, extraAmount: 0, purchaseType: 'first_time_bonus', currency: 'shards' }],
          },
        }
      }
      return null
    }),
    getAllGames: vi.fn(() => [{
      metadata: {
        id: 'hsr',
        name: 'Honkai: Star Rail',
        shortName: 'HSR',
        currency: { name: 'Oneiric Shards', shortName: 'Shards' },
        pull: { name: 'Warp', cost: 160 },
        analysisConfig: { maxScenarios: 50, includeMultiPackage: true, maxPackageMultiplier: 3 },
      },
      packages: {
        normal: [{ id: 'test1', name: 'Test Package', baseAmount: 1000, price: 9.99, extraAmount: 0, purchaseType: 'normal', currency: 'shards' }],
        first_time_bonus: [{ id: 'test2', name: 'Test Bonus Package', baseAmount: 2000, price: 9.99, extraAmount: 0, purchaseType: 'first_time_bonus', currency: 'shards' }],
      },
    }]),
    getActiveGames: vi.fn(() => [{
      metadata: {
        id: 'hsr',
        name: 'Honkai: Star Rail',
        shortName: 'HSR',
        currency: { name: 'Oneiric Shards', shortName: 'Shards' },
        pull: { name: 'Warp', cost: 160 },
        analysisConfig: { maxScenarios: 50, includeMultiPackage: true, maxPackageMultiplier: 3 },
      },
      packages: {
        normal: [{ id: 'test1', name: 'Test Package', baseAmount: 1000, price: 9.99, extraAmount: 0, purchaseType: 'normal', currency: 'shards' }],
        first_time_bonus: [{ id: 'test2', name: 'Test Bonus Package', baseAmount: 2000, price: 9.99, extraAmount: 0, purchaseType: 'first_time_bonus', currency: 'shards' }],
      },
    }]),
    getGameMetadata: vi.fn((gameId: string) => {
      if (gameId === 'hsr') {
        return {
          id: 'hsr',
          name: 'Honkai: Star Rail',
          shortName: 'HSR',
          currency: { name: 'Oneiric Shards', shortName: 'Shards' },
          pull: { name: 'Warp', cost: 160 },
          analysisConfig: { maxScenarios: 50, includeMultiPackage: true, maxPackageMultiplier: 3 },
        }
      }
      return null
    }),
    isValidGameId: vi.fn((gameId: string) => gameId === 'hsr'),
    getGameNames: vi.fn(() => [{
      id: 'hsr',
      name: 'Honkai: Star Rail',
      shortName: 'HSR',
    }]),
    registerGame: vi.fn(),
  }))

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
      getProcessedPurchases: vi.fn((gameId: string) => {
        if (gameId === 'hsr') {
          return {
            normal: [
              {
                id: 'test1',
                name: 'Test Purchase 1',
                price: 9.99,
                totalAmount: 1000,
                pullsFromPurchase: 6,
                leftoverAmount: 40,
                costPerPull: 1.67,
              },
            ],
            first_time_bonus: [
              {
                id: 'test2',
                name: 'Test Purchase 2 (First Time)',
                price: 9.99,
                totalAmount: 2000,
                pullsFromPurchase: 12,
                leftoverAmount: 80,
                costPerPull: 0.83,
              },
            ],
          }
        }
        return null
      }),
      analyzeGame: vi.fn((gameId: string) => {
        if (gameId === 'hsr') {
          return {
            gameId,
            scenarios: {},
            chartData: { costVsPulls: [], efficiency: [], savings: [] },
            insights: {
              maxSavings: 5.50,
              bestPurchase: {
                id: 'test2',
                name: 'Test Purchase 2 (First Time)',
                price: 9.99,
                costPerPull: 0.83,
              },
              bestScenario: null,
              avgSavings: 2.75,
              bestPurchaseName: 'Test Purchase 2 (First Time)',
            },
          }
        }
        return null
      }),
      generateChartsFromPurchases: vi.fn(() => ({
        scatterData: [
          { x: 6, y: 9.99, type: 'normal', purchaseName: 'Test Purchase 1' },
          { x: 12, y: 9.99, type: 'first_time_bonus', purchaseName: 'Test Purchase 2 (First Time)' },
        ],
        barData: {
          normal: [{ purchase: 'Test Purchase 1', costPerPull: 1.67 }],
          first_time_bonus: [{ purchase: 'Test Purchase 2 (First Time)', costPerPull: 0.83 }],
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
    if (!message.includes('ResizeObserver')
      && !message.includes('Chart.js')
      && !message.includes('Context conflict')) {
      originalConsole.error(...args)
    }
  },
}
