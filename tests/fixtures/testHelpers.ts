import { expect } from 'vitest'
import type { ProcessedPackage, GameData } from '~/types/games'

// Simplified mock data for testing
export const createMockPackage = (overrides: Partial<ProcessedPackage> = {}): ProcessedPackage => ({
  id: 'test_pkg',
  name: 'Test Package',
  baseAmount: 1000,
  price: 10.00,
  extraAmount: 100,
  purchaseType: 'normal',
  currency: 'test_currency',
  totalAmount: 1100,
  amountPerDollar: 110,
  pullsFromPackage: 6,
  costPerPull: 1.67,
  leftoverAmount: 40,
  efficiency: 110,
  ...overrides,
})

export const createMockGameData = (overrides: Partial<GameData> = {}): GameData => ({
  metadata: {
    id: 'test_game',
    name: 'Test Game',
    shortName: 'TG',
    currency: { name: 'Test Currency', shortName: 'TC' },
    pull: { name: 'Pull', cost: 160 },
    analysisConfig: {
      maxScenarios: 10,
      includeMultiPackage: true,
      maxPackageMultiplier: 2,
    },
  },
  packages: {
    normal: [createMockPackage()],
    first_time_bonus: [createMockPackage({ purchaseType: 'first_time_bonus', extraAmount: 1000 })],
  },
  ...overrides,
})

// Test utilities
export const expectValidPackage = (pkg: ProcessedPackage) => {
  expect(pkg.id).toBeTruthy()
  expect(pkg.name).toBeTruthy()
  expect(pkg.price).toBeGreaterThan(0)
  expect(pkg.totalAmount).toBeGreaterThan(0)
  expect(pkg.costPerPull).toBeTypeOf('number')
}

export const expectValidAnalysis = (analysis: any) => {
  expect(analysis).toBeTruthy()
  expect(analysis.insights).toBeTruthy()
  expect(analysis.scenarios).toBeTruthy()
  expect(analysis.chartData).toBeTruthy()
}

// Performance testing helper
export const measurePerformance = async <T>(fn: () => T | Promise<T>, maxMs = 100): Promise<T> => {
  const start = performance.now()
  const result = await fn()
  const duration = performance.now() - start
  expect(duration).toBeLessThan(maxMs)
  return result
}
