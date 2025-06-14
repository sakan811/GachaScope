import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AnalysisPage from '~/pages/games/[gameId]/analysis.vue'

describe('Analysis Page with Subscriptions', () => {
  it('renders subscription section for HSR game', async () => {
    const component = await mountSuspended(AnalysisPage, {
      route: '/games/hsr/analysis'
    })

    // Should show subscription packages section
    expect(component.text()).toContain('Subscription Packages')
    expect(component.text()).toContain('Express Supply Pass')
    expect(component.text()).toContain('Nameless Glory')
    
    // Should show subscription value analysis
    expect(component.text()).toContain('Subscription Value Analysis')
    expect(component.text()).toContain('Best Value')
    expect(component.text()).toContain('Monthly Total')
  })

  it('shows all package types in correct order', async () => {
    const component = await mountSuspended(AnalysisPage, {
      route: '/games/hsr/analysis'
    })

    const htmlContent = component.html()
    
    // Check that subscription section appears before package comparison
    const subscriptionIndex = htmlContent.indexOf('Subscription Packages')
    const packageIndex = htmlContent.indexOf('Available Packages')
    
    expect(subscriptionIndex).toBeGreaterThan(-1)
    expect(packageIndex).toBeGreaterThan(-1)
    expect(subscriptionIndex).toBeLessThan(packageIndex)
  })

  it('displays subscription package details correctly', async () => {
    const component = await mountSuspended(AnalysisPage, {
      route: '/games/hsr/analysis'
    })

    // Check for Express Supply Pass details
    expect(component.text()).toContain('$4.99')
    expect(component.text()).toContain('300 Oneiric Shards immediately')
    
    // Check for Nameless Glory details  
    expect(component.text()).toContain('$9.99')
    expect(component.text()).toContain('Battle Pass')
  })
})
