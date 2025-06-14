// tests/utils/shardsData.test.ts
import { describe, it, expect } from 'vitest'
import { 
  createPackage, 
  generatePurchaseScenarios, 
  generateChartData,
  normalPurchases,
  firstTimeBonus,
  SHARDS_PER_PULL,
  normalPackages,
  firstTimeBonusPackages
} from '~/utils/shardsData'

describe('shardsData utils', () => {
  describe('createPackage', () => {
    it('should create a package with correct calculations', () => {
      const rawPackage = {
        baseShards: 980,
        price: 14.99,
        extraShards: 110,
        purchaseType: 'normal' as const
      }
      
      const shardPackage = createPackage(rawPackage)
      
      expect(shardPackage.totalShards).toBe(1090) // 980 + 110
      expect(shardPackage.shardsPerDollar).toBeCloseTo(72.72, 2) // 1090 / 14.99
      expect(shardPackage.pullsFromPackage).toBe(6) // Math.floor(1090 / 160)
      expect(shardPackage.leftoverShards).toBe(130) // 1090 % 160
      expect(shardPackage.costPerPull).toBeCloseTo(2.50, 2) // 14.99 / 6
    })

    it('should handle packages with no extra shards', () => {
      const rawPackage = {
        baseShards: 60,
        price: 0.99,
        extraShards: 0,
        purchaseType: 'normal' as const
      }
      
      const shardPackage = createPackage(rawPackage)
      
      expect(shardPackage.totalShards).toBe(60)
      expect(shardPackage.pullsFromPackage).toBe(0) // 60 < 160
      expect(shardPackage.leftoverShards).toBe(60)
      expect(shardPackage.costPerPull).toBe(Infinity) // No complete pulls
    })

    it('should handle first-time bonus packages correctly', () => {
      const rawPackage = {
        baseShards: 980,
        price: 14.99,
        extraShards: 980, // First-time bonus doubles
        purchaseType: 'first_time_bonus' as const
      }
      
      const shardPackage = createPackage(rawPackage)
      
      expect(shardPackage.totalShards).toBe(1960) // 980 + 980
      expect(shardPackage.pullsFromPackage).toBe(12) // Math.floor(1960 / 160)
      expect(shardPackage.leftoverShards).toBe(40) // 1960 % 160
      expect(shardPackage.costPerPull).toBeCloseTo(1.25, 2) // 14.99 / 12
    })
  })

  describe('generatePurchaseScenarios', () => {
    it('should generate scenarios for both normal and first-time packages', () => {
      const scenarios = generatePurchaseScenarios()
      
      expect(scenarios.normalScenarios).toBeDefined()
      expect(scenarios.firstTimeScenarios).toBeDefined()
      expect(scenarios.normalScenarios.length).toBeGreaterThan(0)
      expect(scenarios.firstTimeScenarios.length).toBeGreaterThan(0)
    })

    it('should include single package scenarios', () => {
      const scenarios = generatePurchaseScenarios()
      
      // Should have single package scenarios
      const singlePackageScenarios = scenarios.normalScenarios.filter(s => 
        s.packages.length === 1 && s.packages[0].count === 1
      )
      
      expect(singlePackageScenarios.length).toBe(normalPurchases.length)
    })

    it('should include multiple package scenarios', () => {
      const scenarios = generatePurchaseScenarios()
      
      // Should have scenarios with multiple packages
      const multipleScenarios = scenarios.normalScenarios.filter(s => 
        s.packages.length > 1 || s.packages[0].count > 1
      )
      
      expect(multipleScenarios.length).toBeGreaterThan(0)
    })

    it('should calculate scenario totals correctly', () => {
      const scenarios = generatePurchaseScenarios()
      const firstScenario = scenarios.normalScenarios[0]
      
      // Verify calculations
      const expectedCost = firstScenario.packages.reduce((sum, { package: pkg, count }) => 
        sum + (pkg.price * count), 0
      )
      const expectedShards = firstScenario.packages.reduce((sum, { package: pkg, count }) => 
        sum + (pkg.totalShards * count), 0
      )
      const expectedPulls = Math.floor(expectedShards / SHARDS_PER_PULL)
      const expectedLeftover = expectedShards % SHARDS_PER_PULL
      
      expect(firstScenario.totalCost).toBeCloseTo(expectedCost, 2)
      expect(firstScenario.totalShards).toBe(expectedShards)
      expect(firstScenario.totalPulls).toBe(expectedPulls)
      expect(firstScenario.leftoverShards).toBe(expectedLeftover)
    })

    it('should sort scenarios by cost', () => {
      const scenarios = generatePurchaseScenarios()
      
      // Check if normal scenarios are sorted by cost
      for (let i = 1; i < scenarios.normalScenarios.length; i++) {
        expect(scenarios.normalScenarios[i].totalCost).toBeGreaterThanOrEqual(
          scenarios.normalScenarios[i - 1].totalCost
        )
      }
    })
  })

  describe('generateChartData', () => {
    it('should generate chart data with correct structure', () => {
      const chartData = generateChartData()
      
      expect(chartData.normalData).toBeDefined()
      expect(chartData.firstTimeData).toBeDefined()
      expect(chartData.savingsData).toBeDefined()
      
      expect(Array.isArray(chartData.normalData)).toBe(true)
      expect(Array.isArray(chartData.firstTimeData)).toBe(true)
      expect(Array.isArray(chartData.savingsData)).toBe(true)
    })

    it('should have data points with correct properties', () => {
      const chartData = generateChartData()
      
      if (chartData.normalData.length > 0) {
        const dataPoint = chartData.normalData[0]
        expect(dataPoint).toHaveProperty('pulls')
        expect(dataPoint).toHaveProperty('cost')
        expect(dataPoint).toHaveProperty('scenario')
        expect(typeof dataPoint.pulls).toBe('number')
        expect(typeof dataPoint.cost).toBe('number')
        expect(typeof dataPoint.scenario).toBe('string')
      }
    })

    it('should calculate savings correctly', () => {
      const chartData = generateChartData()
      
      chartData.savingsData.forEach(savingsPoint => {
        expect(savingsPoint.savings).toBeGreaterThan(0)
        expect(typeof savingsPoint.pulls).toBe('number')
        expect(typeof savingsPoint.scenario).toBe('string')
      })
    })
  })

  describe('processed packages', () => {
    it('should process normal packages correctly', () => {
      expect(normalPackages).toBeDefined()
      expect(normalPackages.length).toBe(normalPurchases.length)
      
      normalPackages.forEach(pkg => {
        expect(pkg.totalShards).toBe(pkg.baseShards + pkg.extraShards)
        expect(pkg.pullsFromPackage).toBe(Math.floor(pkg.totalShards / SHARDS_PER_PULL))
        expect(pkg.leftoverShards).toBe(pkg.totalShards % SHARDS_PER_PULL)
        expect(pkg.shardsPerDollar).toBe(pkg.totalShards / pkg.price)
      })
    })

    it('should process first-time bonus packages correctly', () => {
      expect(firstTimeBonusPackages).toBeDefined()
      expect(firstTimeBonusPackages.length).toBe(firstTimeBonus.length)
      
      firstTimeBonusPackages.forEach(pkg => {
        expect(pkg.totalShards).toBe(pkg.baseShards + pkg.extraShards)
        expect(pkg.pullsFromPackage).toBe(Math.floor(pkg.totalShards / SHARDS_PER_PULL))
        expect(pkg.leftoverShards).toBe(pkg.totalShards % SHARDS_PER_PULL)
        expect(pkg.shardsPerDollar).toBe(pkg.totalShards / pkg.price)
      })
    })

    it('should show first-time bonus packages have better efficiency', () => {
      // Compare same package types
      for (let i = 0; i < Math.min(normalPackages.length, firstTimeBonusPackages.length); i++) {
        const normal = normalPackages[i]
        const bonus = firstTimeBonusPackages[i]
        
        // Same price, but bonus should have more shards
        expect(bonus.price).toBe(normal.price)
        expect(bonus.totalShards).toBeGreaterThan(normal.totalShards)
        expect(bonus.shardsPerDollar).toBeGreaterThan(normal.shardsPerDollar)
        
        // If both have pulls, bonus should have better cost per pull
        if (normal.pullsFromPackage > 0 && bonus.pullsFromPackage > 0) {
          expect(bonus.costPerPull).toBeLessThan(normal.costPerPull)
        }
      }
    })
  })

  describe('edge cases', () => {
    it('should handle zero-pull packages', () => {
      const smallPackage = normalPackages.find(pkg => pkg.pullsFromPackage === 0)
      if (smallPackage) {
        expect(smallPackage.costPerPull).toBe(Infinity)
        expect(smallPackage.leftoverShards).toBe(smallPackage.totalShards)
      }
    })

    it('should handle large package combinations', () => {
      const scenarios = generatePurchaseScenarios()
      const largeScenarios = scenarios.normalScenarios.filter(s => s.totalCost > 100)
      
      expect(largeScenarios.length).toBeGreaterThan(0)
      largeScenarios.forEach(scenario => {
        expect(scenario.totalPulls).toBeGreaterThan(0)
        expect(scenario.efficiency).toBeGreaterThan(0)
        expect(scenario.costPerPull).toBeGreaterThan(0)
      })
    })

    it('should maintain consistency in calculations', () => {
      const scenarios = generatePurchaseScenarios()
      
      scenarios.normalScenarios.forEach(scenario => {
        // Verify efficiency calculation
        expect(scenario.efficiency).toBeCloseTo(scenario.totalShards / scenario.totalCost, 2)
        
        // Verify cost per pull calculation
        if (scenario.totalPulls > 0) {
          expect(scenario.costPerPull).toBeCloseTo(scenario.totalCost / scenario.totalPulls, 2)
        } else {
          expect(scenario.costPerPull).toBe(Infinity)
        }
        
        // Verify leftover shards
        expect(scenario.leftoverShards).toBe(scenario.totalShards % SHARDS_PER_PULL)
      })
    })
  })
})