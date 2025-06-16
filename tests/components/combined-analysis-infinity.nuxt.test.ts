import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CombinedValueAnalysis from '~/components/analysis/CombinedValueAnalysis.vue'
import { getGameById } from '~/utils/gameRegistry'
import type { ProcessedPackage } from '~/types/games'

describe('CombinedValueAnalysis - Infinity Handling', () => {
  it('handles infinity values in package type comparison', async () => {
    const gameData = getGameById('hsr')!
    
    // Create mock processed packages with infinity cost per pull
    const processedPackages = {
      normal: [
        {
          id: 'test-normal',
          name: 'Test Normal Package',
          baseAmount: 60,
          price: 0.99,
          extraAmount: 0,
          purchaseType: 'normal' as const,
          currency: 'shards',
          totalAmount: 60,
          amountPerDollar: 60.61,
          pullsFromPackage: 0, // This causes infinity
          costPerPull: Infinity,
          leftoverAmount: 60,
          efficiency: 60.61
        } as ProcessedPackage,
        {
          id: 'test-normal-2',
          name: 'Test Normal Package 2',
          baseAmount: 300,
          price: 4.99,
          extraAmount: 30,
          purchaseType: 'normal' as const,
          currency: 'shards',
          totalAmount: 330,
          amountPerDollar: 66.13,
          pullsFromPackage: 2,
          costPerPull: 2.50,
          leftoverAmount: 10,
          efficiency: 66.13
        } as ProcessedPackage
      ],
      subscription: [
        {
          id: 'test-sub',
          name: 'Test Subscription',
          baseAmount: 300,
          price: 4.99,
          extraAmount: 2700,
          purchaseType: 'subscription' as const,
          currency: 'shards',
          totalAmount: 3000,
          amountPerDollar: 601.2,
          pullsFromPackage: 18,
          costPerPull: 0.28,
          leftoverAmount: 120,
          efficiency: 601.2
        } as ProcessedPackage
      ]
    }

    const component = await mountSuspended(CombinedValueAnalysis, {
      props: {
        gameData,
        processedPackages
      }
    })

    // Should not contain $Infinity or Infinity
    expect(component.text()).not.toContain('$Infinity')
    expect(component.text()).not.toContain('Infinity')
    
    // Should contain the "no warp for the cost" message
    expect(component.text()).toContain('no warp for the cost')
    
    // Should contain proper explanation for packages with no warps
    expect(component.text()).toContain('This package provides no warps for the cost')
    
    // Should still show valid packages with proper formatting
    expect(component.text()).toContain('$0.28')
    expect(component.text()).toContain('$2.50')
  })

  it('properly sorts package types with infinity values', async () => {
    const gameData = getGameById('hsr')!
    
    const processedPackages = {
      normal: [
        {
          id: 'test-normal-infinity',
          name: 'Test Normal Infinity',
          pullsFromPackage: 0,
          costPerPull: Infinity,
          price: 0.99
        } as ProcessedPackage
      ],
      subscription: [
        {
          id: 'test-sub-good',
          name: 'Test Subscription Good',
          pullsFromPackage: 18,
          costPerPull: 0.28,
          price: 4.99
        } as ProcessedPackage
      ],
      first_time_bonus: [
        {
          id: 'test-bonus-good',
          name: 'Test Bonus Good',
          pullsFromPackage: 2,
          costPerPull: 1.50,
          price: 2.99
        } as ProcessedPackage
      ]
    }

    const component = await mountSuspended(CombinedValueAnalysis, {
      props: {
        gameData,
        processedPackages
      }
    })

    const html = component.html()
    
    // Packages with infinity should be sorted to the end
    const subscriptionIndex = html.indexOf('Subscriptions')
    const bonusIndex = html.indexOf('First-Time Bonus')
    const normalIndex = html.indexOf('Normal Packages')
    
    // Subscription should come first (lowest cost), then bonus, then normal (infinity)
    expect(subscriptionIndex).toBeGreaterThan(-1)
    expect(bonusIndex).toBeGreaterThan(subscriptionIndex)
    expect(normalIndex).toBeGreaterThan(bonusIndex)
  })

  it('handles all infinity packages gracefully', async () => {
    const gameData = getGameById('hsr')!
    
    // All packages have infinity cost per pull
    const processedPackages = {
      normal: [
        {
          id: 'test-normal-infinity',
          name: 'Test Normal Infinity',
          pullsFromPackage: 0,
          costPerPull: Infinity,
          price: 0.99
        } as ProcessedPackage
      ],
      subscription: [
        {
          id: 'test-sub-infinity',
          name: 'Test Subscription Infinity',
          pullsFromPackage: 0,
          costPerPull: Infinity,
          price: 4.99
        } as ProcessedPackage
      ]
    }

    const component = await mountSuspended(CombinedValueAnalysis, {
      props: {
        gameData,
        processedPackages
      }
    })

    // Should handle the case where all packages have infinity
    expect(component.text()).toContain('no warp for the cost')
    expect(component.text()).not.toContain('$Infinity')
    
    // Should not crash and should display the analysis section
    expect(component.text()).toContain('In-App Purchase Value Analysis')
  })
})