import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CombinedValueAnalysis from '~/components/analysis/CombinedValueAnalysis.vue'
import { getGameById } from '~/utils/gameRegistry'
import { useGameAnalysis } from '~/composables/useGameAnalysis'

describe('CombinedValueAnalysis Component', () => {
  const { getProcessedPackages } = useGameAnalysis()
  
  it('renders combined value analysis with HSR data', async () => {
    const gameData = getGameById('hsr')!
    const processedPackages = getProcessedPackages('hsr')!

    const component = await mountSuspended(CombinedValueAnalysis, {
      props: {
        gameData,
        processedPackages
      }
    })

    expect(component.text()).toContain('Combined Value Analysis')
    expect(component.text()).toContain('Best Overall Value')
    expect(component.text()).toContain('Package Type Comparison')
  })

  it('shows overall best value statistics', async () => {
    const gameData = getGameById('hsr')!
    const processedPackages = getProcessedPackages('hsr')!

    const component = await mountSuspended(CombinedValueAnalysis, {
      props: {
        gameData,
        processedPackages
      }
    })

    expect(component.text()).toContain('Best Overall Value')
    expect(component.text()).toContain('Best Cost/Warp')
    expect(component.text()).toContain('Maximum Savings')
    expect(component.text()).toContain('Total Packages')
  })

  it('displays package type comparison for all types', async () => {
    const gameData = getGameById('hsr')!
    const processedPackages = getProcessedPackages('hsr')!

    const component = await mountSuspended(CombinedValueAnalysis, {
      props: {
        gameData,
        processedPackages
      }
    })

    expect(component.text()).toContain('Package Type Comparison')
    expect(component.text()).toContain('Normal Packages')
    expect(component.text()).toContain('First-Time Bonus')
    expect(component.text()).toContain('Subscriptions')
    expect(component.text()).toContain('Battle Pass')
  })

  it('shows savings analysis between package types', async () => {
    const gameData = getGameById('hsr')!
    const processedPackages = getProcessedPackages('hsr')!

    const component = await mountSuspended(CombinedValueAnalysis, {
      props: {
        gameData,
        processedPackages
      }
    })

    expect(component.text()).toContain('Savings Analysis')
    expect(component.text()).toContain('First-Time Bonus Savings')
    expect(component.text()).toContain('Savings Percentage')
  })

  it('displays monthly vs one-time analysis', async () => {
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
    expect(component.text()).toContain('Monthly Cost')
    expect(component.text()).toContain('Annual Cost')
  })

  it('handles missing package types gracefully', async () => {
    const gameData = getGameById('hsr')!
    const processedPackages = {
      normal: [],
      first_time_bonus: []
      // Missing subscription and battle_pass
    }

    const component = await mountSuspended(CombinedValueAnalysis, {
      props: {
        gameData,
        processedPackages
      }
    })

    // Should still render without errors
    expect(component.text()).toContain('Combined Value Analysis')
  })

  it('calculates best overall value correctly', async () => {
    const gameData = getGameById('hsr')!
    const processedPackages = getProcessedPackages('hsr')!

    const component = await mountSuspended(CombinedValueAnalysis, {
      props: {
        gameData,
        processedPackages
      }
    })

    // Express Supply Pass should be the best value
    expect(component.text()).toContain('Express Supply Pass')
  })

  it('shows proper color coding for different package types', async () => {
    const gameData = getGameById('hsr')!
    const processedPackages = getProcessedPackages('hsr')!

    const component = await mountSuspended(CombinedValueAnalysis, {
      props: {
        gameData,
        processedPackages
      }
    })

    // Check for color classes
    expect(component.html()).toContain('bg-red-50') // Normal packages
    expect(component.html()).toContain('bg-green-50') // First-time bonus
    expect(component.html()).toContain('bg-blue-50') // Subscriptions
    expect(component.html()).toContain('bg-purple-50') // Battle pass
  })

  it('displays break-even analysis for monthly vs one-time', async () => {
    const gameData = getGameById('hsr')!
    const processedPackages = getProcessedPackages('hsr')!

    const component = await mountSuspended(CombinedValueAnalysis, {
      props: {
        gameData,
        processedPackages
      }
    })

    expect(component.text()).toContain('Break-even')
    expect(component.text()).toContain('months')
  })
})