import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import SubscriptionSection from '~/components/analysis/SubscriptionSection.vue'
import type { GameData, ProcessedPackage } from '~/types/games'

const mockGameData: GameData = {
  metadata: {
    id: 'test',
    name: 'Test Game',
    shortName: 'TG',
    currency: { name: 'Test Coins', shortName: 'TC' },
    pull: { name: 'Pull', cost: 160 },
    analysisConfig: { maxScenarios: 50, includeMultiPackage: true, maxPackageMultiplier: 3 }
  },
  packages: {}
}

const mockSubscriptionPackages: ProcessedPackage[] = [
  {
    id: 'sub1',
    name: 'Monthly Pass',
    baseAmount: 300,
    price: 4.99,
    extraAmount: 2700,
    purchaseType: 'subscription',
    currency: 'coins',
    totalAmount: 3000,
    amountPerDollar: 601.2,
    pullsFromPackage: 18,
    costPerPull: 0.28,
    leftoverAmount: 120,
    efficiency: 601.2,
    description: '300 coins + 90 daily for 30 days'
  },
  {
    id: 'sub2',
    name: 'Battle Pass',
    baseAmount: 680,
    price: 9.99,
    extraAmount: 0,
    purchaseType: 'subscription',
    currency: 'coins',
    totalAmount: 680,
    amountPerDollar: 68.07,
    pullsFromPackage: 4,
    costPerPull: 2.50,
    leftoverAmount: 40,
    efficiency: 68.07,
    description: 'Battle Pass rewards'
  }
]

describe('SubscriptionSection', () => {
  it('renders subscription packages correctly', async () => {
    const component = await mountSuspended(SubscriptionSection, {
      props: {
        gameData: mockGameData,
        subscriptionPackages: mockSubscriptionPackages
      }
    })

    expect(component.text()).toContain('Subscription Packages')
    expect(component.text()).toContain('Monthly Pass')
    expect(component.text()).toContain('Battle Pass')
    expect(component.text()).toContain('$4.99')
    expect(component.text()).toContain('$9.99')
  })

  it('shows subscription value analysis', async () => {
    const component = await mountSuspended(SubscriptionSection, {
      props: {
        gameData: mockGameData,
        subscriptionPackages: mockSubscriptionPackages
      }
    })

    expect(component.text()).toContain('Subscription Value Analysis')
    expect(component.text()).toContain('Best Value')
    expect(component.text()).toContain('Monthly Total')
  })

  it('handles empty subscription packages', async () => {
    const component = await mountSuspended(SubscriptionSection, {
      props: {
        gameData: mockGameData,
        subscriptionPackages: []
      }
    })

    expect(component.html()).toBe('<!--v-if-->')
  })

  it('displays package descriptions correctly', async () => {
    const component = await mountSuspended(SubscriptionSection, {
      props: {
        gameData: mockGameData,
        subscriptionPackages: mockSubscriptionPackages
      }
    })

    expect(component.text()).toContain('300 coins + 90 daily for 30 days')
    expect(component.text()).toContain('Battle Pass rewards')
  })

  it('shows best value package correctly', async () => {
    const component = await mountSuspended(SubscriptionSection, {
      props: {
        gameData: mockGameData,
        subscriptionPackages: mockSubscriptionPackages
      }
    })

    // Monthly Pass should be best value with $0.28 per pull
    expect(component.text()).toContain('Monthly Pass')
    expect(component.text()).toContain('$0.28')
  })

  it('calculates monthly totals correctly', async () => {
    const component = await mountSuspended(SubscriptionSection, {
      props: {
        gameData: mockGameData,
        subscriptionPackages: mockSubscriptionPackages
      }
    })

    // Total monthly cost: $4.99 + $9.99 = $14.98
    expect(component.text()).toContain('$14.98')
    // Total monthly pulls: 18 + 4 = 22
    expect(component.text()).toContain('22')
  })
})
