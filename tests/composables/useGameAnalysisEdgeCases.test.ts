import { describe, it, expect, vi } from 'vitest'
import { useGameAnalysis } from '~/composables/useGameAnalysis'
import type { GameData, PurchasePackage } from '~/types/games'

// Unmock for real testing
vi.unmock('~/composables/useGameAnalysis')

describe('useGameAnalysis Edge Cases & Bug Fixes', () => {
  const { 
    processPurchase, 
    generateScenarios, 
    generateInsights, 
    generateChartData,
    analyzeGame,
    getProcessedPurchases
  } = useGameAnalysis()

  const createMockGameData = (packages: Record<string, PurchasePackage[]>): GameData => ({
    id: 'test',
    metadata: {
      id: 'test',
      name: 'Test Game',
      shortName: 'TG',
      currency: { name: 'Test Currency', shortName: 'TC' },
      pull: { name: 'Pull', cost: 160 },
      analysisConfig: {
        includeMultiPackage: true,
        maxPackageMultiplier: 3,
        maxScenarios: 10,
      },
    },
    packages,
  })

  describe('Division by Zero Bug Fixes', () => {
    it('handles empty normalScenarios array without crashing', () => {
      const gameData = createMockGameData({
        first_time_bonus: [
          {
            id: 'bonus1',
            name: 'Bonus Only',
            price: 10,
            baseAmount: 1000,
            extraAmount: 600,
            purchaseType: 'first_time_bonus',
          },
        ],
      })

      const scenarios = generateScenarios(gameData)
      const chartData = generateChartData(scenarios)
      
      // Should not crash when normal scenarios is empty
      expect(() => generateInsights(scenarios, chartData)).not.toThrow()
      
      const insights = generateInsights(scenarios, chartData)
      expect(insights).toBeTruthy()
      expect(insights.maxSavings).toBe(0) // No savings when no normal scenarios
    })

    it('handles scenarios with only Infinity cost per pull', () => {
      const gameData = createMockGameData({
        normal: [
          {
            id: 'zero_pull',
            name: 'Zero Pull Package',
            price: 5,
            baseAmount: 50, // Not enough for a pull (cost: 160)
            extraAmount: 0,
            purchaseType: 'normal',
          },
        ],
      })

      const scenarios = generateScenarios(gameData)
      const chartData = generateChartData(scenarios)
      
      expect(() => generateInsights(scenarios, chartData)).not.toThrow()
      
      const insights = generateInsights(scenarios, chartData)
      expect(insights.maxSavings).toBe(0)
      expect(insights.avgSavings).toBe(0)
    })

    it('correctly filters out Infinity cost scenarios', () => {
      const gameData = createMockGameData({
        normal: [
          {
            id: 'valid',
            name: 'Valid Package',
            price: 10,
            baseAmount: 500,
            extraAmount: 0,
            purchaseType: 'normal',
          },
          {
            id: 'invalid',
            name: 'Invalid Package',
            price: 5,
            baseAmount: 50,
            extraAmount: 0,
            purchaseType: 'normal',
          },
        ],
      })

      const scenarios = generateScenarios(gameData)
      const chartData = generateChartData(scenarios)
      const insights = generateInsights(scenarios, chartData)
      
      // Should use the valid package and ignore the invalid one
      expect(insights.bestPurchase).toBeTruthy()
      expect(insights.bestPurchase?.costPerPull).not.toBe(Infinity)
      expect(insights.bestPurchase?.costPerPull).toBeGreaterThan(0)
    })
  })

  describe('Array Bounds Checking Bug Fixes', () => {
    it('handles empty bonus and normal scenarios safely', () => {
      const gameData = createMockGameData({})

      const scenarios = generateScenarios(gameData)
      const chartData = generateChartData(scenarios)
      
      expect(() => generateInsights(scenarios, chartData)).not.toThrow()
      
      const insights = generateInsights(scenarios, chartData)
      expect(insights.bestScenario).toBeNull()
      expect(insights.bestPurchase).toBeNull()
    })

    it('handles mismatched scenario array lengths', () => {
      const gameData = createMockGameData({
        normal: [
          {
            id: 'normal1',
            name: 'Normal 1',
            price: 10,
            baseAmount: 500,
            extraAmount: 0,
            purchaseType: 'normal',
          },
          {
            id: 'normal2',
            name: 'Normal 2',
            price: 20,
            baseAmount: 1000,
            extraAmount: 0,
            purchaseType: 'normal',
          },
        ],
        first_time_bonus: [
          {
            id: 'bonus1',
            name: 'Bonus 1',
            price: 10,
            baseAmount: 800,
            extraAmount: 0,
            purchaseType: 'first_time_bonus',
          },
          // Intentionally fewer bonus scenarios than normal
        ],
      })

      const scenarios = generateScenarios(gameData)
      const chartData = generateChartData(scenarios)
      
      expect(() => generateInsights(scenarios, chartData)).not.toThrow()
      expect(() => generateChartData(scenarios)).not.toThrow()
      
      // Chart data should handle different array lengths gracefully
      expect(chartData.savings).toBeDefined()
      expect(Array.isArray(chartData.savings)).toBe(true)
    })

    it('safely handles null/undefined scenario properties', () => {
      const scenarios = {
        normal: [
          {
            id: 'test',
            name: 'Test',
            description: 'Test scenario',
            purchases: [],
            totalCost: 10,
            totalAmount: 500,
            totalPulls: undefined, // Undefined property
            leftoverAmount: 20,
            efficiency: 50,
            costPerPull: Infinity,
          },
        ],
        first_time_bonus: [
          {
            id: 'test2',
            name: 'Test 2',
            description: 'Test scenario 2',
            purchases: [],
            totalCost: 10,
            totalAmount: 800,
            totalPulls: 5,
            leftoverAmount: 0,
            efficiency: 80,
            costPerPull: 2,
          },
        ],
      }

      expect(() => generateChartData(scenarios)).not.toThrow()
      
      const chartData = generateChartData(scenarios)
      expect(chartData.savings).toBeDefined()
      expect(Array.isArray(chartData.savings)).toBe(true)
    })
  })

  describe('Null/Undefined Input Handling', () => {
    it('handles null gameData in analyzeGame', () => {
      // Mock getGameById to return null
      vi.doMock('~/utils/gameRegistry', () => ({
        getGameById: vi.fn(() => null),
      }))

      const result = analyzeGame('invalid_game')
      expect(result).toBeNull()
    })

    it('handles null return from getProcessedPurchases', () => {
      const result = getProcessedPurchases('invalid_game')
      expect(result).toBeNull()
    })

    it('safely processes packages with missing properties', () => {
      const invalidPackage = {
        id: 'invalid',
        name: 'Invalid Package',
        price: undefined, // Missing price
        baseAmount: undefined, // Missing baseAmount
        extraAmount: 0,
        purchaseType: 'normal',
      } as any

      expect(() => processPurchase(invalidPackage, 160)).not.toThrow()
      
      const result = processPurchase(invalidPackage, 160)
      expect(result.price).toBe(undefined)
      expect(result.totalAmount).toBeNaN()
      expect(result.pullsFromPurchase).toBeNaN()
      expect(result.costPerPull).toBe(Infinity)
    })
  })

  describe('Mathematical Edge Cases', () => {
    it('handles zero pull cost in processPurchase', () => {
      const package1 = {
        id: 'test',
        name: 'Test',
        price: 10,
        baseAmount: 500,
        extraAmount: 0,
        purchaseType: 'normal',
      } as PurchasePackage

      expect(() => processPurchase(package1, 0)).not.toThrow()
      
      const result = processPurchase(package1, 0)
      expect(result.pullsFromPurchase).toBe(Infinity)
      expect(result.costPerPull).toBe(0)
    })

    it('handles negative amounts gracefully', () => {
      const package1 = {
        id: 'negative',
        name: 'Negative Package',
        price: 10,
        baseAmount: -100,
        extraAmount: 50,
        purchaseType: 'normal',
      } as PurchasePackage

      const result = processPurchase(package1, 160)
      expect(result.totalAmount).toBe(-50)
      expect(result.pullsFromPurchase).toBe(-1) // Math.floor(-50/160) = -1
      expect(result.costPerPull).toBe(Infinity)
    })

    it('handles very large numbers without overflow', () => {
      const package1 = {
        id: 'huge',
        name: 'Huge Package',
        price: Number.MAX_SAFE_INTEGER,
        baseAmount: Number.MAX_SAFE_INTEGER,
        extraAmount: 0,
        purchaseType: 'normal',
      } as PurchasePackage

      expect(() => processPurchase(package1, 160)).not.toThrow()
      
      const result = processPurchase(package1, 160)
      expect(result.totalAmount).toBe(Number.MAX_SAFE_INTEGER)
      expect(result.efficiency).toBeCloseTo(1, 0)
    })
  })

  describe('Chart Data Generation Edge Cases', () => {
    it('handles empty scenarios in chart data generation', () => {
      const emptyScenarios = {}
      
      expect(() => generateChartData(emptyScenarios)).not.toThrow()
      
      const chartData = generateChartData(emptyScenarios)
      expect(chartData.costVsPulls).toEqual([])
      expect(chartData.efficiency).toEqual([])
      expect(chartData.savings).toEqual([])
    })

    it('filters out Infinity values from efficiency chart', () => {
      const scenarios = {
        normal: [
          {
            id: 'valid',
            name: 'Valid',
            description: '',
            purchases: [],
            totalCost: 10,
            totalAmount: 500,
            totalPulls: 3,
            leftoverAmount: 20,
            efficiency: 50,
            costPerPull: 3.33,
          },
          {
            id: 'invalid',
            name: 'Invalid',
            description: '',
            purchases: [],
            totalCost: 5,
            totalAmount: 50,
            totalPulls: 0,
            leftoverAmount: 50,
            efficiency: 10,
            costPerPull: Infinity,
          },
        ],
      }

      const chartData = generateChartData(scenarios)
      
      // Should only include the valid scenario in efficiency chart
      expect(chartData.efficiency).toHaveLength(1)
      expect(chartData.efficiency[0].costPerPull).toBeCloseTo(3.33, 2)
      
      // But should include both in cost vs pulls chart
      expect(chartData.costVsPulls).toHaveLength(2)
    })
  })

  describe('Scenario Generation Robustness', () => {
    it('handles packages that generate zero scenarios', () => {
      const gameData = createMockGameData({
        normal: [], // Empty package array
      })

      expect(() => generateScenarios(gameData)).not.toThrow()
      
      const scenarios = generateScenarios(gameData)
      expect(scenarios.normal).toEqual([])
    })

    it('handles scenario generation with invalid package data', () => {
      const gameData = createMockGameData({
        normal: [
          {
            id: 'broken',
            name: null, // Invalid name
            price: 'invalid', // Invalid price type
            baseAmount: NaN,
            extraAmount: undefined,
            purchaseType: 'normal',
          } as any,
        ],
      })

      expect(() => generateScenarios(gameData)).not.toThrow()
      
      const scenarios = generateScenarios(gameData)
      expect(scenarios.normal).toBeDefined()
    })
  })

  describe('Performance with Edge Cases', () => {
    it('handles large numbers of scenarios efficiently', () => {
      const manyPackages: PurchasePackage[] = Array.from({ length: 50 }, (_, i) => ({
        id: `pkg_${i}`,
        name: `Package ${i}`,
        price: i + 1,
        baseAmount: (i + 1) * 100,
        extraAmount: i * 10,
        purchaseType: 'normal',
      }))

      const gameData = createMockGameData({
        normal: manyPackages,
      })

      const startTime = performance.now()
      const scenarios = generateScenarios(gameData)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(100) // Should complete in <100ms
      expect(scenarios.normal).toBeDefined()
      expect(scenarios.normal?.length).toBeLessThanOrEqual(10) // Respects maxScenarios limit
    })
  })
})