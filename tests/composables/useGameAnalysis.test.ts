import { describe, it, expect } from 'vitest'
import { useGameAnalysis } from '~/composables/useGameAnalysis'
import { hsrGameData } from '~/utils/gameRegistry'

describe('useGameAnalysis', () => {
  const { analyzeGame, processPackage } = useGameAnalysis()

  it('should identify the correct best package for HSR', () => {
    const analysis = analyzeGame('hsr')
    
    expect(analysis).toBeTruthy()
    expect(analysis?.insights.bestPackageName).not.toBe('Oneiric Shard ×1980 (First Purchase)')
    
    // Let's manually calculate the best package to verify
    const pullCost = hsrGameData.metadata.pull.cost // 160 shards per warp
    
    // Process all packages to find actual best cost per pull
    const allPackages = [
      ...hsrGameData.packages.normal || [],
      ...hsrGameData.packages.first_time_bonus || []
    ].map(pkg => processPackage(pkg, pullCost))
    
    const validPackages = allPackages.filter(pkg => pkg.pullsFromPackage > 0)
    const actualBest = validPackages.reduce((best, curr) => 
      curr.costPerPull < best.costPerPull ? curr : best
    )
    
    expect(analysis?.insights.bestPackageName).toBe(actualBest.name)
    expect(analysis?.insights.bestPackage?.costPerPull).toBe(actualBest.costPerPull)
  })

  it('should calculate correct cost per pull for HSR packages', () => {
    const pullCost = 160 // HSR pull cost
    
    // Test normal package (6480 + 1600 = 8080 shards for $99.99)
    const normalPkg = hsrGameData.packages.normal?.[5]! // highest tier
    const processedNormal = processPackage(normalPkg, pullCost)
    
    expect(processedNormal.totalAmount).toBe(8080) // 6480 + 1600
    expect(processedNormal.pullsFromPackage).toBe(50) // 8080 / 160
    expect(processedNormal.costPerPull).toBeCloseTo(1.9998, 4) // $99.99 / 50
    
    // Test first-time bonus package (6480 + 6480 = 12960 shards for $99.99)
    const bonusPkg = hsrGameData.packages.first_time_bonus?.[5]! // highest tier
    const processedBonus = processPackage(bonusPkg, pullCost)
    
    expect(processedBonus.totalAmount).toBe(12960) // 6480 + 6480
    expect(processedBonus.pullsFromPackage).toBe(81) // 12960 / 160
    expect(processedBonus.costPerPull).toBeCloseTo(1.2345, 4) // $99.99 / 81
    
    // The first-time bonus should be better value
    expect(processedBonus.costPerPull).toBeLessThan(processedNormal.costPerPull)
  })

  it('should handle packages with zero pulls correctly', () => {
    const pullCost = 160
    
    // Test smallest package that doesn't give a full pull
    const smallPkg = hsrGameData.packages.normal?.[0]! // 60 + 0 = 60 shards for $0.99
    const processed = processPackage(smallPkg, pullCost)
    
    expect(processed.totalAmount).toBe(60)
    expect(processed.pullsFromPackage).toBe(0) // 60 / 160 = 0 (floor)
    expect(processed.costPerPull).toBe(Infinity)
    expect(processed.leftoverAmount).toBe(60) // 60 % 160
  })

  it('should exclude packages with infinite cost per pull from best package calculation', () => {
    const analysis = analyzeGame('hsr')
    
    // The best package should never have Infinity cost per pull
    expect(analysis?.insights.bestPackage?.costPerPull).not.toBe(Infinity)
    expect(analysis?.insights.bestPackage?.pullsFromPackage).toBeGreaterThan(0)
  })
})
