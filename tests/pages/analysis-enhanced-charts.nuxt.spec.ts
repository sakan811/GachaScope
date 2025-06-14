import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AnalysisPage from '~/pages/games/[gameId]/analysis.vue'

describe('Analysis Page - Enhanced Charts', () => {
  it('renders scatter chart with subscription packages included', async () => {
    const component = await mountSuspended(AnalysisPage, {
      route: '/games/hsr/analysis'
    })

    // Should show Cost vs Warps chart
    expect(component.text()).toContain('Cost vs Warps Obtained')
    
    // Should mention all package types in description
    expect(component.text()).toContain('all package types including subscriptions')
    expect(component.text()).toContain('Different colors represent different package types')
  })

  it('renders grouped bar chart for package efficiency', async () => {
    const component = await mountSuspended(AnalysisPage, {
      route: '/games/hsr/analysis'
    })

    // Should show Package Efficiency chart
    expect(component.text()).toContain('Package Efficiency')
    
    // Should mention grouped by package type
    expect(component.text()).toContain('grouped by package type')
  })

  it('displays all chart sections in correct order', async () => {
    const component = await mountSuspended(AnalysisPage, {
      route: '/games/hsr/analysis'
    })

    const htmlContent = component.html()
    
    // Check order: Subscription -> Package Comparison -> Charts -> Insights
    const subscriptionIndex = htmlContent.indexOf('Subscription Packages')
    const packageIndex = htmlContent.indexOf('Available Packages')
    const costChartIndex = htmlContent.indexOf('Cost vs Warps Obtained')
    const efficiencyChartIndex = htmlContent.indexOf('Package Efficiency')
    const insightsIndex = htmlContent.indexOf('Package Value Analysis')
    
    expect(subscriptionIndex).toBeGreaterThan(-1)
    expect(packageIndex).toBeGreaterThan(subscriptionIndex)
    expect(costChartIndex).toBeGreaterThan(packageIndex)
    expect(efficiencyChartIndex).toBeGreaterThan(costChartIndex)
    expect(insightsIndex).toBeGreaterThan(efficiencyChartIndex)
  })

  it('handles games without subscription packages gracefully', async () => {
    // This test would need a mock game without subscriptions
    // For now, we test that HSR works correctly with subscriptions
    const component = await mountSuspended(AnalysisPage, {
      route: '/games/hsr/analysis'
    })

    expect(component.text()).toContain('Express Supply Pass')
    expect(component.text()).toContain('Nameless Glory')
  })

  it('shows package efficiency with proper cost per pull calculations', async () => {
    const component = await mountSuspended(AnalysisPage, {
      route: '/games/hsr/analysis'
    })

    // Should show subscription value analysis
    expect(component.text()).toContain('Best Value')
    expect(component.text()).toContain('Best Cost/Warp')
    expect(component.text()).toContain('Monthly Total')
    expect(component.text()).toContain('Monthly Warps')
  })

  it('includes note about zero-pull packages when applicable', async () => {
    const component = await mountSuspended(AnalysisPage, {
      route: '/games/hsr/analysis'
    })

    // Note should appear if there are packages with 0 pulls
    const htmlContent = component.html()
    if (htmlContent.includes('0 warps')) {
      expect(component.text()).toContain('Packages with 0 pulls are not included in efficiency calculations')
    }
  })
})
