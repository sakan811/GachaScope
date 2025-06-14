// tests/pages/hsr-analysis.nuxt.test.ts
import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import HsrAnalysis from '~/pages/hsr-analysis.vue'

// Mock Chart.js to avoid canvas issues in tests
vi.mock('chart.js', () => ({
  Chart: {
    register: vi.fn(),
  },
  LineElement: {},
  PointElement: {},
  LineController: {},
  BarElement: {},
  BarController: {},
  CategoryScale: {},
  LinearScale: {},
  Title: {},
  Tooltip: {},
  Legend: {},
  Filler: {}
}))

describe('HSR Analysis Page', () => {
  it('should render the page without errors', async () => {
    const component = await mountSuspended(HsrAnalysis)
    expect(component.text()).toContain('HSR Oneiric Shards Analysis')
  })

  it('should display available packages section', async () => {
    const component = await mountSuspended(HsrAnalysis)
    expect(component.text()).toContain('Available Packages')
    expect(component.text()).toContain('Normal Packages')
    expect(component.text()).toContain('First-Time Bonus Packages')
  })

  it('should show package information correctly', async () => {
    const component = await mountSuspended(HsrAnalysis)
    
    // Should show prices and pull counts
    expect(component.text()).toContain('$0.99')
    expect(component.text()).toContain('pulls')
    expect(component.text()).toContain('leftover')
  })

  it('should display spending scenarios table', async () => {
    const component = await mountSuspended(HsrAnalysis)
    expect(component.text()).toContain('Common Spending Scenarios')
    expect(component.text()).toContain('Scenario')
    expect(component.text()).toContain('Cost')
    expect(component.text()).toContain('Pulls')
    expect(component.text()).toContain('$/Pull')
    expect(component.text()).toContain('Leftover')
  })

  it('should have tabs for normal and first-time scenarios', async () => {
    const component = await mountSuspended(HsrAnalysis)
    expect(component.text()).toContain('Normal Packages')
    expect(component.text()).toContain('First-Time Bonus')
  })

  it('should display charts sections', async () => {
    const component = await mountSuspended(HsrAnalysis)
    expect(component.text()).toContain('Cost vs Pulls Obtained')
    expect(component.text()).toContain('Package Efficiency')
    expect(component.text()).toContain('First-Time Bonus Savings')
  })

  it('should show key insights section', async () => {
    const component = await mountSuspended(HsrAnalysis)
    expect(component.text()).toContain('Key Insights')
    expect(component.text()).toContain('Spending Tips')
    expect(component.text()).toContain('Important Notes')
  })

  it('should display savings statistics', async () => {
    const component = await mountSuspended(HsrAnalysis)
    expect(component.text()).toContain('Max Savings')
    expect(component.text()).toContain('Best Scenario')
    expect(component.text()).toContain('Avg Savings')
  })

  it('should contain helpful tips and warnings', async () => {
    const component = await mountSuspended(HsrAnalysis)
    expect(component.text()).toContain('first-time bonus packages first')
    expect(component.text()).toContain('Larger packages generally offer better value')
    expect(component.text()).toContain('only buy first-time bonus packages once')
    expect(component.text()).toContain('budget responsibly')
  })
})
