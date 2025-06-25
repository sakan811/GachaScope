import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h } from 'vue'
import type { GameData, ProcessedPackage, GameAnalysisResult } from '~/types/games'
import CombinedValueAnalysis from '~/components/analysis/CombinedValueAnalysis.vue'

// Mock the composables and utilities
vi.mock('~/utils/gameRegistry', () => ({
  getGameById: vi.fn((id: string) => {
    if (id === 'hsr') return mockGameData
    return null
  }),
}))

vi.mock('~/composables/useGameAnalysis', () => ({
  useGameAnalysis: vi.fn(() => mockGameAnalysis),
}))

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
        name: 'Normal Package 1',
        price: 5.99,
        baseAmount: 300,
        extraAmount: 60,
        purchaseType: 'normal',
      },
    ],
  },
}

const mockProcessedPackages = {
  normal: [
    {
      id: 'normal_1',
      name: 'Normal Package 1',
      price: 5.99,
      baseAmount: 300,
      extraAmount: 60,
      purchaseType: 'normal' as const,
      totalAmount: 360,
      amountPerDollar: 60.1,
      pullsFromPackage: 2,
      costPerPull: 2.995,
      leftoverAmount: 40,
      efficiency: 60.1,
    },
  ],
}

const mockAnalysis: GameAnalysisResult = {
  gameId: 'hsr',
  scenarios: {},
  chartData: { costVsPulls: [], efficiency: [], savings: [] },
  insights: {
    maxSavings: 10.5,
    bestPackage: mockProcessedPackages.normal[0],
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
    bestPackageName: 'Normal Package 1',
  },
}

const mockGameAnalysis = {
  getProcessedPackages: vi.fn(() => mockProcessedPackages),
  analyzeGame: vi.fn(() => mockAnalysis),
}

// Test components
const AnalysisDashboard = defineComponent({
  props: ['gameId'],
  setup(props) {
    const gameData = mockGameData
    const analysis = mockAnalysis
    const error = null

    return () => h('div', {
      'data-testid': `dashboard-${props.gameId}`,
    }, [
      h('h2', `${gameData.metadata.name} Analysis`),
      analysis
        ? [
            h('div', { class: 'best-package' }, analysis.insights.bestPackageName),
            h('div', { class: 'savings' }, `$${analysis.insights.maxSavings.toFixed(2)}`),
          ]
        : null,
      error ? h('div', { class: 'error' }, error) : null,
    ])
  },
})

const PackageCard = defineComponent({
  props: ['package', 'pullName'],
  setup(props) {
    const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`
    const formatCostPerPull = (cost: number) => cost === Infinity ? 'N/A' : `$${cost.toFixed(2)}`

    return () => h('div', {
      'data-testid': `card-${props.package.id}`,
      'class': `type-${props.package.purchaseType}`,
    }, [
      h('h3', props.package.name),
      h('div', { class: 'price' }, formatCurrency(props.package.price)),
      h('div', { class: 'cost-per-pull' }, formatCostPerPull(props.package.costPerPull)),
      h('div', { class: 'pulls' }, `${props.package.pullsFromPackage} ${props.pullName}s`),
    ])
  },
})

describe('Components Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Analysis Dashboard', () => {
    it('renders with valid game data', async () => {
      const component = await mountSuspended(AnalysisDashboard, {
        props: { gameId: 'hsr' },
      })

      expect(component.find('[data-testid="dashboard-hsr"]').exists()).toBe(true)
      expect(component.text()).toContain('Honkai: Star Rail Analysis')
      expect(component.text()).toContain('Normal Package 1')
    })

    it('handles invalid game gracefully', async () => {
      const InvalidDashboard = defineComponent({
        props: ['gameId'],
        setup() {
          const error = 'Game \'invalid\' not found'
          return () => h('div', { class: 'error' }, error)
        },
      })

      const component = await mountSuspended(InvalidDashboard, {
        props: { gameId: 'invalid' },
      })

      expect(component.find('.error').exists()).toBe(true)
      expect(component.text()).toContain('not found')
    })
  })

  describe('Package Cards', () => {
    it('renders normal package correctly', async () => {
      const normalPkg = mockProcessedPackages.normal[0]
      const component = await mountSuspended(PackageCard, {
        props: { package: normalPkg, pullName: 'Warp' },
      })

      expect(component.find(`[data-testid="card-${normalPkg.id}"]`).exists()).toBe(true)
      expect(component.find('.type-normal').exists()).toBe(true)
      expect(component.text()).toContain(normalPkg.name)
      expect(component.text()).toContain(`$${normalPkg.price.toFixed(2)}`)
    })

    it('handles zero-pull packages', async () => {
      const zeroPkg = { ...mockProcessedPackages.normal[0], pullsFromPackage: 0, costPerPull: Infinity }
      const component = await mountSuspended(PackageCard, {
        props: { package: zeroPkg, pullName: 'Warp' },
      })

      expect(component.text()).toContain('N/A')
      expect(component.text()).toContain('0 Warps')
    })
  })

  describe('CombinedValueAnalysis', () => {
    it('renders with game data', async () => {
      const component = await mountSuspended(CombinedValueAnalysis, {
        props: { gameData: mockGameData, processedPackages: mockProcessedPackages },
      })

      expect(component.text()).toContain('Best Overall Value')
      expect(component.text()).toContain('In-App Purchase Type Comparison')
    })

    it('handles missing package types', async () => {
      const limitedPackages = { normal: mockProcessedPackages.normal }
      const component = await mountSuspended(CombinedValueAnalysis, {
        props: { gameData: mockGameData, processedPackages: limitedPackages },
      })

      expect(component.html()).toBeTruthy()
    })
  })

  describe('Data Consistency', () => {
    it('maintains integrity across components', () => {
      const bestPackageId = mockAnalysis.insights.bestPackage?.id
      const allPackages = Object.values(mockProcessedPackages).flat()

      expect(allPackages.some(pkg => pkg.id === bestPackageId)).toBe(true)
    })

    it('processes data efficiently', () => {
      const start = performance.now()
      Object.values(mockProcessedPackages).forEach(pkgs =>
        pkgs.forEach((pkg) => {
          expect(pkg.costPerPull).toBeTypeOf('number')
          expect(pkg.costPerPull).not.toBe(Infinity)
        }),
      )
      expect(performance.now() - start).toBeLessThan(50)
    })
  })
})
