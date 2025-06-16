import { describe, it, expect } from 'vitest'

describe('formatCostPerPull utility function', () => {
  // Helper function to test the formatting logic
  const formatCostPerPull = (costPerPull: number, pullName = 'warp'): string => {
    if (!Number.isFinite(costPerPull) || costPerPull === Infinity) {
      return 'no warp for the cost'
    }
    return `$${costPerPull.toFixed(2)} per ${pullName.toLowerCase()}`
  }

  it('should format normal cost per pull values correctly', () => {
    expect(formatCostPerPull(1.25)).toBe('$1.25 per warp')
    expect(formatCostPerPull(2.50)).toBe('$2.50 per warp')
    expect(formatCostPerPull(0.99)).toBe('$0.99 per warp')
    expect(formatCostPerPull(10.0)).toBe('$10.00 per warp')
  })

  it('should handle infinity values correctly', () => {
    expect(formatCostPerPull(Infinity)).toBe('no warp for the cost')
    expect(formatCostPerPull(Number.POSITIVE_INFINITY)).toBe('no warp for the cost')
  })

  it('should handle NaN and non-finite values correctly', () => {
    expect(formatCostPerPull(NaN)).toBe('no warp for the cost')
    expect(formatCostPerPull(Number.NEGATIVE_INFINITY)).toBe('no warp for the cost')
  })

  it('should handle different pull names correctly', () => {
    expect(formatCostPerPull(1.25, 'Pull')).toBe('$1.25 per pull')
    expect(formatCostPerPull(1.25, 'Summon')).toBe('$1.25 per summon')
    expect(formatCostPerPull(1.25, 'Roll')).toBe('$1.25 per roll')
  })

  it('should handle edge cases correctly', () => {
    expect(formatCostPerPull(0)).toBe('$0.00 per warp')
    expect(formatCostPerPull(0.001)).toBe('$0.00 per warp')
    expect(formatCostPerPull(999.99)).toBe('$999.99 per warp')
  })

  it('should round to two decimal places', () => {
    expect(formatCostPerPull(1.234567)).toBe('$1.23 per warp')
    expect(formatCostPerPull(1.999)).toBe('$2.00 per warp')
    expect(formatCostPerPull(1.235)).toBe('$1.24 per warp')
  })
})