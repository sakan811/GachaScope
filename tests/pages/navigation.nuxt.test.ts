import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import App from '~/app.vue'

describe('App Navigation Responsive', () => {
  it('should render responsive navigation correctly', async () => {
    const component = await mountSuspended(App, { route: '/' })
    expect(component.text()).toContain('GachaScope')
    expect(component.text()).toContain('Home')
    expect(component.text()).toContain('HSR Analysis')
  })

  it('should have proper responsive navigation structure', async () => {
    const component = await mountSuspended(App, { route: '/' })
    
    // Should have brand/logo
    const brandLinks = component.findAll('a[href="/"]')
    expect(brandLinks.length).toBeGreaterThan(0)
    
    // Should have analysis link
    const analysisLinks = component.findAll('a[href="/games/hsr/analysis"]')
    expect(analysisLinks.length).toBeGreaterThan(0)
  })

  it('should have desktop navigation elements', async () => {
    const component = await mountSuspended(App, { route: '/' })
    
    // Should have hidden desktop nav (hidden md:flex)
    expect(component.html()).toContain('hidden md:flex')
    
    // Should have navigation links in desktop nav
    expect(component.text()).toContain('Home')
    expect(component.text()).toContain('HSR Analysis')
  })

  it('should have mobile menu button', async () => {
    const component = await mountSuspended(App, { route: '/' })
    
    // Should have mobile menu button (md:hidden)
    expect(component.html()).toContain('md:hidden')
    
    // Should have hamburger/close icons
    expect(component.html()).toContain('i-heroicons-bars-3')
    expect(component.html()).toContain('i-heroicons-x-mark')
  })

  it('should have color mode toggle for both desktop and mobile', async () => {
    const component = await mountSuspended(App, { route: '/' })
    
    // Should have UColorModeButton components
    const colorModeButtons = component.html().match(/UColorModeButton/g)
    expect(colorModeButtons?.length).toBeGreaterThanOrEqual(1)
  })

  it('should display responsive footer information', async () => {
    const component = await mountSuspended(App, { route: '/' })
    expect(component.text()).toContain('2025 GachaScope')
    expect(component.text()).toContain('Nuxt.js & TailwindCSS')
  })

  it('should have proper responsive spacing classes', async () => {
    const component = await mountSuspended(App, { route: '/' })
    
    // Should have responsive padding/margin classes
    expect(component.html()).toContain('py-3 sm:py-4')
    expect(component.html()).toContain('mb-6 sm:mb-8')
    expect(component.html()).toContain('gap-2 sm:gap-4')
  })

  it('should have responsive text sizing', async () => {
    const component = await mountSuspended(App, { route: '/' })
    
    // Brand should have responsive text sizing
    expect(component.html()).toContain('text-xl sm:text-2xl')
    
    // Navigation links should have appropriate text sizing
    expect(component.html()).toContain('text-sm')
    expect(component.html()).toContain('text-base')
  })

  it('should have mobile menu overlay structure', async () => {
    const component = await mountSuspended(App, { route: '/' })
    
    // Should have mobile menu overlay elements
    expect(component.html()).toContain('fixed inset-0 z-50 md:hidden')
    expect(component.html()).toContain('bg-black/50 backdrop-blur-sm')
    expect(component.html()).toContain('absolute top-0 right-0')
  })

  it('should have proper aria labels for accessibility', async () => {
    const component = await mountSuspended(App, { route: '/' })
    
    // Mobile menu button should have aria-label
    expect(component.html()).toContain('aria-label')
    expect(component.html()).toContain('Open menu')
    expect(component.html()).toContain('Close menu')
  })

  it('should have touch-friendly button sizes', async () => {
    const component = await mountSuspended(App, { route: '/' })
    
    // Buttons should have adequate padding for touch
    expect(component.html()).toContain('p-2')
    expect(component.html()).toContain('py-3 px-4')
  })
})