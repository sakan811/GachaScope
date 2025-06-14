import { vi } from 'vitest'

// Mock console.warn to reduce noise during tests
vi.spyOn(console, 'warn').mockImplementation(() => {})

// Mock localStorage if needed
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
})

// Mock Chart.js globally
vi.mock('chart.js', () => ({
  Chart: class MockChart {
    static register = vi.fn()
    constructor() {}
    destroy = vi.fn()
    update = vi.fn()
    render = vi.fn()
  },
  LineElement: {},
  PointElement: {},
  LineController: {},
  BarElement: {},
  BarController: {},
  CategoryScale: {},
  LinearScale: {},
  Title: {},
  Tooltip: {},
  Legend: {},
  Filler: {}
}))
