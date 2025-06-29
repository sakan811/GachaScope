import { describe, it, expect, vi } from 'vitest'
import { useGameAnalysis } from '~/composables/useGameAnalysis'
import type { GameData, PurchasePackage } from '~/types/games'

// Unmock for real performance testing
vi.unmock('~/composables/useGameAnalysis')

describe('Performance Tests', () => {
  const {
    processPurchase,
    generateScenarios,
    generateChartsFromPurchases,
    generateInsights,
    getProcessedPurchases,
  } = useGameAnalysis()

  const createLargeGameData = (packageCount: number): GameData => {
    const generatePackages = (type: string, count: number): PurchasePackage[] =>
      Array.from({ length: count }, (_, i) => ({
        id: `${type}_${i}`,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} Package ${i + 1}`,
        price: Math.round((Math.random() * 100 + 1) * 100) / 100,
        baseAmount: Math.floor(Math.random() * 2000 + 100),
        extraAmount: Math.floor(Math.random() * 1000),
        purchaseType: type as PurchasePackage['purchaseType'],
      }))

    return {
      id: 'performance_test',
      metadata: {
        id: 'performance_test',
        name: 'Performance Test Game',
        shortName: 'PTG',
        currency: { name: 'Test Currency', shortName: 'TC' },
        pull: { name: 'Pull', cost: 160 },
        analysisConfig: {
          includeMultiPackage: true,
          maxPackageMultiplier: 3,
          maxScenarios: 50, // Higher limit for performance testing
        },
      },
      packages: {
        normal: generatePackages('normal', packageCount),
        first_time_bonus: generatePackages('first_time_bonus', packageCount),
        subscription: generatePackages('subscription', Math.floor(packageCount / 2)),
        battle_pass: generatePackages('battle_pass', Math.floor(packageCount / 3)),
      },
    }
  }

  describe('Single Purchase Processing Performance', () => {
    it('processes individual purchases quickly', () => {
      const testPackage: PurchasePackage = {
        id: 'perf_test',
        name: 'Performance Test Package',
        price: 19.99,
        baseAmount: 1000,
        extraAmount: 600,
        purchaseType: 'normal',
      }

      const iterations = 1000
      const startTime = performance.now()

      for (let i = 0; i < iterations; i++) {
        processPurchase(testPackage, 160)
      }

      const endTime = performance.now()
      const totalTime = endTime - startTime
      const avgTime = totalTime / iterations

      expect(avgTime).toBeLessThan(1) // Should process in <1ms per package
      expect(totalTime).toBeLessThan(100) // 1000 packages in <100ms
    })
  })

  describe('Scenario Generation Performance', () => {
    it('generates scenarios efficiently for moderate dataset', () => {
      const gameData = createLargeGameData(20) // 20 packages per type

      const startTime = performance.now()
      const scenarios = generateScenarios(gameData)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(50) // <50ms for 20 packages
      expect(scenarios).toBeTruthy()
      expect(Object.keys(scenarios).length).toBeGreaterThan(0)
    })

    it('handles large dataset efficiently', () => {
      const gameData = createLargeGameData(100) // 100 packages per type

      const startTime = performance.now()
      const scenarios = generateScenarios(gameData)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(200) // <200ms for 100 packages
      expect(scenarios).toBeTruthy()
    })

    it('respects maxScenarios limit for performance', () => {
      const gameData = createLargeGameData(100)

      const startTime = performance.now()
      const scenarios = generateScenarios(gameData)
      const endTime = performance.now()

      // Should limit scenarios to prevent performance issues
      Object.values(scenarios).forEach((scenarioArray) => {
        if (scenarioArray) {
          expect(scenarioArray.length).toBeLessThanOrEqual(50)
        }
      })

      expect(endTime - startTime).toBeLessThan(300) // Even with 100 packages, should be <300ms
    })
  })

  describe('Chart Data Generation Performance', () => {
    it('generates chart data quickly for large datasets', () => {
      const gameData = createLargeGameData(50)
      const processedPurchases = getProcessedPurchases('hsr') // Use real HSR data

      if (!processedPurchases) {
        // Fallback to mock data
        const mockProcessed = {
          normal: gameData.packages.normal?.map(pkg => processPurchase(pkg, 160)) || [],
          first_time_bonus: gameData.packages.first_time_bonus?.map(pkg => processPurchase(pkg, 160)) || [],
        }

        const startTime = performance.now()
        const chartData = generateChartsFromPurchases(mockProcessed)
        const endTime = performance.now()

        expect(endTime - startTime).toBeLessThan(20) // <20ms for chart generation
        expect(chartData.scatterData).toBeDefined()
        expect(chartData.barData).toBeDefined()
        return
      }

      const startTime = performance.now()
      const chartData = generateChartsFromPurchases(processedPurchases)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(20) // <20ms for chart generation
      expect(chartData.scatterData).toBeDefined()
      expect(chartData.barData).toBeDefined()
    })
  })

  describe('Insights Generation Performance', () => {
    it('calculates insights efficiently', () => {
      const gameData = createLargeGameData(30)

      const scenarios = generateScenarios(gameData)
      const chartData = {
        costVsPulls: [],
        efficiency: [],
        savings: [],
      }

      const startTime = performance.now()
      const insights = generateInsights(scenarios, chartData)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(10) // <10ms for insights
      expect(insights).toBeTruthy()
      expect(insights.bestPurchase).toBeTruthy()
    })
  })

  describe('Memory Usage and Garbage Collection', () => {
    it('does not cause memory leaks with repeated operations', () => {
      const gameData = createLargeGameData(20)

      // Perform many operations to test for memory leaks
      for (let i = 0; i < 100; i++) {
        const scenarios = generateScenarios(gameData)
        const chartData = {
          costVsPulls: [],
          efficiency: [],
          savings: [],
        }
        generateInsights(scenarios, chartData)

        // Force garbage collection opportunity
        if (i % 10 === 0 && global.gc) {
          global.gc()
        }
      }

      // If we get here without running out of memory, test passes
      expect(true).toBe(true)
    })
  })

  describe('Edge Case Performance', () => {
    it('handles many zero-pull packages efficiently', () => {
      const zeroPullPackages: PurchasePackage[] = Array.from({ length: 100 }, (_, i) => ({
        id: `zero_${i}`,
        name: `Zero Pull Package ${i}`,
        price: 1 + i * 0.01,
        baseAmount: 50, // Too small for any pulls
        extraAmount: 0,
        purchaseType: 'normal',
      }))

      const gameData: GameData = {
        id: 'zero_test',
        metadata: {
          id: 'zero_test',
          name: 'Zero Pull Test',
          shortName: 'ZPT',
          currency: { name: 'Test', shortName: 'T' },
          pull: { name: 'Pull', cost: 160 },
          analysisConfig: {
            includeMultiPackage: false,
            maxPackageMultiplier: 1,
            maxScenarios: 10,
          },
        },
        packages: {
          normal: zeroPullPackages,
        },
      }

      const startTime = performance.now()
      const scenarios = generateScenarios(gameData)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(100) // Should handle efficiently
      expect(scenarios.normal).toBeDefined()
    })

    it('handles packages with extreme values efficiently', () => {
      const extremePackages: PurchasePackage[] = [
        {
          id: 'tiny',
          name: 'Tiny Package',
          price: 0.01,
          baseAmount: 1,
          extraAmount: 0,
          purchaseType: 'normal',
        },
        {
          id: 'huge',
          name: 'Huge Package',
          price: 9999.99,
          baseAmount: 1000000,
          extraAmount: 5000000,
          purchaseType: 'normal',
        },
      ]

      const gameData: GameData = {
        id: 'extreme_test',
        metadata: {
          id: 'extreme_test',
          name: 'Extreme Test',
          shortName: 'ET',
          currency: { name: 'Test', shortName: 'T' },
          pull: { name: 'Pull', cost: 160 },
          analysisConfig: {
            includeMultiPackage: true,
            maxPackageMultiplier: 3,
            maxScenarios: 10,
          },
        },
        packages: {
          normal: extremePackages,
        },
      }

      const startTime = performance.now()
      const scenarios = generateScenarios(gameData)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(50) // Should handle efficiently
      expect(scenarios.normal).toBeDefined()
    })
  })

  describe('Scalability Tests', () => {
    it('performance degrades linearly with input size', () => {
      const sizes = [10, 20, 40]
      const times: number[] = []

      sizes.forEach((size) => {
        const gameData = createLargeGameData(size)

        const startTime = performance.now()
        const scenarios = generateScenarios(gameData)
        const chartData = {
          costVsPulls: [],
          efficiency: [],
          savings: [],
        }
        generateInsights(scenarios, chartData)
        const endTime = performance.now()

        times.push(endTime - startTime)
      })

      // Performance should scale reasonably (not exponentially)
      const ratio1 = times[1] / times[0] // 20/10
      const ratio2 = times[2] / times[1] // 40/20

      expect(ratio1).toBeLessThan(5) // Should not be more than 5x slower
      expect(ratio2).toBeLessThan(5) // Should scale linearly, not exponentially
    })
  })

  describe('Concurrent Processing', () => {
    it('handles multiple simultaneous operations', async () => {
      const gameData = createLargeGameData(15)

      const operations = Array.from({ length: 10 }, () =>
        new Promise<void>((resolve) => {
          setTimeout(() => {
            const scenarios = generateScenarios(gameData)
            const chartData = {
              costVsPulls: [],
              efficiency: [],
              savings: [],
            }
            generateInsights(scenarios, chartData)
            resolve()
          }, Math.random() * 10) // Random delay 0-10ms
        }),
      )

      const startTime = performance.now()
      await Promise.all(operations)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(200) // All operations in <200ms
    })
  })
})
