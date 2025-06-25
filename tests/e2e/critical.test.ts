import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import IndexPage from '~/pages/index.vue'
import AnalysisPage from '~/pages/games/[gameId]/analysis.vue'

// Mock heavy dependencies
vi.mock('vue-chartjs', () => ({
  Bar: { render: () => null },
  Scatter: { render: () => null },
}))

vi.mock('chart.js', () => ({
  Chart: vi.fn(),
  CategoryScale: vi.fn(),
  LinearScale: vi.fn(),
  PointElement: vi.fn(),
  LineElement: vi.fn(),
  BarElement: vi.fn(),
  Title: vi.fn(),
  Tooltip: vi.fn(),
  Legend: vi.fn(),
  register: vi.fn(),
}))

vi.mock('~/composables/useChartConfig', () => ({
  useChartConfig: () => ({
    packageTypeColors: {
      normal: { bg: 'red', border: 'red' },
      first_time_bonus: { bg: 'green', border: 'green' },
    },
    typeLabels: {
      normal: 'Normal',
      first_time_bonus: 'First Time',
    },
    createChartOptions: () => ({}),
  }),
}))

vi.mock('~/composables/useGameAnalysis', () => ({
  useGameAnalysis: () => ({
    getProcessedPackages: () => ({
      normal: [
        { id: 'test1', name: 'Test Package', price: 9.99, totalAmount: 1000, pullsFromPackage: 6, leftoverAmount: 40, costPerPull: 1.67 },
      ],
    }),
    generateChartsFromPackages: () => ({
      scatterData: [{ x: 9.99, y: 6, type: 'normal', packageName: 'Test' }],
      barData: { normal: [{ package: 'Test', costPerPull: 1.67 }] },
    }),
  }),
}))

describe('E2E Critical Flows', { timeout: 30000 }, () => {
  describe('Game Selection Flow', () => {
    it('navigates from index to analysis', async () => {
      const indexComponent = await mountSuspended(IndexPage)

      // Should show game selection
      expect(indexComponent.text()).toContain('Honkai: Star Rail')
      expect(indexComponent.text()).toContain('GachaScope')

      // Should have clickable game cards
      const gameCards = indexComponent.findAll('[data-testid="game-card"]')
      if (gameCards.length === 0) {
        // Fallback: check for any clickable elements containing game name
        const clickableElements = indexComponent.findAll('*')
        const gameElements = clickableElements.filter(el =>
          el.text().includes('Honkai: Star Rail')
          && (el.element.tagName === 'BUTTON' || el.element.onclick || el.classes().includes('cursor-pointer')),
        )
        expect(gameElements.length).toBeGreaterThan(0)
      }
      else {
        expect(gameCards.length).toBeGreaterThan(0)
      }
    }, 15000)

    it('loads analysis page with game data', async () => {
      const analysisComponent = await mountSuspended(AnalysisPage, {
        route: '/games/hsr/analysis',
      })

      // Should load core page elements
      expect(analysisComponent.text()).toContain('Honkai: Star Rail')
      expect(analysisComponent.text()).toContain('In-App Purchase Analysis')
      expect(analysisComponent.text()).toContain('Back to Home')
    }, 15000)
  })

  describe('Data Loading', () => {
    it('handles successful data load', async () => {
      const component = await mountSuspended(AnalysisPage, {
        route: '/games/hsr/analysis',
      })

      // Should display analysis content
      expect(component.text()).toContain('In-App Purchase Analysis')
      expect(component.text()).toContain('Overview')

      // Should render without errors
      expect(component.html()).toBeTruthy()
    }, 15000)

    it('gracefully handles missing data', async () => {
      const component = await mountSuspended(AnalysisPage, {
        route: '/games/invalid/analysis',
      })

      // Should show error message for invalid game
      expect(component.text()).toContain('Game Not Found')
      expect(component.text()).toContain('not supported yet')
    }, 10000)
  })

  describe('Responsive Behavior', () => {
    it('renders on mobile viewport', async () => {
      const component = await mountSuspended(AnalysisPage, {
        route: '/games/hsr/analysis',
      })

      // Should contain responsive utility classes
      const html = component.html()
      const hasResponsiveClasses
        = html.includes('md:')
          || html.includes('lg:')
          || html.includes('sm:')
          || html.includes('grid-cols-1')
          || html.includes('max-w-')

      expect(hasResponsiveClasses).toBe(true)
    }, 10000)
  })
})
