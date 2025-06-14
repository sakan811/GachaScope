import { describe, it, expect } from 'vitest'
import { useGameAnalysis } from '~/composables/useGameAnalysis'
import type { ProcessedPackage } from '~/types/games'

describe('useGameAnalysis - Chart Generation', () => {
  const { generateChartsFromPackages, processPackage } = useGameAnalysis()

  const mockProcessedPackages: Record<string, ProcessedPackage[]> = {
    normal: [
      {
        id: 'n1',
        name: 'Normal Package 1',
        baseAmount: 980,
        price: 14.99,
        extraAmount: 110,
        purchaseType: 'normal',
        currency: 'shards',
        totalAmount: 1090,
        amountPerDollar: 72.72,
        pullsFromPackage: 6,
        costPerPull: 2.50,
        leftoverAmount: 130,
        efficiency: 72.72
      }
    ],
    first_time_bonus: [
      {
        id: 'b1',
        name: 'Bonus Package 1',
        baseAmount: 980,
        price: 14.99,
        extraAmount: 980,
        purchaseType: 'first_time_bonus',
        currency: 'shards',
        totalAmount: 1960,
        amountPerDollar: 130.75,
        pullsFromPackage: 12,
        costPerPull: 1.25,
        leftoverAmount: 80,
        efficiency: 130.75
      }
    ],
    subscription: [
      {
        id: 's1',
        name: 'Monthly Pass',
        baseAmount: 300,
        price: 4.99,
        extraAmount: 2700,
        purchaseType: 'subscription',
        currency: 'shards',
        totalAmount: 3000,
        amountPerDollar: 601.2,
        pullsFromPackage: 18,
        costPerPull: 0.28,
        leftoverAmount: 120,
        efficiency: 601.2
      },
      {
        id: 's2',
        name: 'Battle Pass',
        baseAmount: 680,
        price: 9.99,
        extraAmount: 0,
        purchaseType: 'subscription',
        currency: 'shards',
        totalAmount: 680,
        amountPerDollar: 68.07,
        pullsFromPackage: 4,
        costPerPull: 2.50,
        leftoverAmount: 40,
        efficiency: 68.07
      }
    ]
  }

  it('generates scatter chart data for all package types', () => {
    const result = generateChartsFromPackages(mockProcessedPackages)
    
    expect(result.scatterData).toHaveLength(4) // 1 normal + 1 bonus + 2 subscription
    
    // Check normal package
    const normalPoint = result.scatterData.find(p => p.type === 'normal')
    expect(normalPoint).toEqual({
      x: 6,
      y: 14.99,
      packageName: 'Normal Package 1',
      type: 'normal'
    })
    
    // Check subscription package
    const subscriptionPoint = result.scatterData.find(p => p.packageName === 'Monthly Pass')
    expect(subscriptionPoint).toEqual({
      x: 18,
      y: 4.99,
      packageName: 'Monthly Pass',
      type: 'subscription'
    })
  })

  it('generates grouped bar chart data excluding zero-pull packages', () => {
    const result = generateChartsFromPackages(mockProcessedPackages)
    
    // Should have 3 types (normal, first_time_bonus, subscription)
    expect(Object.keys(result.barData)).toHaveLength(3)
    expect(result.barData.normal).toHaveLength(1)
    expect(result.barData.first_time_bonus).toHaveLength(1)
    expect(result.barData.subscription).toHaveLength(2)
    
    // Check subscription data includes both packages
    expect(result.barData.subscription[0]).toEqual({
      package: 'Monthly Pass',
      costPerPull: 0.28
    })
    expect(result.barData.subscription[1]).toEqual({
      package: 'Battle Pass',
      costPerPull: 2.50
    })
  })

  it('handles packages with zero pulls correctly', () => {
    const packagesWithZeroPulls: Record<string, ProcessedPackage[]> = {
      normal: [
        {
          id: 'n1',
          name: 'Tiny Package',
          baseAmount: 60,
          price: 0.99,
          extraAmount: 0,
          purchaseType: 'normal',
          currency: 'shards',
          totalAmount: 60,
          amountPerDollar: 60.61,
          pullsFromPackage: 0, // Zero pulls
          costPerPull: Infinity,
          leftoverAmount: 60,
          efficiency: 60.61
        }
      ]
    }
    
    const result = generateChartsFromPackages(packagesWithZeroPulls)
    
    // Should still include in scatter data
    expect(result.scatterData).toHaveLength(1)
    expect(result.scatterData[0]).toEqual({
      x: 0,
      y: 0.99,
      packageName: 'Tiny Package',
      type: 'normal'
    })
    
    // Should NOT include in bar data (zero pulls)
    expect(result.barData.normal).toHaveLength(0)
  })

  it('handles empty packages correctly', () => {
    const result = generateChartsFromPackages({})
    
    expect(result.scatterData).toHaveLength(0)
    expect(Object.keys(result.barData)).toHaveLength(0)
  })

  it('correctly processes packages with different cost per pull values', () => {
    const testPackage = {
      id: 'test',
      name: 'Test Package',
      baseAmount: 6480,
      price: 99.99,
      extraAmount: 6480,
      purchaseType: 'first_time_bonus' as const,
      currency: 'shards'
    }
    
    const processed = processPackage(testPackage, 160)
    
    expect(processed.totalAmount).toBe(12960)
    expect(processed.pullsFromPackage).toBe(81)
    expect(processed.costPerPull).toBeCloseTo(1.2345679, 5)
    expect(processed.leftoverAmount).toBe(0)
    expect(processed.efficiency).toBeCloseTo(129.6130, 3)
  })
})
