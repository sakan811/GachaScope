import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AnalysisPage from '~/pages/games/[gameId]/analysis.vue'

describe('Analysis Page with Battle Pass', () => {
  it('renders battle pass section for HSR game', async () => {
    const component = await mountSuspended(AnalysisPage, {
      route: '/games/hsr/analysis'
    })

    // Should show battle pass section
    expect(component.text()).toContain('Battle Pass')
    expect(component.text()).toContain('Nameless Glory')
    expect(component.text()).toContain('Nameless Medal')
    
    // Should show battle pass value analysis
    expect(component.text()).toContain('Battle Pass Value Analysis')
    expect(component.text()).toContain('Best Value')
    expect(component.text()).toContain('Total Value')
  })

  it('shows sections in correct order: subscription -> battle pass -> packages', async () => {
    const component = await mountSuspended(AnalysisPage, {
      route: '/games/hsr/analysis'
    })

    const htmlContent = component.html()
    
    // Check that sections appear in correct order
    const subscriptionIndex = htmlContent.indexOf('Subscription Packages')
    const battlePassIndex = htmlContent.indexOf('Battle Pass')
    const packageIndex = htmlContent.indexOf('Available Packages')
    
    expect(subscriptionIndex).toBeGreaterThan(-1)
    expect(battlePassIndex).toBeGreaterThan(-1)
    expect(packageIndex).toBeGreaterThan(-1)
    expect(subscriptionIndex).toBeLessThan(battlePassIndex)
    expect(battlePassIndex).toBeLessThan(packageIndex)
  })

  it('displays battle pass package details correctly', async () => {
    const component = await mountSuspended(AnalysisPage, {
      route: '/games/hsr/analysis'
    })

    // Check for Nameless Glory details
    expect(component.text()).toContain('$9.99')
    expect(component.text()).toContain('680 Stellar Jade')
    
    // Check for Nameless Medal details  
    expect(component.text()).toContain('$19.99')
    expect(component.text()).toContain('880 Stellar Jade')
  })

  it('includes battle pass packages in charts', async () => {
    const component = await mountSuspended(AnalysisPage, {
      route: '/games/hsr/analysis'
    })
    
    // Chart descriptions should mention battle passes
    expect(component.text()).toContain('battle passes')
    expect(component.text()).toContain('Different colors represent different package types')
  })

  it('shows battle pass with purple color theme', async () => {
    const component = await mountSuspended(AnalysisPage, {
      route: '/games/hsr/analysis'
    })

    // Should have purple-themed styling for battle pass
    expect(component.html()).toContain('bg-purple-50')
    expect(component.html()).toContain('border-purple-200')
    expect(component.html()).toContain('text-purple-600')
  })

  it('displays battle pass statistics correctly', async () => {
    const component = await mountSuspended(AnalysisPage, {
      route: '/games/hsr/analysis'
    })

    // Should show battle pass stats
    expect(component.text()).toContain('Best Value')
    expect(component.text()).toContain('Best Cost/Warp')
    expect(component.text()).toContain('Total Value')
    expect(component.text()).toContain('Total Warps')
  })

  it('handles battle pass names formatting correctly', async () => {
    const component = await mountSuspended(AnalysisPage, {
      route: '/games/hsr/analysis'
    })

    // Names should be properly formatted
    expect(component.text()).toContain('Nameless Glory')
    expect(component.text()).toContain('Nameless Medal')
  })
})