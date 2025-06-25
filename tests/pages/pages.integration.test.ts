import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AnalysisPage from '~/pages/games/[gameId]/analysis.vue'

// Mock heavy dependencies
vi.mock('chart.js', () => ({
  Chart: {
    register: vi.fn(),
  },
  CategoryScale: vi.fn(),
  LinearScale: vi.fn(),
  PointElement: vi.fn(),
  LineElement: vi.fn(),
  BarElement: vi.fn(),
  Title: vi.fn(),
  Tooltip: vi.fn(),
  Legend: vi.fn(),
}))

vi.mock('vue-chartjs', () => ({
  Bar: {
    name: 'Bar',
    template: '<div data-testid="bar-chart">Bar Chart Mock</div>',
  },
  Scatter: {
    name: 'Scatter',
    template: '<div data-testid="scatter-chart">Scatter Chart Mock</div>',
  },
}))

// Mock composables
vi.mock('~/composables/useGameAnalysis', () => ({
  useGameAnalysis: () => ({
    getProcessedPackages: vi.fn(() => ({
      subscription: [
        { id: 1, name: 'Express Supply Pass', price: 4.99, totalAmount: 300, pullsFromPackage: 0, leftoverAmount: 300, costPerPull: Infinity },
        { id: 2, name: 'Nameless Glory', price: 9.99, totalAmount: 680, pullsFromPackage: 4, leftoverAmount: 40, costPerPull: 2.50 },
      ],
      battle_pass: [
        { id: 3, name: 'Nameless Medal', price: 9.99, totalAmount: 680, pullsFromPackage: 4, leftoverAmount: 40, costPerPull: 2.50 },
      ],
    })),
    generateChartsFromPackages: vi.fn(() => ({
      scatterData: [{ x: 4.99, y: 0, type: 'subscription', packageName: 'Express Supply Pass' }],
      barData: { subscription: [{ package: 'Express Supply Pass', costPerPull: Infinity }] },
    })),
  }),
}))

vi.mock('~/composables/useChartConfig', () => ({
  useChartConfig: () => ({
    packageTypeColors: {
      subscription: { bg: 'rgba(59, 130, 246, 0.7)', border: 'rgb(59, 130, 246)' },
      battle_pass: { bg: 'rgba(147, 51, 234, 0.7)', border: 'rgb(147, 51, 234)' },
    },
    typeLabels: {
      subscription: 'Subscription',
      battle_pass: 'Battle Pass',
    },
    createChartOptions: vi.fn(() => ({})),
  }),
}))

describe('Pages Integration', () => {
  describe('Analysis Page', () => {
    it('renders page for HSR', async () => {
      const component = await mountSuspended(AnalysisPage, {
        route: '/games/hsr/analysis',
      })

      expect(component.text()).toContain('Honkai: Star Rail')
      expect(component.text()).toContain('In-App Purchase Analysis')
    }, 15000)

    it('shows subscription section', async () => {
      const component = await mountSuspended(AnalysisPage, {
        route: '/games/hsr/analysis',
      })

      expect(component.text()).toContain('Subscription')
      expect(component.text()).toContain('Express Supply Pass')
      expect(component.text()).toContain('$4.99')
    }, 15000)

    it('displays battle pass section', async () => {
      const component = await mountSuspended(AnalysisPage, {
        route: '/games/hsr/analysis',
      })

      expect(component.text()).toContain('Battle Pass')
      expect(component.text()).toContain('Nameless Medal')
    }, 15000)

    it('renders chart components', async () => {
      const component = await mountSuspended(AnalysisPage, {
        route: '/games/hsr/analysis',
      })

      expect(component.html()).toContain('data-testid="bar-chart"')
      expect(component.html()).toContain('data-testid="scatter-chart"')
    }, 15000)
  })

  describe('Index Page', () => {
    it('renders game selection', async () => {
      const IndexPage = await import('~/pages/index.vue')
      const component = await mountSuspended(IndexPage.default)

      expect(component.text()).toContain('Honkai: Star Rail')
    }, 10000)
  })

  describe('Navigation', () => {
    it('handles HSR route correctly', async () => {
      const component = await mountSuspended(AnalysisPage, {
        route: '/games/hsr/analysis',
      })

      // Check that the page renders the correct game content instead of looking for 'hsr'
      expect(component.text()).toContain('Honkai: Star Rail')
      expect(component.text()).toContain('Back to Home')
      expect(component.text()).toContain('In-App Purchase Analysis')
    }, 10000)
  })
})
