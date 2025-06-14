import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'

describe('HSR Analysis Page Responsive', () => {
  it('should render analysis page without errors', async () => {
    const component = await mountSuspended(() => import('~/pages/games/[gameId]/analysis.vue'), {
      route: { params: { gameId: 'hsr' } }
    })
    
    expect(component.html()).toContain('Back to Home')
    expect(component.html()).toContain('Honkai: Star Rail')
    expect(component.html()).toContain('Available Packages')
    expect(component.html()).toContain('Summary')
  })

  it('should have mobile and desktop package layouts', async () => {
    const component = await mountSuspended(() => import('~/pages/games/[gameId]/analysis.vue'), {
      route: { params: { gameId: 'hsr' } }
    })
    
    // Check for mobile layout (hidden on lg+)
    expect(component.html()).toContain('block lg:hidden')
    
    // Check for desktop table layout (hidden until lg)
    expect(component.html()).toContain('hidden lg:block')
    
    // Check for table headers using dynamic currency name
    expect(component.html()).toContain('Price')
    expect(component.html()).toContain('Shards')
    expect(component.html()).toContain('Leftover')
  })

  it('should display all package types including subscriptions', async () => {
    const component = await mountSuspended(() => import('~/pages/games/[gameId]/analysis.vue'), {
      route: { params: { gameId: 'hsr' } }
    })
    
    // Check for package sections
    expect(component.html()).toContain('Normal Packages')
    expect(component.html()).toContain('First-Time Bonus Packages')
    expect(component.html()).toContain('Subscription & Battle Pass')
    
    // Check for package colors
    expect(component.html()).toContain('bg-red-50')
    expect(component.html()).toContain('bg-green-50')
    expect(component.html()).toContain('bg-blue-50')
  })

  it('should show subscription packages in comparison', async () => {
    const component = await mountSuspended(() => import('~/pages/games/[gameId]/analysis.vue'), {
      route: { params: { gameId: 'hsr' } }
    })
    
    // Check for subscription-specific content
    expect(component.html()).toContain('Express Supply Pass')
    expect(component.html()).toContain('Nameless Glory')
    expect(component.html()).toContain('Battle Pass')
  })

  it('should include subscriptions in charts', async () => {
    const component = await mountSuspended(() => import('~/pages/games/[gameId]/analysis.vue'), {
      route: { params: { gameId: 'hsr' } }
    })
    
    // Check for chart descriptions mentioning subscriptions
    expect(component.html()).toContain('blue dots represent subscriptions')
    expect(component.html()).toContain('Cost vs')
    expect(component.html()).toContain('Package Efficiency')
  })

  it('should show comprehensive summary with package type comparison', async () => {
    const component = await mountSuspended(() => import('~/pages/games/[gameId]/analysis.vue'), {
      route: { params: { gameId: 'hsr' } }
    })
    
    // Check for summary sections
    expect(component.html()).toContain('Overall Analysis')
    expect(component.html()).toContain('Package Type Comparison')
    expect(component.html()).toContain('Savings Analysis')
    
    // Check for package type stats
    expect(component.html()).toContain('Normal Packages')
    expect(component.html()).toContain('First-Time Bonus')
    expect(component.html()).toContain('Subscriptions')
  })

  it('should have responsive back button', async () => {
    const component = await mountSuspended(() => import('~/pages/games/[gameId]/analysis.vue'), {
      route: { params: { gameId: 'hsr' } }
    })
    
    expect(component.html()).toContain('hidden sm:inline')
    expect(component.html()).toContain('sm:hidden')
  })

  it('should handle packages with zero warps correctly', async () => {
    const component = await mountSuspended(() => import('~/pages/games/[gameId]/analysis.vue'), {
      route: { params: { gameId: 'hsr' } }
    })
    
    // Should have styling for zero warps
    expect(component.html()).toContain('text-red-500')
  })

  it('should display subscription package descriptions', async () => {
    const component = await mountSuspended(() => import('~/pages/games/[gameId]/analysis.vue'), {
      route: { params: { gameId: 'hsr' } }
    })
    
    // Check for subscription descriptions
    expect(component.html()).toContain('daily for 30 days')
    expect(component.html()).toContain('additional rewards')
  })

  it('should show subscription stats in package type comparison', async () => {
    const component = await mountSuspended(() => import('~/pages/games/[gameId]/analysis.vue'), {
      route: { params: { gameId: 'hsr' } }
    })
    
    // Check for subscription stats card
    expect(component.html()).toContain('text-blue-600')
    expect(component.html()).toContain('Best Cost')
  })
})
