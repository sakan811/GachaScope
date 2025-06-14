import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Index from '~/pages/index.vue'

describe('Index Page', () => {
  it('should render the home page without errors', async () => {
    const component = await mountSuspended(Index)
    expect(component.text()).toContain('Honkai Star Rail')
    expect(component.text()).toContain('Oneiric Shards')
  })

  it('should display hero section with CTA buttons', async () => {
    const component = await mountSuspended(Index)
    expect(component.text()).toContain('Start Analysis')
    expect(component.text()).toContain('Learn More')
  })

  it('should show features section', async () => {
    const component = await mountSuspended(Index)
    expect(component.text()).toContain('Package-Based Analysis')
    expect(component.text()).toContain('Realistic Scenarios')
    expect(component.text()).toContain('First-Time Bonus Tracking')
  })

  it('should display package insights statistics', async () => {
    const component = await mountSuspended(Index)
    expect(component.text()).toContain('Package Insights')
    expect(component.text()).toContain('Maximum Savings Available')
    expect(component.text()).toContain('Max Pulls from Single Bonus Package')
    expect(component.text()).toContain('Best Cost per Pull')
  })

  it('should show package comparison examples', async () => {
    const component = await mountSuspended(Index)
    expect(component.text()).toContain('Package Comparison')
    expect(component.text()).toContain('Normal Package Example')
    expect(component.text()).toContain('First-Time Bonus Example')
  })

  it('should have working navigation links', async () => {
    const component = await mountSuspended(Index)
    
    // Should have links to analysis page
    const analysisLinks = component.findAll('a[href="/hsr-analysis"]')
    expect(analysisLinks.length).toBeGreaterThan(0)
  })

  it('should display savings calculation in examples', async () => {
    const component = await mountSuspended(Index)
    expect(component.text()).toContain('Save $')
    expect(component.text()).toContain('compared to normal')
  })
})