import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AnalysisPage from '~/pages/games/[gameId]/analysis.vue'

describe('Analysis Page - Infinity Handling', () => {
  it('displays "no warp for the cost" instead of infinity for zero-pull packages', async () => {
    const component = await mountSuspended(AnalysisPage, {
      route: '/games/hsr/analysis'
    })

    // Should not contain $Infinity or Infinity anywhere
    expect(component.text()).not.toContain('$Infinity')
    expect(component.text()).not.toContain('Infinity')
    
    // If there are packages with 0 warps, should show proper message
    const htmlContent = component.html()
    if (htmlContent.includes('0 warp')) {
      expect(component.text()).toContain('no warp for the cost')
    }
  })

  it('shows proper cost per pull formatting for valid packages', async () => {
    const component = await mountSuspended(AnalysisPage, {
      route: '/games/hsr/analysis'
    })

    // Should contain properly formatted cost per pull values
    expect(component.text()).toMatch(/\$\d+\.\d{2} per warp/)
    
    // Should have the updated header text
    expect(component.text()).toContain('In-App Purchase Analysis')
    expect(component.text()).toContain('Compare oneiric shards packages')
    expect(component.text()).toContain('optimal spending strategies')
  })

  it('has improved explanatory header content', async () => {
    const component = await mountSuspended(AnalysisPage, {
      route: '/games/hsr/analysis'
    })

    // Should have the updated header with better explanation
    expect(component.text()).toContain('In-App Purchase Analysis')
    expect(component.text()).toContain('Compare oneiric shards packages to find the best value')
    expect(component.text()).toContain('Discover savings, efficiency ratings, and optimal spending strategies')
  })

  it('maintains responsive design with updated text', async () => {
    const component = await mountSuspended(AnalysisPage, {
      route: '/games/hsr/analysis'
    })

    // Should have responsive text classes in header
    expect(component.html()).toContain('text-base sm:text-lg')
    expect(component.html()).toContain('max-w-3xl mx-auto')
    
    // Mobile and desktop views should be properly structured
    expect(component.html()).toContain('lg:hidden') // Mobile view
    expect(component.html()).toContain('hidden lg:block') // Desktop view
  })

  it('correctly handles package formatting in mobile and desktop views', async () => {
    const component = await mountSuspended(AnalysisPage, {
      route: '/games/hsr/analysis'
    })

    // Both views should use the formatCostPerPull function
    const htmlContent = component.html()
    
    // Should not contain any direct $Infinity references
    expect(htmlContent).not.toContain('$Infinity')
    expect(htmlContent).not.toContain('${pkg.costPerPull.toFixed(2)}')
    
    // Should use the formatting function
    expect(htmlContent).toContain('formatCostPerPull')
  })

  it('shows proper explanatory text in package type comparison', async () => {
    const component = await mountSuspended(AnalysisPage, {
      route: '/games/hsr/analysis'
    })

    // Should contain the updated explanatory text
    expect(component.text()).toContain('Each warp costs')
    
    // Should handle cases where packages provide no warps
    if (component.text().includes('no warp for the cost')) {
      expect(component.text()).toContain('This package provides no warps for the cost')
    }
  })
})