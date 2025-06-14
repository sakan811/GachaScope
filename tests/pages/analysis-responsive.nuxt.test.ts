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

  it('should have responsive classes', async () => {
    const component = await mountSuspended(() => import('~/pages/games/[gameId]/analysis.vue'), {
      route: { params: { gameId: 'hsr' } }
    })
    
    // Check for responsive grid classes
    expect(component.html()).toContain('grid-cols-1')
    expect(component.html()).toContain('sm:grid-cols-2')
    expect(component.html()).toContain('lg:grid-cols-2')
    expect(component.html()).toContain('lg:grid-cols-4')
    
    // Check for responsive text sizes
    expect(component.html()).toContain('text-sm sm:text-base')
    expect(component.html()).toContain('text-xs sm:text-sm')
  })

  it('should have responsive back button', async () => {
    const component = await mountSuspended(() => import('~/pages/games/[gameId]/analysis.vue'), {
      route: { params: { gameId: 'hsr' } }
    })
    
    expect(component.html()).toContain('hidden sm:inline')
    expect(component.html()).toContain('sm:hidden')
  })
})
