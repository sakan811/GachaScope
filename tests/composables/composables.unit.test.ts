import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { createMockGameData, expectValidAnalysis, measurePerformance } from '../fixtures/testHelpers'
import { useGameAnalysis } from '~/composables/useGameAnalysis'
import { useChartConfig } from '~/composables/useChartConfig'

// Import real composables by unmocking them for unit tests
vi.unmock('~/composables/useGameAnalysis')
vi.unmock('~/composables/useChartConfig')


describe('Composables Unit Tests', () => {
  describe('useGameAnalysis', () => {
    it('processes HSR packages correctly', () => {
      const { getProcessedPackages } = useGameAnalysis()
      const packages = getProcessedPackages('hsr')

      expect(packages).toBeTruthy()
      expect(packages?.normal.length).toBeGreaterThan(0)
      expect(packages?.first_time_bonus.length).toBeGreaterThan(0)

      // Check cost per pull calculations
      packages?.normal.forEach((pkg) => {
        expect(pkg.costPerPull).toBeTypeOf('number')

        // Only check for non-Infinity values when pulls > 0
        if (pkg.pullsFromPackage > 0) {
          expect(pkg.costPerPull).toBeGreaterThan(0)
          expect(pkg.costPerPull).not.toBe(Infinity)
        }
        else {
          expect(pkg.costPerPull).toBe(Infinity)
        }

        expect(pkg.pullsFromPackage).toBeGreaterThanOrEqual(0)
      })
    })

    it('analyzes game data efficiently', async () => {
      const { analyzeGame } = useGameAnalysis()
      const analysis = await measurePerformance(() => analyzeGame('hsr'))
      expectValidAnalysis(analysis)

      expect(analysis?.insights.bestPackage).toBeTruthy()
      expect(analysis?.insights.maxSavings).toBeGreaterThanOrEqual(0)
    })

    it('generates chart data from packages', () => {
      const { getProcessedPackages, generateChartsFromPackages } = useGameAnalysis()
      const packages = getProcessedPackages('hsr')
      expect(packages).toBeTruthy()

      if (packages) {
        const chartData = generateChartsFromPackages(packages)
        expect(chartData.scatterData).toBeInstanceOf(Array)
        expect(chartData.barData).toBeTypeOf('object')
      }
    })

    it('handles edge cases', () => {
      const { getProcessedPackages, analyzeGame } = useGameAnalysis()
      
      const packages = getProcessedPackages('invalid_game')
      expect(packages).toBeNull()

      const analysis = analyzeGame('invalid_game')
      expect(analysis).toBeNull()
    })
  })

  describe('useChartConfig', () => {
    const mockGameData = ref(createMockGameData())
    const { packageTypeColors, typeLabels, createChartOptions } = useChartConfig(mockGameData)

    it('provides package type colors', () => {
      expect(packageTypeColors).toBeTypeOf('object')
      expect(packageTypeColors.normal).toHaveProperty('bg')
      expect(packageTypeColors.normal).toHaveProperty('border')
    })

    it('provides type labels', () => {
      expect(typeLabels).toBeTypeOf('object')
      expect(typeLabels.normal).toBe('Normal Packages')
      expect(typeLabels.first_time_bonus).toBe('First-Time Bonus')
    })

    it('creates chart options correctly', () => {
      const scatterOptions = createChartOptions(true)
      const barOptions = createChartOptions(false)

      expect(scatterOptions).toBeTypeOf('object')
      expect(barOptions).toBeTypeOf('object')
      expect(scatterOptions.responsive).toBe(true)
      expect(barOptions.responsive).toBe(true)
    })
  })
})