import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AnalysisPage from '~/pages/games/[gameId]/analysis.vue'

describe('Pages Integration', () => {
  describe('Analysis Page', () => {
    it('renders all sections for HSR', async () => {
      const component = await mountSuspended(AnalysisPage, {
        route: '/games/hsr/analysis'
      })

      // Check main sections exist
      expect(component.text()).toContain('Subscription Packages')
      expect(component.text()).toContain('Available Packages')
      expect(component.text()).toContain('Cost vs Warps Obtained')
      expect(component.text()).toContain('Package Efficiency')
      expect(component.text()).toContain('Package Value Analysis')
    })

    it('shows subscription details', async () => {
      const component = await mountSuspended(AnalysisPage, {
        route: '/games/hsr/analysis'
      })

      expect(component.text()).toContain('Express Supply Pass')
      expect(component.text()).toContain('Nameless Glory')
      expect(component.text()).toContain('$4.99')
      expect(component.text()).toContain('$9.99')
    })

    it('displays battle pass content', async () => {
      const component = await mountSuspended(AnalysisPage, {
        route: '/games/hsr/analysis'
      })

      expect(component.text()).toContain('Battle Pass')
      expect(component.text()).toContain('Nameless Medal')
      expect(component.html()).toContain('bg-purple-50')
    })

    it('shows enhanced charts', async () => {
      const component = await mountSuspended(AnalysisPage, {
        route: '/games/hsr/analysis'
      })

      expect(component.text()).toContain('all package types including subscriptions')
      expect(component.text()).toContain('Different colors represent different package types')
      expect(component.text()).toContain('grouped by package type')
    })

    it('maintains section order', async () => {
      const component = await mountSuspended(AnalysisPage, {
        route: '/games/hsr/analysis'
      })

      const html = component.html()
      const subscriptionIdx = html.indexOf('Subscription Packages')
      const packageIdx = html.indexOf('Available Packages')
      const chartIdx = html.indexOf('Cost vs Warps Obtained')
      
      expect(subscriptionIdx).toBeLessThan(packageIdx)
      expect(packageIdx).toBeLessThan(chartIdx)
    })
  })

  describe('Index Page', () => {
    it('renders game selection', async () => {
      const IndexPage = await import('~/pages/index.vue')
      const component = await mountSuspended(IndexPage.default)

      expect(component.text()).toContain('Honkai: Star Rail')
    })
  })

  describe('Navigation', () => {
    it('handles route changes', async () => {
      const component = await mountSuspended(AnalysisPage, {
        route: '/games/hsr/analysis'
      })

      expect(component.html()).toContain('hsr')
    })
  })
})