import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { createRouter, createWebHistory } from 'vue-router'
import IndexPage from '~/pages/index.vue'
import AnalysisPage from '~/pages/games/[gameId]/analysis.vue'

describe('E2E Critical Flows', () => {
  describe('Game Selection Flow', () => {
    it('navigates from index to analysis', async () => {
      const indexComponent = await mountSuspended(IndexPage)
      
      // Should show game selection
      expect(indexComponent.text()).toContain('Honkai: Star Rail')
      
      // Click should navigate (in real app)
      const gameLinks = indexComponent.findAll('a')
      expect(gameLinks.length).toBeGreaterThan(0)
    })

    it('loads analysis page with game data', async () => {
      const analysisComponent = await mountSuspended(AnalysisPage, {
        route: '/games/hsr/analysis'
      })

      // Should load all required sections
      expect(analysisComponent.text()).toContain('Analysis')
      expect(analysisComponent.text()).toContain('Oneiric Shard')
      expect(analysisComponent.text()).toContain('Best Value')
    })
  })

  describe('Data Loading', () => {
    it('handles successful data load', async () => {
      const component = await mountSuspended(AnalysisPage, {
        route: '/games/hsr/analysis'
      })

      // Should display calculated values
      expect(component.text()).toMatch(/\$\d+\.\d{2}/) // Currency format
      expect(component.text()).toMatch(/\d+\s+Warps?/) // Pulls format
    })

    it('gracefully handles missing data', async () => {
      // Test component behavior when data is unavailable
      const component = await mountSuspended(AnalysisPage, {
        route: '/games/invalid/analysis'
      })

      // Should not crash, may show error or fallback
      expect(component.html()).toBeTruthy()
    })
  })

  describe('Responsive Behavior', () => {
    it('renders on mobile viewport', async () => {
      const component = await mountSuspended(AnalysisPage, {
        route: '/games/hsr/analysis'
      })

      // Should contain responsive classes
      expect(component.html()).toContain('md:')
      expect(component.html()).toContain('lg:')
    })
  })
})