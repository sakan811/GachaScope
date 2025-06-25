import { beforeEach, vi } from 'vitest'

// Global test setup - comprehensive mocking for stability
beforeEach(() => {
  vi.clearAllMocks()
})

// Essential DOM mocks
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))
}

// Mock window for SSR compatibility
if (typeof window === 'undefined') {
  Object.defineProperty(globalThis, 'window', {
    value: {
      innerWidth: 1024,
      innerHeight: 768,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    },
    writable: true,
  })
}

// Chart.js comprehensive mock - must be global for all tests
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
  defaults: {
    responsive: true,
    maintainAspectRatio: false,
  },
}))

// Vue-chartjs lightweight mock components
vi.mock('vue-chartjs', () => ({
  Bar: {
    name: 'MockBar',
    template: '<div data-testid="bar-chart" class="h-80 w-full bg-gray-100 flex items-center justify-center"><span>Bar Chart</span></div>',
    props: ['data', 'options'],
    mounted() {
      // Simulate chart ready
      this.$nextTick(() => {
        this.$emit('chart-ready')
      })
    },
  },
  Scatter: {
    name: 'MockScatter', 
    template: '<div data-testid="scatter-chart" class="h-80 w-full bg-gray-100 flex items-center justify-center"><span>Scatter Chart</span></div>',
    props: ['data', 'options'],
    mounted() {
      this.$nextTick(() => {
        this.$emit('chart-ready')
      })
    },
  },
}))

// Mock heavy composables globally
vi.mock('~/composables/useChartConfig', () => ({
  useChartConfig: () => ({
    packageTypeColors: {
      normal: { bg: 'rgba(239, 68, 68, 0.7)', border: 'rgb(239, 68, 68)' },
      first_time_bonus: { bg: 'rgba(34, 197, 94, 0.7)', border: 'rgb(34, 197, 94)' },
      subscription: { bg: 'rgba(59, 130, 246, 0.7)', border: 'rgb(59, 130, 246)' },
      battle_pass: { bg: 'rgba(147, 51, 234, 0.7)', border: 'rgb(147, 51, 234)' },
    },
    typeLabels: {
      normal: 'Normal Purchase',
      first_time_bonus: 'First Time Bonus',
      subscription: 'Subscription',
      battle_pass: 'Battle Pass',
    },
    createChartOptions: vi.fn(() => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: true } },
      scales: { x: { display: true }, y: { display: true } },
    })),
  }),
}))

vi.mock('~/composables/useGameAnalysis', () => ({
  useGameAnalysis: () => ({
    getProcessedPackages: vi.fn(() => ({
      normal: [
        { 
          id: 'test1', 
          name: 'Test Package 1', 
          price: 9.99, 
          totalAmount: 1000, 
          pullsFromPackage: 6, 
          leftoverAmount: 40, 
          costPerPull: 1.67 
        },
        { 
          id: 'test2', 
          name: 'Test Package 2', 
          price: 19.99, 
          totalAmount: 2000, 
          pullsFromPackage: 12, 
          leftoverAmount: 80, 
          costPerPull: 1.66 
        },
      ],
      first_time_bonus: [
        { 
          id: 'bonus1', 
          name: 'Bonus Package 1', 
          price: 9.99, 
          totalAmount: 2000, 
          pullsFromPackage: 12, 
          leftoverAmount: 80, 
          costPerPull: 0.83 
        },
      ],
    })),
    generateChartsFromPackages: vi.fn(() => ({
      scatterData: [
        { x: 6, y: 9.99, type: 'normal', packageName: 'Test Package 1' },
        { x: 12, y: 9.99, type: 'first_time_bonus', packageName: 'Bonus Package 1' },
      ],
      barData: { 
        normal: [{ package: 'Test Package 1', costPerPull: 1.67 }],
        first_time_bonus: [{ package: 'Bonus Package 1', costPerPull: 0.83 }],
      },
    })),
    analyzeGame: vi.fn(() => ({
      gameId: 'hsr',
      scenarios: {},
      chartData: { costVsPulls: [], efficiency: [], savings: [] },
      insights: {
        maxSavings: 10.5,
        bestPackage: {
          id: 'test1',
          name: 'Test Package 1',
          price: 9.99,
          costPerPull: 1.67,
        },
        bestScenario: {
          id: 'test_scenario',
          name: 'Test Scenario',
          description: 'Test',
          packages: [],
          totalCost: 5.99,
          totalAmount: 360,
          totalPulls: 2,
          leftoverAmount: 40,
          efficiency: 60.1,
          costPerPull: 2.995,
        },
        avgSavings: 8.2,
        bestPackageName: 'Test Package 1',
      },
    })),
  }),
}))

// Console cleanup for cleaner test output
const originalConsole = global.console
global.console = {
  ...originalConsole,
  warn: vi.fn(),
  error: (...args) => {
    const message = args.join(' ')
    if (!message.includes('ResizeObserver') && 
        !message.includes('Chart.js') && 
        !message.includes('vue-chartjs') &&
        !message.includes('canvas') &&
        !message.includes('Context conflict')) {
      originalConsole.error(...args)
    }
  },
}