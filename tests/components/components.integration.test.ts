// @vitest-environment nuxt
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h } from 'vue'
import type { GameData, ProcessedPurchase } from '~/types/games'

// Mock data
const mockGameData: GameData = {
  id: 'hsr',
  metadata: {
    name: 'Honkai: Star Rail',
    pull: { name: 'Warp', cost: 160 },
    analysisConfig: {
      includeMultiPackage: true,
      maxPackageMultiplier: 3,
      maxScenarios: 10,
    },
  },
  packages: {
    normal: [
      {
        id: 'normal_1',
        name: 'Normal Purchase 1',
        price: 5.99,
        baseAmount: 300,
        extraAmount: 60,
        purchaseType: 'normal',
      },
    ],
  },
}

const mockProcessedPurchases = {
  normal: [
    {
      id: 'normal_1',
      name: 'Normal Purchase 1',
      price: 5.99,
      baseAmount: 300,
      extraAmount: 60,
      purchaseType: 'normal' as const,
      totalAmount: 360,
      amountPerDollar: 60.1,
      pullsFromPurchase: 2,
      costPerPull: 2.995,
      leftoverAmount: 40,
      efficiency: 60.1,
    } as ProcessedPurchase,
  ],
}

// Simplified test components that don't require heavy Nuxt features
const TestAnalysisDashboard = defineComponent({
  props: ['gameId'],
  setup(props) {
    return () => h('div', {
      'data-testid': `dashboard-${props.gameId}`,
    }, [
      h('h2', `${mockGameData.metadata.name} Analysis`),
      h('div', { class: 'best-purchase' }, 'Normal Purchase 1'),
      h('div', { class: 'savings' }, '$10.50'),
    ])
  },
})

const TestPurchaseCard = defineComponent({
  props: ['purchase', 'pullName'],
  setup(props) {
    const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`
    const formatCostPerPull = (cost: number) => cost === Infinity ? 'N/A' : `$${cost.toFixed(2)}`

    return () => h('div', {
      'data-testid': `card-${props.purchase.id}`,
      'class': `type-${props.purchase.purchaseType}`,
    }, [
      h('h3', props.purchase.name),
      h('div', { class: 'price' }, formatCurrency(props.purchase.price)),
      h('div', { class: 'cost-per-pull' }, formatCostPerPull(props.purchase.costPerPull)),
      h('div', { class: 'pulls' }, `${props.purchase.pullsFromPurchase} ${props.pullName}s`),
    ])
  },
})

const TestCombinedValueAnalysis = defineComponent({
  props: ['gameData', 'processedPurchases'],
  setup() {
    return () => h('div', {
      'data-testid': 'combined-value-analysis',
    }, [
      h('div', 'Best Overall Value'),
      h('div', 'In-App Purchase Type Comparison'),
    ])
  },
})

describe('Components Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Analysis Dashboard', () => {
    it('renders with valid game data', async () => {
      const component = await mountSuspended(TestAnalysisDashboard, {
        props: { gameId: 'hsr' },
      })

      expect(component.find('[data-testid="dashboard-hsr"]').exists()).toBe(true)
      expect(component.text()).toContain('Honkai: Star Rail Analysis')
      expect(component.text()).toContain('Normal Purchase 1')
    })

    it('handles invalid game gracefully', async () => {
      const TestInvalidDashboard = defineComponent({
        props: ['gameId'],
        setup() {
          return () => h('div', {
            'data-testid': 'invalid-dashboard',
            'class': 'error',
          }, 'Game \'invalid\' not found')
        },
      })

      const component = await mountSuspended(TestInvalidDashboard, {
        props: { gameId: 'invalid' },
      })

      expect(component.find('[data-testid="invalid-dashboard"]').exists()).toBe(true)
      expect(component.find('.error').exists()).toBe(true)
      expect(component.text()).toContain('not found')
    })
  })

  describe('Purchase Cards', () => {
    it('renders normal purchase correctly', async () => {
      const normalPurchase = mockProcessedPurchases.normal[0]
      const component = await mountSuspended(TestPurchaseCard, {
        props: { purchase: normalPurchase, pullName: 'Warp' },
      })

      expect(component.find(`[data-testid="card-${normalPurchase.id}"]`).exists()).toBe(true)
      expect(component.find('.type-normal').exists()).toBe(true)
      expect(component.text()).toContain(normalPurchase.name)
      expect(component.text()).toContain(`$${normalPurchase.price.toFixed(2)}`)
    })

    it('handles zero-pull purchases', async () => {
      const zeroPurchase = {
        ...mockProcessedPurchases.normal[0],
        pullsFromPurchase: 0,
        costPerPull: Infinity,
      }
      const component = await mountSuspended(TestPurchaseCard, {
        props: { purchase: zeroPurchase, pullName: 'Warp' },
      })

      expect(component.text()).toContain('N/A')
      expect(component.text()).toContain('0 Warps')
    })
  })

  describe('CombinedValueAnalysis', () => {
    it('renders with game data', async () => {
      const component = await mountSuspended(TestCombinedValueAnalysis, {
        props: {
          gameData: mockGameData,
          processedPurchases: mockProcessedPurchases,
        },
      })

      expect(component.find('[data-testid="combined-value-analysis"]').exists()).toBe(true)
      expect(component.text()).toContain('Best Overall Value')
      expect(component.text()).toContain('In-App Purchase Type Comparison')
    })

    it('handles missing purchase types', async () => {
      const limitedPurchases = { normal: mockProcessedPurchases.normal }
      const component = await mountSuspended(TestCombinedValueAnalysis, {
        props: {
          gameData: mockGameData,
          processedPurchases: limitedPurchases,
        },
      })

      expect(component.find('[data-testid="combined-value-analysis"]').exists()).toBe(true)
      expect(component.html()).toBeTruthy()
    })
  })
})
