import { expect } from 'vitest'
import type { ProcessedPurchase, GameData } from '~/types/games'

// Simplified mock data for testing
export const createMockPurchase = (overrides: Partial<ProcessedPurchase> = {}): ProcessedPurchase => ({
  id: 'test_purchase',
  name: 'Test Purchase',
  baseAmount: 1000,
  price: 10.00,
  extraAmount: 100,
  purchaseType: 'normal',
  currency: 'test_currency',
  totalAmount: 1100,
  amountPerDollar: 110,
  pullsFromPurchase: 6,
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
      includeMultiPurchase: true,
      maxPurchaseMultiplier: 2,
    },
  },
  packages: {
    normal: [createMockPurchase()],
    first_time_bonus: [createMockPurchase({ purchaseType: 'first_time_bonus', extraAmount: 1000 })],
  },
  ...overrides,
})

// Test utilities
export const expectValidPurchase = (purchase: ProcessedPurchase) => {
  expect(purchase.id).toBeTruthy()
  expect(purchase.name).toBeTruthy()
  expect(purchase.price).toBeGreaterThan(0)
  expect(purchase.totalAmount).toBeGreaterThan(0)
  expect(purchase.costPerPull).toBeTypeOf('number')
}

export const expectValidAnalysis = (analysis: { insights: unknown, scenarios: unknown, chartData: unknown }) => {
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

// Legacy helper for backward compatibility
export const createMockPackage = createMockPurchase
export const expectValidPackage = expectValidPurchase
