import { describe, it, expect } from 'vitest'
import { useGameAnalysis } from '~/composables/useGameAnalysis'

describe('useGameAnalysis - generateInsights', () => {
  const { analyzeGame, processPackage } = useGameAnalysis()

  it('should identify the correct best package with lowest cost per pull', () => {
    const analysis = analyzeGame('hsr')
    
    expect(analysis).toBeTruthy()
    expect(analysis?.insights.bestPackageName).toBe('Oneiric Shard ×6480 (First Purchase)')
    expect(analysis?.insights.bestPackage?.costPerPull).toBeCloseTo(1.2345679, 5)
  })

  it('should exclude packages with zero pulls from best package selection', () => {
    const analysis = analyzeGame('hsr')
    
    expect(analysis?.insights.bestPackage?.pullsFromPackage).toBeGreaterThan(0)
    expect(analysis?.insights.bestPackage?.costPerPull).not.toBe(Infinity)
  })

  it('should correctly process package calculations', () => {
    const pullCost = 160
    const testPackage = {
      id: 'test',
      name: 'Test Package',
      baseAmount: 6480,
      price: 99.99,
      extraAmount: 6480,
      purchaseType: 'first_time_bonus' as const,
      currency: 'shards'
    }
    
    const processed = processPackage(testPackage, pullCost)
    
    expect(processed.totalAmount).toBe(12960)
    expect(processed.pullsFromPackage).toBe(81)
    expect(processed.costPerPull).toBeCloseTo(1.2345679, 5)
    expect(processed.leftoverAmount).toBe(0)
  })

  it('should have valid insights structure', () => {
    const analysis = analyzeGame('hsr')
    
    expect(analysis?.insights).toHaveProperty('bestPackage')
    expect(analysis?.insights).toHaveProperty('bestPackageName')
    expect(analysis?.insights).toHaveProperty('maxSavings')
    expect(analysis?.insights).toHaveProperty('avgSavings')
    expect(analysis?.insights.bestPackage).not.toBeNull()
    expect(typeof analysis?.insights.bestPackageName).toBe('string')
  })
})
