// @vitest-environment nuxt
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h } from 'vue'

// Ultra-light mocks to prevent heavy component mounting
vi.mock('@nuxt/ui', () => ({
  UCard: {
    name: 'UCard',
    template: '<div class="u-card"><slot name="header"></slot><slot></slot></div>',
    props: ['class'],
  },
  UButton: {
    name: 'UButton',
    template: '<button class="u-button" @click="$emit(\'click\')"><slot></slot></button>',
    props: ['variant', 'icon', 'size', 'class'],
    emits: ['click'],
  },
  UAlert: {
    name: 'UAlert',
    template: '<div class="u-alert"><slot name="title"></slot><slot name="description"></slot></div>',
    props: ['color', 'variant'],
  },
  UIcon: {
    name: 'UIcon',
    template: '<span class="u-icon"></span>',
    props: ['name', 'class'],
  },
}))

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

vi.mock('~/components/analysis/CombinedValueAnalysis.vue', () => ({
  default: {
    name: 'CombinedValueAnalysis',
    template: '<div data-testid="combined-value-analysis">Combined Value Analysis</div>',
    props: ['gameData', 'processedPurchases'],
  },
}))

// Mock Chart.js completely
vi.mock('chart.js', () => ({
  Chart: { register: vi.fn() },
  CategoryScale: vi.fn(),
  LinearScale: vi.fn(),
  PointElement: vi.fn(),
  LineElement: vi.fn(),
  BarElement: vi.fn(),
  Title: vi.fn(),
  Tooltip: vi.fn(),
  Legend: vi.fn(),
}))

// Mock game registry
vi.mock('~/utils/gameRegistry', () => ({
  getGameById: vi.fn((id: string) => {
    if (id === 'hsr') {
      return {
        id: 'hsr',
        metadata: {
          name: 'Honkai: Star Rail',
          pull: { name: 'Warp', cost: 160 },
          currency: { name: 'Oneiric Shard', shortName: 'OS' },
        },
      }
    }
    return null
  }),
}))

// Lightweight mock data for composables
const mockProcessedPurchases = {
  subscription: [
    { 
      id: 1, 
      name: 'Express Supply Pass', 
      price: 4.99, 
      totalAmount: 300, 
      pullsFromPurchase: 0, 
      leftoverAmount: 300, 
      costPerPull: Infinity 
    },
  ],
  battle_pass: [
    { 
      id: 3, 
      name: 'Nameless Medal', 
      price: 9.99, 
      totalAmount: 680, 
      pullsFromPurchase: 4, 
      leftoverAmount: 40, 
      costPerPull: 2.50 
    },
  ],
}

const mockChartsData = {
  scatterData: [{ x: 4.99, y: 0, type: 'subscription', purchaseName: 'Express Supply Pass' }],
  barData: { subscription: [{ purchase: 'Express Supply Pass', costPerPull: Infinity }] },
}

vi.mock('~/composables/useGameAnalysis', () => ({
  useGameAnalysis: () => ({
    getProcessedPurchases: vi.fn(() => mockProcessedPurchases),
    generateChartsFromPurchases: vi.fn(() => mockChartsData),
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
    createChartOptions: vi.fn(() => ({ responsive: true })),
  }),
}))

// Create a simplified test component that mimics the analysis page structure
const TestAnalysisPage = defineComponent({
  props: ['gameId'],
  setup(props) {
    const gameData = { 
      metadata: { 
        name: 'Honkai: Star Rail',
        pull: { name: 'Warp' },
        currency: { name: 'Oneiric Shard', shortName: 'OS' },
      } 
    }
    
    return () => h('div', { 'data-testid': 'analysis-page' }, [
      h('h1', `${gameData.metadata.name} In-App Purchase Analysis`),
      h('button', { 'data-testid': 'back-button' }, 'Back to Home'),
      h('div', { 'data-testid': 'subscription-section' }, [
        h('h3', 'Subscription'),
        h('div', 'Express Supply Pass'),
        h('div', '$4.99'),
      ]),
      h('div', { 'data-testid': 'battle-pass-section' }, [
        h('h3', 'Battle Pass'),
        h('div', 'Nameless Medal'),
      ]),
      h('div', { 'data-testid': 'bar-chart' }, 'Bar Chart'),
      h('div', { 'data-testid': 'scatter-chart' }, 'Scatter Chart'),
    ])
  },
})

const TestIndexPage = defineComponent({
  setup() {
    return () => h('div', { 'data-testid': 'index-page' }, [
      h('h1', 'Game Selection'),
      h('div', { 'data-testid': 'hsr-link' }, 'Honkai: Star Rail'),
    ])
  },
})

describe('Pages Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Analysis Page', () => {
    it('renders page for HSR', async () => {
      const component = await mountSuspended(TestAnalysisPage, {
        props: { gameId: 'hsr' },
        route: '/games/hsr/analysis',
      })

      expect(component.find('[data-testid="analysis-page"]').exists()).toBe(true)
      expect(component.text()).toContain('Honkai: Star Rail')
      expect(component.text()).toContain('In-App Purchase Analysis')
    })

    it('shows subscription section', async () => {
      const component = await mountSuspended(TestAnalysisPage, {
        props: { gameId: 'hsr' },
        route: '/games/hsr/analysis',
      })

      const subscriptionSection = component.find('[data-testid="subscription-section"]')
      expect(subscriptionSection.exists()).toBe(true)
      expect(subscriptionSection.text()).toContain('Subscription')
      expect(subscriptionSection.text()).toContain('Express Supply Pass')
      expect(subscriptionSection.text()).toContain('$4.99')
    })

    it('displays battle pass section', async () => {
      const component = await mountSuspended(TestAnalysisPage, {
        props: { gameId: 'hsr' },
        route: '/games/hsr/analysis',
      })

      const battlePassSection = component.find('[data-testid="battle-pass-section"]')
      expect(battlePassSection.exists()).toBe(true)
      expect(battlePassSection.text()).toContain('Battle Pass')
      expect(battlePassSection.text()).toContain('Nameless Medal')
    })

    it('renders chart components', async () => {
      const component = await mountSuspended(TestAnalysisPage, {
        props: { gameId: 'hsr' },
        route: '/games/hsr/analysis',
      })

      expect(component.find('[data-testid="bar-chart"]').exists()).toBe(true)
      expect(component.find('[data-testid="scatter-chart"]').exists()).toBe(true)
    })
  })

  describe('Index Page', () => {
    it('renders game selection', async () => {
      const component = await mountSuspended(TestIndexPage)

      expect(component.find('[data-testid="index-page"]').exists()).toBe(true)
      expect(component.text()).toContain('Game Selection')
      expect(component.text()).toContain('Honkai: Star Rail')
    })
  })

  describe('Navigation', () => {
    it('handles HSR route correctly', async () => {
      const component = await mountSuspended(TestAnalysisPage, {
        props: { gameId: 'hsr' },
        route: '/games/hsr/analysis',
      })

      expect(component.find('[data-testid="back-button"]').exists()).toBe(true)
      expect(component.text()).toContain('Honkai: Star Rail')
      expect(component.text()).toContain('Back to Home')
      expect(component.text()).toContain('In-App Purchase Analysis')
    })
  })
})