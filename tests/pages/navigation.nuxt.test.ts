import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import App from '~/app.vue'

describe('App Navigation', () => {
  it('should render navigation correctly', async () => {
    const component = await mountSuspended(App, { route: '/' })
    expect(component.text()).toContain('HSR Analysis')
    expect(component.text()).toContain('Home')
    expect(component.text()).toContain('Analysis')
  })

  it('should have proper navigation structure', async () => {
    const component = await mountSuspended(App, { route: '/' })
    
    // Should have navigation links
    const homeLink = component.findAll('a[href="/"]')
    const analysisLink = component.findAll('a[href="/hsr-analysis"]')
    
    expect(homeLink.length).toBeGreaterThan(0)
    expect(analysisLink.length).toBeGreaterThan(0)
  })

  it('should display footer information', async () => {
    const component = await mountSuspended(App, { route: '/' })
    expect(component.text()).toContain('2025 HSR Oneiric Shards Analysis')
    expect(component.text()).toContain('Nuxt.js & TailwindCSS')
  })

  it('should have color mode toggle', async () => {
    const component = await mountSuspended(App, { route: '/' })
    // The UColorModeButton should be present
    expect(component.html()).toContain('color-mode')
  })
})