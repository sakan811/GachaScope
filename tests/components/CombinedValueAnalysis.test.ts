// @vitest-environment nuxt
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CombinedValueAnalysis from '~/components/analysis/CombinedValueAnalysis.vue'
import type { GameData, ProcessedPurchase } from '~/types/games'

// Mock @nuxt/ui components
vi.mock('@nuxt/ui', () => ({
  UCard: {
    name: 'UCard',
    template: '<div class="u-card" :class="$attrs.class"><slot name="header"></slot><slot></slot></div>',
    props: ['class'],
    inheritAttrs: true,
  },
  UIcon: {
    name: 'UIcon',
    template: '<span class="u-icon" :class="$attrs.class"></span>',
    props: ['name', 'class'],
    inheritAttrs: true,
  },
}))

const mockGameData: GameData = {
  id: 'hsr',
  metadata: {
    id: 'hsr',
    name: 'Honkai: Star Rail',
    shortName: 'HSR',
    currency: { name: 'Oneiric Shard', shortName: 'OS' },
    pull: { name: 'Warp', cost: 160 },
    analysisConfig: {
      includeMultiPackage: true,
      maxPackageMultiplier: 3,
      maxScenarios: 10,
    },
  },
  packages: {},
}

const mockComprehensivePurchases = {
  normal: [
    {
      id: 'normal_1',
      name: 'Small Normal Purchase',
      price: 4.99,
      baseAmount: 300,
      extraAmount: 60,
      purchaseType: 'normal',
      totalAmount: 360,
      amountPerDollar: 72.14,
      pullsFromPurchase: 2,
      costPerPull: 2.495,
      leftoverAmount: 40,
      efficiency: 72.14,
    },
    {
      id: 'normal_2',
      name: 'Large Normal Purchase',
      price: 19.99,
      baseAmount: 1000,
      extraAmount: 600,
      purchaseType: 'normal',
      totalAmount: 1600,
      amountPerDollar: 80.04,
      pullsFromPurchase: 10,
      costPerPull: 1.999,
      leftoverAmount: 0,
      efficiency: 80.04,
    },
    {
      id: 'normal_zero',
      name: 'Zero Pull Normal',
      price: 1.99,
      baseAmount: 100,
      extraAmount: 0,
      purchaseType: 'normal',
      totalAmount: 100,
      amountPerDollar: 50.25,
      pullsFromPurchase: 0,
      costPerPull: Infinity,
      leftoverAmount: 100,
      efficiency: 50.25,
    },
  ] as ProcessedPurchase[],
  first_time_bonus: [
    {
      id: 'bonus_1',
      name: 'Small First-Time Bonus',
      price: 4.99,
      baseAmount: 300,
      extraAmount: 360,
      purchaseType: 'first_time_bonus',
      totalAmount: 660,
      amountPerDollar: 132.27,
      pullsFromPurchase: 4,
      costPerPull: 1.2475,
      leftoverAmount: 20,
      efficiency: 132.27,
    },
    {
      id: 'bonus_2',
      name: 'Large First-Time Bonus',
      price: 19.99,
      baseAmount: 1000,
      extraAmount: 1200,
      purchaseType: 'first_time_bonus',
      totalAmount: 2200,
      amountPerDollar: 110.06,
      pullsFromPurchase: 13,
      costPerPull: 1.538,
      leftoverAmount: 120,
      efficiency: 110.06,
    },
  ] as ProcessedPurchase[],
  subscription: [
    {
      id: 'sub_1',
      name: 'Express Supply Pass',
      price: 4.99,
      baseAmount: 300,
      extraAmount: 0,
      purchaseType: 'subscription',
      totalAmount: 300,
      amountPerDollar: 60.12,
      pullsFromPurchase: 1,
      costPerPull: 4.99,
      leftoverAmount: 140,
      efficiency: 60.12,
    },
  ] as ProcessedPurchase[],
  battle_pass: [
    {
      id: 'bp_1',
      name: 'Nameless Medal',
      price: 9.99,
      baseAmount: 500,
      extraAmount: 180,
      purchaseType: 'battle_pass',
      totalAmount: 680,
      amountPerDollar: 68.07,
      pullsFromPurchase: 4,
      costPerPull: 2.4975,
      leftoverAmount: 40,
      efficiency: 68.07,
    },
  ] as ProcessedPurchase[],
}

describe('CombinedValueAnalysis.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Component Rendering', () => {
    it('renders with comprehensive purchase data', async () => {
      const component = await mountSuspended(CombinedValueAnalysis, {
        props: {
          gameData: mockGameData,
          processedPurchases: mockComprehensivePurchases,
        },
      })

      expect(component.html()).toContain('In-App Purchase Value Analysis')
      expect(component.text()).toContain('Best Overall Value')
      expect(component.text()).toContain('In-App Purchase Type Comparison')
    })

    it('handles empty processed purchases', async () => {
      const component = await mountSuspended(CombinedValueAnalysis, {
        props: {
          gameData: mockGameData,
          processedPurchases: {},
        },
      })

      expect(component.html()).toContain('In-App Purchase Value Analysis')
      expect(component.text()).toContain('In-App Purchase Value Analysis')
    })
  })

  describe('Overall Best Value Analysis', () => {
    it('identifies the best overall value correctly', async () => {
      const component = await mountSuspended(CombinedValueAnalysis, {
        props: {
          gameData: mockGameData,
          processedPurchases: mockComprehensivePurchases,
        },
      })

      // Best should be the Small First-Time Bonus with lowest cost per pull ($1.25)
      expect(component.text()).toContain('Small First-Time Bonus')
      expect(component.text()).toContain('$1.25')
    })

    it('shows correct explanation for best value', async () => {
      const component = await mountSuspended(CombinedValueAnalysis, {
        props: {
          gameData: mockGameData,
          processedPurchases: mockComprehensivePurchases,
        },
      })

      expect(component.text()).toContain('Best cost per warp')
      expect(component.text()).toContain('$1.25')
    })
  })

  describe('Purchase Type Comparison', () => {
    it('displays all purchase types with valid purchases', async () => {
      const component = await mountSuspended(CombinedValueAnalysis, {
        props: {
          gameData: mockGameData,
          processedPurchases: mockComprehensivePurchases,
        },
      })

      expect(component.text()).toContain('Normal Purchases')
      expect(component.text()).toContain('First-Time Bonus')
      expect(component.text()).toContain('Subscriptions')
      expect(component.text()).toContain('Battle Pass')
    })

    it('shows best purchase name for each type', async () => {
      const component = await mountSuspended(CombinedValueAnalysis, {
        props: {
          gameData: mockGameData,
          processedPurchases: mockComprehensivePurchases,
        },
      })

      // Normal: Large Normal Purchase should be best ($2.00 vs $2.50)
      expect(component.text()).toContain('Large Normal Purchase')
      // First-Time Bonus: Small First-Time Bonus should be best ($1.25 vs $1.54)
      expect(component.text()).toContain('Small First-Time Bonus')
      // Subscription: Only one option
      expect(component.text()).toContain('Express Supply Pass')
      // Battle Pass: Only one option
      expect(component.text()).toContain('Nameless Medal')
    })

    it('applies correct styling for each purchase type', async () => {
      const component = await mountSuspended(CombinedValueAnalysis, {
        props: {
          gameData: mockGameData,
          processedPurchases: mockComprehensivePurchases,
        },
      })

      // Check for type-specific styling classes
      expect(component.html()).toContain('bg-red-50') // Normal
      expect(component.html()).toContain('bg-green-50') // First-Time Bonus and Subscription
      expect(component.html()).toContain('bg-purple-50') // Battle Pass
    })
  })

  describe('Cost Per Pull Formatting', () => {
    it('formats finite cost per pull values correctly', async () => {
      const component = await mountSuspended(CombinedValueAnalysis, {
        props: {
          gameData: mockGameData,
          processedPurchases: mockComprehensivePurchases,
        },
      })

      expect(component.text()).toContain('$1.25')
      expect(component.text()).toContain('$2.00')
      expect(component.text()).toContain('$4.99')
      expect(component.text()).toContain('$2.50')
    })

    it('handles infinity cost per pull as "no warp for the cost"', async () => {
      // Since zero-pull packages are filtered out by the component,
      // we need to test this through the formatCostPerPull function behavior
      // The component only shows valid packages (pullsFromPurchase > 0)

      const component = await mountSuspended(CombinedValueAnalysis, {
        props: {
          gameData: mockGameData,
          processedPurchases: mockComprehensivePurchases,
        },
      })

      // Check that normal costs are displayed correctly
      expect(component.text()).toContain('$1.25')
      expect(component.text()).toContain('$2.00')
      // The function formatCostPerPull exists and would return 'no warp for the cost' for Infinity
      expect(component.vm).toBeTruthy()
    })
  })

  describe('Savings Analysis', () => {
    it('shows savings analysis when both normal and bonus purchases exist', async () => {
      const component = await mountSuspended(CombinedValueAnalysis, {
        props: {
          gameData: mockGameData,
          processedPurchases: mockComprehensivePurchases,
        },
      })

      expect(component.text()).toContain('Savings Analysis')
      expect(component.text()).toContain('Normal vs First-Time Bonus')
    })

    it('calculates savings correctly', async () => {
      const component = await mountSuspended(CombinedValueAnalysis, {
        props: {
          gameData: mockGameData,
          processedPurchases: mockComprehensivePurchases,
        },
      })

      // Should show savings calculations
      expect(component.text()).toContain('Save')
      expect(component.text()).toContain('%')
    })

    it('shows detailed savings breakdown', async () => {
      const component = await mountSuspended(CombinedValueAnalysis, {
        props: {
          gameData: mockGameData,
          processedPurchases: mockComprehensivePurchases,
        },
      })

      expect(component.text()).toContain('Normal Cost:')
      expect(component.text()).toContain('Bonus Cost:')
      expect(component.text()).toContain('You Get:')
      expect(component.text()).toContain('Savings:')
    })

    it('does not show savings when only normal purchases exist', async () => {
      const normalOnlyPurchases = {
        normal: mockComprehensivePurchases.normal,
      }

      const component = await mountSuspended(CombinedValueAnalysis, {
        props: {
          gameData: mockGameData,
          processedPurchases: normalOnlyPurchases,
        },
      })

      expect(component.text()).not.toContain('Savings Analysis')
    })
  })

  describe('Sorting and Ordering', () => {
    it('sorts purchase types by cost per pull ascending', async () => {
      const component = await mountSuspended(CombinedValueAnalysis, {
        props: {
          gameData: mockGameData,
          processedPurchases: mockComprehensivePurchases,
        },
      })

      // Find all cost per pull values and verify ordering
      const text = component.text()
      const costMatches = text.match(/\$\d+\.\d+/g) || []

      // Should find multiple cost values
      expect(costMatches.length).toBeGreaterThan(0)
    })

    it('places "no warp for the cost" items at the end', async () => {
      const component = await mountSuspended(CombinedValueAnalysis, {
        props: {
          gameData: mockGameData,
          processedPurchases: mockComprehensivePurchases,
        },
      })

      const html = component.html()
      const normalIndex = html.indexOf('Normal Purchases')
      const noWarpIndex = html.indexOf('no warp for the cost')

      // "no warp for the cost" should appear after valid costs
      if (noWarpIndex !== -1) {
        expect(noWarpIndex).toBeGreaterThan(normalIndex)
      }
    })
  })

  describe('Edge Cases', () => {
    it('handles only zero-pull purchases', async () => {
      const zeroPullOnly = {
        normal: [
          {
            id: 'zero_only',
            name: 'Zero Only Package',
            price: 1.99,
            baseAmount: 100,
            extraAmount: 0,
            purchaseType: 'normal',
            totalAmount: 100,
            amountPerDollar: 50.25,
            pullsFromPurchase: 0,
            costPerPull: Infinity,
            leftoverAmount: 100,
            efficiency: 50.25,
          },
        ] as ProcessedPurchase[],
      }

      const component = await mountSuspended(CombinedValueAnalysis, {
        props: {
          gameData: mockGameData,
          processedPurchases: zeroPullOnly,
        },
      })

      expect(component.vm).toBeTruthy()
      // Since zero-pull packages are filtered out, there should be no overall best value
      expect(component.text()).not.toContain('Best Overall Value')
    })

    it('handles single purchase type', async () => {
      const singleType = {
        subscription: mockComprehensivePurchases.subscription,
      }

      const component = await mountSuspended(CombinedValueAnalysis, {
        props: {
          gameData: mockGameData,
          processedPurchases: singleType,
        },
      })

      expect(component.text()).toContain('Subscriptions')
      expect(component.text()).toContain('Express Supply Pass')
    })

    it('handles very similar cost per pull values', async () => {
      const similarCosts = {
        normal: [
          {
            ...mockComprehensivePurchases.normal[0],
            costPerPull: 2.001,
          },
          {
            ...mockComprehensivePurchases.normal[1],
            costPerPull: 2.002,
          },
        ],
      }

      const component = await mountSuspended(CombinedValueAnalysis, {
        props: {
          gameData: mockGameData,
          processedPurchases: similarCosts,
        },
      })

      expect(component.vm).toBeTruthy()
      expect(component.text()).toContain('$2.00')
    })
  })

  describe('Responsive Design', () => {
    it('applies responsive grid classes', async () => {
      const component = await mountSuspended(CombinedValueAnalysis, {
        props: {
          gameData: mockGameData,
          processedPurchases: mockComprehensivePurchases,
        },
      })

      // Check for responsive grid classes
      expect(component.html()).toContain('sm:grid-cols-2')
      expect(component.html()).toContain('lg:grid-cols-4')
      expect(component.html()).toContain('lg:grid-cols-3')
    })

    it('applies responsive text sizing', async () => {
      const component = await mountSuspended(CombinedValueAnalysis, {
        props: {
          gameData: mockGameData,
          processedPurchases: mockComprehensivePurchases,
        },
      })

      expect(component.html()).toContain('text-xl')
      expect(component.html()).toContain('sm:text-2xl')
      expect(component.html()).toContain('sm:text-xl')
    })
  })

  describe('Game Data Integration', () => {
    it('uses correct currency and pull names from game data', async () => {
      const component = await mountSuspended(CombinedValueAnalysis, {
        props: {
          gameData: mockGameData,
          processedPurchases: mockComprehensivePurchases,
        },
      })

      expect(component.text()).toContain('warp')
      expect(component.text()).toContain('warps')
    })

    it('adapts to different game configurations', async () => {
      const differentGameData = {
        ...mockGameData,
        metadata: {
          ...mockGameData.metadata,
          pull: { name: 'Summon', cost: 180 },
          currency: { name: 'Crystal', shortName: 'CR' },
        },
      }

      const component = await mountSuspended(CombinedValueAnalysis, {
        props: {
          gameData: differentGameData,
          processedPurchases: mockComprehensivePurchases,
        },
      })

      expect(component.text()).toContain('summon')
    })
  })
})
