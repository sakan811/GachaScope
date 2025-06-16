import { describe, it, expect } from 'vitest'
import { useGameAnalysis } from '~/composables/useGameAnalysis'

describe('useGameAnalysis - Battle Pass Support', () => {
  const { getProcessedPackages, generateChartsFromPackages } = useGameAnalysis()

  it('should include battle pass packages in processed packages', async () => {
    const processedPackages = getProcessedPackages('hsr')
    expect(processedPackages).toBeTruthy()
    expect(processedPackages?.battle_pass).toBeDefined()
    expect(processedPackages?.battle_pass?.length).toBeGreaterThan(0)
    
    // Check battle pass packages have correct properties
    processedPackages?.battle_pass?.forEach(pkg => {
      expect(pkg.purchaseType).toBe('battle_pass')
      expect(pkg.name).toMatch(/Nameless (Glory|Medal)/)
      expect(pkg.totalAmount).toBeGreaterThan(0)
      expect(pkg.costPerPull).toBeGreaterThan(0)
    })
  })

  it('should include battle pass in chart data generation', async () => {
    const processedPackages = getProcessedPackages('hsr')
    const chartsData = generateChartsFromPackages(processedPackages!)
    
    // Should have battle pass in scatter data
    const battlePassScatterPoints = chartsData.scatterData.filter(point => point.type === 'battle_pass')
    expect(battlePassScatterPoints.length).toBeGreaterThan(0)
    
    // Should have battle pass in bar data
    expect(chartsData.barData.battle_pass).toBeDefined()
    expect(chartsData.barData.battle_pass.length).toBeGreaterThan(0)
    
    // Check battle pass chart data
    chartsData.barData.battle_pass.forEach(pkg => {
      expect(pkg.costPerPull).toBeGreaterThan(0)
      expect(pkg.costPerPull).not.toBe(Infinity)
    })
  })

  it('should calculate correct battle pass cost per pull', async () => {
    const processedPackages = getProcessedPackages('hsr')
    const battlePassPackages = processedPackages?.battle_pass || []
    
    // Find Nameless Glory
    const namelessGlory = battlePassPackages.find(pkg => pkg.name.includes('Glory'))
    if (namelessGlory) {
      // Glory: 680 base + 640 extra = 1320 total / 160 = 8.25 warps
      // $9.99 / 8.25 warps = ~$1.21 per warp
      expect(namelessGlory.totalAmount).toBe(1320)
      expect(namelessGlory.pullsFromPackage).toBe(8)
      expect(namelessGlory.costPerPull).toBeCloseTo(1.25, 1)
    }
    
    // Find Nameless Medal
    const namelessMedal = battlePassPackages.find(pkg => pkg.name.includes('Medal'))
    if (namelessMedal) {
      // Medal: 880 base + 640 extra = 1520 total / 160 = 9.5 warps
      // $19.99 / 9.5 warps = ~$2.10 per warp
      expect(namelessMedal.totalAmount).toBe(1520)
      expect(namelessMedal.pullsFromPackage).toBe(9)
      expect(namelessMedal.costPerPull).toBeCloseTo(2.22, 1)
    }
  })

  it('should handle all package types in chart generation', async () => {
    const processedPackages = getProcessedPackages('hsr')
    const chartsData = generateChartsFromPackages(processedPackages!)
    
    const expectedTypes = ['normal', 'first_time_bonus', 'subscription', 'battle_pass']
    
    // Check scatter data includes all types
    const scatterTypes = [...new Set(chartsData.scatterData.map(point => point.type))]
    expectedTypes.forEach(type => {
      expect(scatterTypes).toContain(type)
    })
    
    // Check bar data includes all relevant types
    expectedTypes.forEach(type => {
      if (chartsData.barData[type]) {
        expect(chartsData.barData[type].length).toBeGreaterThan(0)
      }
    })
  })

  it('should maintain correct package type separation', async () => {
    const processedPackages = getProcessedPackages('hsr')
    
    // Subscription should only contain Express Supply Pass
    expect(processedPackages?.subscription?.length).toBe(1)
    expect(processedPackages?.subscription?.[0].name).toContain('Express Supply Pass')
    
    // Battle pass should contain both Glory and Medal
    expect(processedPackages?.battle_pass?.length).toBe(2)
    const battlePassNames = processedPackages?.battle_pass?.map(pkg => pkg.name) || []
    expect(battlePassNames.some(name => name.includes('Glory'))).toBe(true)
    expect(battlePassNames.some(name => name.includes('Medal'))).toBe(true)
  })
})