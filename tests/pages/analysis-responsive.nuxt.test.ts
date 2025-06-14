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

  it('should display normal and bonus packages', async () => {
    const component = await mountSuspended(() => import('~/pages/games/[gameId]/analysis.vue'), {
      route: { params: { gameId: 'hsr' } }
    })
    
    // Check for package sections
    expect(component.html()).toContain('Normal Packages')
    expect(component.html()).toContain('First-Time Bonus Packages')
    
    // Check for package colors
    expect(component.html()).toContain('bg-red-50')
    expect(component.html()).toContain('bg-green-50')
  })

  it('should show charts section', async () => {
    const component = await mountSuspended(() => import('~/pages/games/[gameId]/analysis.vue'), {
      route: { params: { gameId: 'hsr' } }
    })
    
    // Check for chart titles
    expect(component.html()).toContain('Cost vs')
    expect(component.html()).toContain('Package Efficiency')
  })
})
