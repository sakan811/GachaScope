import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AnalysisPage from '~/pages/games/[gameId]/analysis.vue'

describe('Analysis Page with Combined Value Analysis', () => {
  it('renders combined value analysis instead of separate sections', async () => {
    const component = await mountSuspended(AnalysisPage, {
      route: '/games/hsr/analysis'
    })

    // Should show combined value analysis
    expect(component.text()).toContain('Combined Value Analysis')
    expect(component.text()).toContain('Best Overall Value')
    expect(component.text()).toContain('Package Type Comparison')
    
    // Should NOT show individual subscription/battle pass sections
    expect(component.text()).not.toContain('Subscription Value Analysis')
    expect(component.text()).not.toContain('Battle Pass Value Analysis')
  })

  it('shows all package types in the packages section', async () => {
    const component = await mountSuspended(AnalysisPage, {
      route: '/games/hsr/analysis'
    })

    // Should show all package types
    expect(component.text()).toContain('Available Packages')
    expect(component.text()).toContain('Subscription Packages')
    expect(component.text()).toContain('Battle Pass')
    expect(component.text()).toContain('Normal Packages')
    expect(component.text()).toContain('First-Time Bonus Packages')
  })

  it('displays combined value analysis before packages section', async () => {
    const component = await mountSuspended(AnalysisPage, {
      route: '/games/hsr/analysis'
    })

    const htmlContent = component.html()
    
    const combinedAnalysisIndex = htmlContent.indexOf('Combined Value Analysis')
    const packagesIndex = htmlContent.indexOf('Available Packages')
    
    expect(combinedAnalysisIndex).toBeGreaterThan(-1)
    expect(packagesIndex).toBeGreaterThan(-1)
    expect(combinedAnalysisIndex).toBeLessThan(packagesIndex)
  })

  it('shows monthly vs one-time analysis in combined section', async () => {
    const component = await mountSuspended(AnalysisPage, {
      route: '/games/hsr/analysis'
    })

    expect(component.text()).toContain('Monthly vs One-time Analysis')
    expect(component.text()).toContain('Monthly Subscriptions')
    expect(component.text()).toContain('One-time Purchases')
    expect(component.text()).toContain('Annual Cost')
  })

  it('displays savings analysis across all package types', async () => {
    const component = await mountSuspended(AnalysisPage, {
      route: '/games/hsr/analysis'
    })

    expect(component.text()).toContain('Savings Analysis')
    expect(component.text()).toContain('First-Time Bonus Savings')
    expect(component.text()).toContain('Savings Percentage')
  })

  it('maintains proper responsive layout', async () => {
    const component = await mountSuspended(AnalysisPage, {
      route: '/games/hsr/analysis'
    })

    // Check for responsive grid classes
    expect(component.html()).toContain('grid-cols-1 sm:grid-cols-2 lg:grid-cols-4')
    expect(component.html()).toContain('block lg:hidden') // Mobile view
    expect(component.html()).toContain('hidden lg:block') // Desktop view
  })

  it('shows all package types with correct color coding', async () => {
    const component = await mountSuspended(AnalysisPage, {
      route: '/games/hsr/analysis'
    })

    // Check for all package type colors
    expect(component.html()).toContain('bg-blue-50') // Subscription
    expect(component.html()).toContain('bg-purple-50') // Battle pass
    expect(component.html()).toContain('bg-red-50') // Normal
    expect(component.html()).toContain('bg-green-50') // First-time bonus
  })

  it('organizes packages properly on desktop with 2-column layout', async () => {
    const component = await mountSuspended(AnalysisPage, {
      route: '/games/hsr/analysis'
    })

    const htmlContent = component.html()
    
    // Should have 2-column grid on desktop
    expect(htmlContent).toContain('grid-cols-2 gap-8')
    
    // Should have subscription and normal in left column
    const leftColumnStart = htmlContent.indexOf('<!-- Left Column -->')
    const rightColumnStart = htmlContent.indexOf('<!-- Right Column -->')
    
    expect(leftColumnStart).toBeGreaterThan(-1)
    expect(rightColumnStart).toBeGreaterThan(leftColumnStart)
  })

  it('displays charts with updated descriptions', async () => {
    const component = await mountSuspended(AnalysisPage, {
      route: '/games/hsr/analysis'
    })

    expect(component.text()).toContain('Cost vs Warps Obtained')
    expect(component.text()).toContain('Package Efficiency Comparison')
    expect(component.text()).toContain('all package types')
    expect(component.text()).toContain('Different colors represent different package types')
  })
})