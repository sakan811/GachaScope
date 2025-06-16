import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CombinedValueAnalysis from '~/components/analysis/CombinedValueAnalysis.vue'
import { getGameById } from '~/utils/gameRegistry'
import { useGameAnalysis } from '~/composables/useGameAnalysis'

describe('Updated CombinedValueAnalysis Component', () => {
  const { getProcessedPackages } = useGameAnalysis()
  
  it('renders only best overall value in overall stats', async () => {
    const gameData = getGameById('hsr')!
    const processedPackages = getProcessedPackages('hsr')!

    const component = await mountSuspended(CombinedValueAnalysis, {
      props: {
        gameData,
        processedPackages
      }
    })

    expect(component.text()).toContain('Best Overall Value')
    // Should NOT contain removed stats
    expect(component.text()).not.toContain('Best Cost/Warp')
    expect(component.text()).not.toContain('Maximum Savings')
    expect(component.text()).not.toContain('Total Packages')
  })

  it('shows package names instead of package counts in type comparison', async () => {
    const gameData = getGameById('hsr')!
    const processedPackages = getProcessedPackages('hsr')!

    const component = await mountSuspended(CombinedValueAnalysis, {
      props: {
        gameData,
        processedPackages
      }
    })

    expect(component.text()).toContain('Package Type Comparison')
    expect(component.text()).toContain('Best Package')
    
    // Should show actual package names
    expect(component.text()).toContain('Express Supply Pass')
    expect(component.text()).toContain('Oneiric Shard')
    
    // Should NOT contain package counts
    expect(component.text()).not.toContain('package')
    expect(component.text()).not.toContain('packages')
  })

  it('displays tier-based savings analysis for normal vs first-time bonus', async () => {
    const gameData = getGameById('hsr')!
    const processedPackages = getProcessedPackages('hsr')!

    const component = await mountSuspended(CombinedValueAnalysis, {
      props: {
        gameData,
        processedPackages
      }
    })

    expect(component.text()).toContain('Savings Analysis - Normal vs First-Time Bonus')
    expect(component.text()).toContain('Tier 1')
    expect(component.text()).toContain('Tier 2')
    expect(component.text()).toContain('% savings per warp')
    
    // Should show cost comparisons
    expect(component.text()).toContain('→')
  })

  it('shows correct savings calculations for each tier', async () => {
    const gameData = getGameById('hsr')!
    const processedPackages = getProcessedPackages('hsr')!

    const component = await mountSuspended(CombinedValueAnalysis, {
      props: {
        gameData,
        processedPackages
      }
    })

    // Should show tier pricing in tier names
    expect(component.text()).toContain('$0.99')
    expect(component.text()).toContain('$4.99')
    expect(component.text()).toContain('$14.99')
    
    // Should show percentage savings
    expect(component.text()).toMatch(/\d+\.\d+% savings/)
  })

  it('handles cases where normal or first-time bonus packages are missing', async () => {
    const gameData = getGameById('hsr')!
    const processedPackages = {
      normal: [],
      subscription: getProcessedPackages('hsr')!.subscription || [],
      battle_pass: getProcessedPackages('hsr')!.battle_pass || []
      // Missing first_time_bonus
    }

    const component = await mountSuspended(CombinedValueAnalysis, {
      props: {
        gameData,
        processedPackages
      }
    })

    // Should not show savings analysis when one type is missing
    expect(component.text()).not.toContain('Savings Analysis - Normal vs First-Time Bonus')
    
    // Should still render other sections
    expect(component.text()).toContain('Combined Value Analysis')
  })

  it('maintains monthly vs one-time analysis functionality', async () => {
    const gameData = getGameById('hsr')!
    const processedPackages = getProcessedPackages('hsr')!

    const component = await mountSuspended(CombinedValueAnalysis, {
      props: {
        gameData,
        processedPackages
      }
    })

    expect(component.text()).toContain('Monthly vs One-time Analysis')
    expect(component.text()).toContain('Monthly Subscriptions')
    expect(component.text()).toContain('One-time Purchases')
    expect(component.text()).toContain('Break-even')
  })

  it('sorts package types by best cost per pull', async () => {
    const gameData = getGameById('hsr')!
    const processedPackages = getProcessedPackages('hsr')!

    const component = await mountSuspended(CombinedValueAnalysis, {
      props: {
        gameData,
        processedPackages
      }
    })

    const html = component.html()
    
    // Express Supply Pass should appear first (lowest cost per pull)
    const subscriptionIndex = html.indexOf('Subscriptions')
    const normalIndex = html.indexOf('Normal Packages')
    
    expect(subscriptionIndex).toBeGreaterThan(-1)
    expect(normalIndex).toBeGreaterThan(-1)
    expect(subscriptionIndex).toBeLessThan(normalIndex)
  })

  it('displays proper color coding for different package types', async () => {
    const gameData = getGameById('hsr')!
    const processedPackages = getProcessedPackages('hsr')!

    const component = await mountSuspended(CombinedValueAnalysis, {
      props: {
        gameData,
        processedPackages
      }
    })

    // Check for maintained color classes
    expect(component.html()).toContain('bg-red-50') // Normal packages
    expect(component.html()).toContain('bg-green-50') // First-time bonus and best overall
    expect(component.html()).toContain('bg-blue-50') // Subscriptions
    expect(component.html()).toContain('bg-purple-50') // Battle pass
  })
})