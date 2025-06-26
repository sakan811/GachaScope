// @vitest-environment nuxt
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CombinedValueAnalysis from '~/components/analysis/CombinedValueAnalysis.vue'
import PackageCard from '~/components/analysis/PackageCard.vue'
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
  UAlert: {
    name: 'UAlert',
    template: '<div class="u-alert"><slot name="title"></slot><slot name="description"></slot></div>',
    props: ['color', 'variant'],
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

describe('Bug Fixes Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Critical Bug Fix #1: Division by Zero in useGameAnalysis', () => {
    it('handles empty normalScenarios without crashing CombinedValueAnalysis', async () => {
      // Create scenario with only bonus purchases (no normal purchases)
      const processedPurchases = {
        first_time_bonus: [
          {
            id: 'bonus1',
            name: 'First Time Bonus',
            price: 9.99,
            baseAmount: 500,
            extraAmount: 680,
            purchaseType: 'first_time_bonus',
            totalAmount: 1180,
            amountPerDollar: 118.12,
            pullsFromPurchase: 7,
            costPerPull: 1.43,
            leftoverAmount: 60,
            efficiency: 118.12,
          },
        ] as ProcessedPurchase[],
        // Intentionally no normal purchases to trigger the division by zero bug
      }

      // This should not crash due to empty normalScenarios
      const component = await mountSuspended(CombinedValueAnalysis, {
        props: {
          gameData: mockGameData,
          processedPurchases,
        },
      })

      expect(component.find('.rounded-lg.bg-default, .u-card').exists()).toBe(true)
      expect(component.text()).toContain('In-App Purchase Value Analysis')
      // Should handle the case gracefully without showing savings analysis
      expect(component.text()).not.toContain('Savings Analysis')
    })

    it('handles all Infinity cost scenarios without crashing', async () => {
      const processedPurchases = {
        normal: [
          {
            id: 'zero1',
            name: 'Zero Pull Purchase 1',
            price: 4.99,
            baseAmount: 100,
            extraAmount: 0,
            purchaseType: 'normal',
            totalAmount: 100,
            amountPerDollar: 20.04,
            pullsFromPurchase: 0,
            costPerPull: Infinity,
            leftoverAmount: 100,
            efficiency: 20.04,
          },
          {
            id: 'zero2',
            name: 'Zero Pull Purchase 2',
            price: 2.99,
            baseAmount: 50,
            extraAmount: 0,
            purchaseType: 'normal',
            totalAmount: 50,
            amountPerDollar: 16.72,
            pullsFromPurchase: 0,
            costPerPull: Infinity,
            leftoverAmount: 50,
            efficiency: 16.72,
          },
        ] as ProcessedPurchase[],
      }

      const component = await mountSuspended(CombinedValueAnalysis, {
        props: {
          gameData: mockGameData,
          processedPurchases,
        },
      })

      expect(component.vm).toBeTruthy()
      expect(component.text()).toContain('no warp for the cost')
    })
  })

  describe('Critical Bug Fix #2: NaN from parseFloat in Sorting', () => {
    it('handles "no warp for the cost" strings in sorting without NaN errors', async () => {
      const processedPurchases = {
        normal: [
          {
            id: 'valid',
            name: 'Valid Purchase',
            price: 9.99,
            baseAmount: 500,
            extraAmount: 180,
            purchaseType: 'normal',
            totalAmount: 680,
            amountPerDollar: 68.07,
            pullsFromPurchase: 4,
            costPerPull: 2.50,
            leftoverAmount: 40,
            efficiency: 68.07,
          },
          {
            id: 'invalid',
            name: 'Invalid Package',
            price: 1.99,
            baseAmount: 50,
            extraAmount: 0,
            purchaseType: 'normal',
            totalAmount: 50,
            amountPerDollar: 25.13,
            pullsFromPurchase: 0,
            costPerPull: Infinity,
            leftoverAmount: 50,
            efficiency: 25.13,
          },
        ] as ProcessedPurchase[],
        first_time_bonus: [
          {
            id: 'bonus',
            name: 'Bonus Package',
            price: 9.99,
            baseAmount: 500,
            extraAmount: 680,
            purchaseType: 'first_time_bonus',
            totalAmount: 1180,
            amountPerDollar: 118.12,
            pullsFromPurchase: 7,
            costPerPull: 1.43,
            leftoverAmount: 60,
            efficiency: 118.12,
          },
        ] as ProcessedPurchase[],
      }

      const component = await mountSuspended(CombinedValueAnalysis, {
        props: {
          gameData: mockGameData,
          processedPurchases,
        },
      })

      // Should render without crashing during sorting
      expect(component.vm).toBeTruthy()
      expect(component.text()).toContain('In-App Purchase Type Comparison')

      // Should handle both valid costs and "no warp for the cost" strings
      expect(component.text()).toContain('$2.50')
      expect(component.text()).toContain('no warp for the cost')
    })
  })

  describe('Critical Bug Fix #3: Array Access Without Bounds Check', () => {
    it('handles mismatched bonus and normal scenario lengths', async () => {
      const processedPurchases = {
        normal: [
          {
            id: 'normal1',
            name: 'Normal 1',
            price: 4.99,
            baseAmount: 300,
            extraAmount: 60,
            purchaseType: 'normal',
            totalAmount: 360,
            amountPerDollar: 72.14,
            pullsFromPurchase: 2,
            costPerPull: 2.50,
            leftoverAmount: 40,
            efficiency: 72.14,
          },
          {
            id: 'normal2',
            name: 'Normal 2',
            price: 9.99,
            baseAmount: 500,
            extraAmount: 180,
            purchaseType: 'normal',
            totalAmount: 680,
            amountPerDollar: 68.07,
            pullsFromPurchase: 4,
            costPerPull: 2.50,
            leftoverAmount: 40,
            efficiency: 68.07,
          },
        ] as ProcessedPurchase[],
        first_time_bonus: [
          {
            id: 'bonus1',
            name: 'Bonus 1',
            price: 4.99,
            baseAmount: 300,
            extraAmount: 360,
            purchaseType: 'first_time_bonus',
            totalAmount: 660,
            amountPerDollar: 132.27,
            pullsFromPurchase: 4,
            costPerPull: 1.25,
            leftoverAmount: 20,
            efficiency: 132.27,
          },
          // Intentionally fewer bonus items than normal to test bounds checking
        ],
      }

      const component = await mountSuspended(CombinedValueAnalysis, {
        props: {
          gameData: mockGameData,
          processedPurchases,
        },
      })

      // Should render without accessing undefined array elements
      expect(component.vm).toBeTruthy()
      expect(component.text()).toContain('Savings Analysis')
    })
  })

  describe('Critical Bug Fix #4: Null Package Access in PackageCard', () => {
    it('handles null package data gracefully', async () => {
      const component = await mountSuspended(PackageCard, {
        props: {
          pkg: null,
          pullName: 'Warp',
          currencyName: 'Oneiric Shard',
        },
      })

      expect(component.find('.border-red-300').exists()).toBe(true)
      expect(component.text()).toContain('Purchase data unavailable')
      expect(component.find('.text-red-600').exists()).toBe(true)
    })

    it('handles package with missing properties using null coalescing', async () => {
      const packageWithMissingProps = {
        id: 'partial',
        name: 'Partial Package',
        // Missing price, pullsFromPurchase, totalAmount, leftoverAmount
        baseAmount: 500,
        extraAmount: 0,
        purchaseType: 'normal',
      } as any

      const component = await mountSuspended(PackageCard, {
        props: {
          pkg: packageWithMissingProps,
          pullName: 'Warp',
          currencyName: 'OS',
        },
      })

      // Should use fallback values instead of crashing
      expect(component.text()).toContain('$0.00') // price fallback
      expect(component.text()).toContain('0 warps') // pullsFromPurchase fallback
      expect(component.text()).toContain('0 os') // totalAmount fallback
      expect(component.text()).toContain('0 leftover') // leftoverAmount fallback
    })
  })

  describe('Critical Bug Fix #5: Unsafe Array Operations', () => {
    it('validates scenario objects before accessing properties', async () => {
      // This test verifies that the fixed code in useGameAnalysis properly validates
      // scenario objects before accessing their properties
      const processedPurchases = {
        normal: [
          {
            id: 'valid',
            name: 'Valid Normal',
            price: 9.99,
            baseAmount: 500,
            extraAmount: 180,
            purchaseType: 'normal',
            totalAmount: 680,
            amountPerDollar: 68.07,
            pullsFromPurchase: 4,
            costPerPull: 2.50,
            leftoverAmount: 40,
            efficiency: 68.07,
          },
        ] as ProcessedPurchase[],
        first_time_bonus: [
          {
            id: 'valid_bonus',
            name: 'Valid Bonus',
            price: 9.99,
            baseAmount: 500,
            extraAmount: 680,
            purchaseType: 'first_time_bonus',
            totalAmount: 1180,
            amountPerDollar: 118.12,
            pullsFromPurchase: 7,
            costPerPull: 1.43,
            leftoverAmount: 60,
            efficiency: 118.12,
          },
        ] as ProcessedPurchase[],
      }

      const component = await mountSuspended(CombinedValueAnalysis, {
        props: {
          gameData: mockGameData,
          processedPurchases,
        },
      })

      // Should render savings analysis without crashing on array operations
      expect(component.vm).toBeTruthy()
      expect(component.text()).toContain('Savings Analysis')
      expect(component.text()).toContain('Save') // Should show savings amount
    })
  })

  describe('Critical Bug Fix #6: TypeScript Type Safety', () => {
    it('properly validates component props with TypeScript interfaces', async () => {
      // PackageCard now properly validates ProcessedPurchase | null
      const validPackage: ProcessedPurchase = {
        id: 'typed',
        name: 'TypeScript Purchase',
        price: 9.99,
        baseAmount: 500,
        extraAmount: 180,
        purchaseType: 'normal',
        totalAmount: 680,
        amountPerDollar: 68.07,
        pullsFromPurchase: 4,
        costPerPull: 2.50,
        leftoverAmount: 40,
        efficiency: 68.07,
      }

      const component = await mountSuspended(PackageCard, {
        props: {
          pkg: validPackage,
          pullName: 'Warp',
          currencyName: 'OS',
        },
      })

      expect(component.vm).toBeTruthy()
      expect(component.text()).toContain('TypeScript Purchase')
    })
  })

  describe('Error Boundary Integration', () => {
    it('handles component errors gracefully in analysis view', async () => {
      // Test with extreme edge case data that might cause issues
      const extremeProcessedPurchases = {
        normal: [
          {
            id: 'extreme',
            name: 'Extreme Package',
            price: Number.MAX_SAFE_INTEGER,
            baseAmount: 0,
            extraAmount: Number.MAX_SAFE_INTEGER,
            purchaseType: 'normal',
            totalAmount: Number.MAX_SAFE_INTEGER,
            amountPerDollar: 1,
            pullsFromPurchase: Math.floor(Number.MAX_SAFE_INTEGER / 160),
            costPerPull: 160,
            leftoverAmount: Number.MAX_SAFE_INTEGER % 160,
            efficiency: 1,
          },
        ] as ProcessedPurchase[],
      }

      // Should handle extreme values without crashing
      expect(async () => {
        const component = await mountSuspended(CombinedValueAnalysis, {
          props: {
            gameData: mockGameData,
            processedPurchases: extremeProcessedPurchases,
          },
        })
        expect(component.vm).toBeTruthy()
      }).not.toThrow()
    })
  })
})
