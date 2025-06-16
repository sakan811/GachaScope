import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Index from '~/pages/index.vue'

describe('Index Page Responsive', () => {
  it('should render the responsive home page without errors', async () => {
    const component = await mountSuspended(Index)
    expect(component.text()).toContain('GachaScope')
    expect(component.text()).toContain('ultimate analysis tool')
  })

  it('should have responsive hero section with proper typography scaling', async () => {
    const component = await mountSuspended(Index)
    
    // Should have responsive text classes
    expect(component.html()).toContain('text-3xl sm:text-4xl md:text-5xl lg:text-6xl')
    expect(component.html()).toContain('text-base sm:text-lg lg:text-xl')
    
    // Should have CTA buttons
    expect(component.text()).toContain('Start Analysis')
    expect(component.text()).toContain('Learn More')
  })

  it('should display responsive CTA buttons with proper layout', async () => {
    const component = await mountSuspended(Index)
    
    // Should have responsive flex layout
    expect(component.html()).toContain('flex-col sm:flex-row')
    expect(component.html()).toContain('w-full sm:w-auto')
    
    // Should have proper button sizing
    expect(component.html()).toContain('size="lg"')
    expect(component.html()).toContain('px-6 sm:px-8 py-3')
  })

  it('should show responsive features section with proper grid', async () => {
    const component = await mountSuspended(Index)
    
    // Should have features section
    expect(component.text()).toContain('Why Choose GachaScope?')
    expect(component.text()).toContain('Package Analysis')
    expect(component.text()).toContain('Cost Optimization')
    expect(component.text()).toContain('Visual Insights')
    
    // Should have responsive grid
    expect(component.html()).toContain('grid-cols-1 md:grid-cols-2 lg:grid-cols-3')
  })

  it('should display responsive package statistics with proper grid layout', async () => {
    const component = await mountSuspended(Index)
    
    // Should have package insights section
    expect(component.text()).toContain('Package Insights')
    expect(component.text()).toContain('Maximum Savings Available')
    expect(component.text()).toContain('Best Cost per Pull')
    
    // Should have responsive grid for stats
    expect(component.html()).toContain('grid-cols-1 sm:grid-cols-2 lg:grid-cols-4')
  })

  it('should show responsive supported games section', async () => {
    const component = await mountSuspended(Index)
    
    // Should have games section
    expect(component.text()).toContain('Supported Games')
    expect(component.text()).toContain('HSR Analysis')
    
    // Should have responsive grid for games
    expect(component.html()).toContain('grid-cols-1 sm:grid-cols-2 lg:grid-cols-3')
  })

  it('should have working responsive navigation links', async () => {
    const component = await mountSuspended(Index)
    
    // Should have links to analysis page
    const analysisLinks = component.findAll('a[href="/games/hsr/analysis"]')
    expect(analysisLinks.length).toBeGreaterThan(0)
    
    // Should have anchor links
    const anchorLinks = component.findAll('a[href="#features"]')
    expect(anchorLinks.length).toBeGreaterThan(0)
  })

  it('should display responsive comparison examples', async () => {
    const component = await mountSuspended(Index)
    
    // Should have comparison section
    expect(component.text()).toContain('Package Comparison Example')
    expect(component.text()).toContain('Standard Package')
    expect(component.text()).toContain('Bonus Package')
    
    // Should have savings information
    expect(component.text()).toContain('Save $')
    expect(component.text()).toContain('More Value!')
    
    // Should have responsive grid for comparison
    expect(component.html()).toContain('grid-cols-1 lg:grid-cols-2')
  })

  it('should have proper responsive spacing throughout', async () => {
    const component = await mountSuspended(Index)
    
    // Should have responsive padding/margin classes
    expect(component.html()).toContain('py-12 sm:py-16 lg:py-20')
    expect(component.html()).toContain('px-4 sm:px-6 lg:px-8')
    expect(component.html()).toContain('mb-4 sm:mb-6')
    expect(component.html()).toContain('gap-4 sm:gap-6 lg:gap-8')
  })

  it('should have responsive badges and UI elements', async () => {
    const component = await mountSuspended(Index)
    
    // Should have badges with proper sizing
    expect(component.html()).toContain('size="xs"')
    expect(component.html()).toContain('variant="soft"')
    
    // Should have proper text sizing for badges
    expect(component.html()).toContain('text-xs')
  })

  it('should have touch-friendly interactive elements', async () => {
    const component = await mountSuspended(Index)
    
    // Cards should have hover effects and proper sizing
    expect(component.html()).toContain('hover:scale-105')
    expect(component.html()).toContain('hover:shadow-lg')
    expect(component.html()).toContain('transition-all')
    
    // Should have proper cursor indication
    expect(component.html()).toContain('cursor-pointer')
  })

  it('should have responsive emoji and icon sizing', async () => {
    const component = await mountSuspended(Index)
    
    // Hero emoji should be responsive
    expect(component.html()).toContain('text-4xl sm:text-5xl lg:text-6xl')
    
    // Feature icons should have proper sizing
    expect(component.html()).toContain('text-2xl sm:text-3xl')
    
    // UI icons should have responsive sizing
    expect(component.html()).toContain('w-4 h-4 sm:w-5 sm:h-5')
  })

  it('should handle mobile-first responsive design patterns', async () => {
    const component = await mountSuspended(Index)
    
    // Should use mobile-first breakpoints consistently
    const mobileFirstPattern = /(?:^|\s)(sm:|md:|lg:|xl:)/g
    const htmlContent = component.html()
    const matches = htmlContent.match(mobileFirstPattern)
    
    expect(matches).toBeTruthy()
    expect(matches?.length).toBeGreaterThan(10) // Should have many responsive classes
  })

  it('should have proper content hierarchy for screen readers', async () => {
    const component = await mountSuspended(Index)
    
    // Should have proper heading hierarchy
    expect(component.html()).toContain('<h1')
    expect(component.html()).toContain('<h2')
    expect(component.html()).toContain('<h3')
    
    // Should have proper semantic structure
    expect(component.html()).toContain('<section')
  })
})