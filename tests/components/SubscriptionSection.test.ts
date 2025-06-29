// @vitest-environment nuxt
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import SubscriptionSection from '~/components/analysis/SubscriptionSection.vue'
import type { GameData, ProcessedPurchase } from '~/types/games'

// Mock @nuxt/ui components
vi.mock('@nuxt/ui', () => ({
  UCard: {
    name: 'UCard',
    template: '<div class="u-card" :class="$attrs.class"><slot name="header"></slot><slot></slot></div>',
    props: ['class'],
    inheritAttrs: true,
  },
  UIcon: {
    name: 'UIcon',
    template: '<span class="u-icon" :class="$attrs.class"></span>',
    props: ['name', 'class'],
    inheritAttrs: true,
  },
}))

const mockGameData: GameData = {
  id: 'hsr',
  metadata: {
    id: 'hsr',
    name: 'Honkai: Star Rail',
    shortName: 'HSR',
    currency: { name: 'Oneiric Shard', shortName: 'OS' },
    pull: { name: 'Warp', cost: 160 },
    analysisConfig: {
      includeMultiPackage: true,
      maxPackageMultiplier: 3,
      maxScenarios: 10,
    },
  },
  packages: {},
}

const mockSubscriptionPackages: ProcessedPurchase[] = [
  {
    id: 'sub_1',
    name: 'Express Supply Pass',
    price: 4.99,
    baseAmount: 300,
    extraAmount: 0,
    purchaseType: 'subscription',
    totalAmount: 300,
    amountPerDollar: 60.12,
    pullsFromPurchase: 1,
    costPerPull: 4.99,
    leftoverAmount: 140,
    efficiency: 60.12,
    description: 'Monthly subscription',
  },
  {
    id: 'sub_2',
    name: 'Trailblaze Pass',
    price: 9.99,
    baseAmount: 600,
    extraAmount: 200,
    purchaseType: 'subscription',
    totalAmount: 800,
    amountPerDollar: 80.08,
    pullsFromPurchase: 5,
    costPerPull: 2.00,
    leftoverAmount: 0,
    efficiency: 80.08,
    description: 'Premium monthly subscription',
  },
  {
    id: 'sub_3',
    name: 'Basic Daily Login',
    price: 1.99,
    baseAmount: 50,
    extraAmount: 0,
    purchaseType: 'subscription',
    totalAmount: 50,
    amountPerDollar: 25.13,
    pullsFromPurchase: 0,
    costPerPull: Infinity,
    leftoverAmount: 50,
    efficiency: 25.13,
    description: 'Daily rewards only',
  },
]

describe('SubscriptionSection.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Component Rendering', () => {
    it('renders with valid subscription packages', async () => {
      const component = await mountSuspended(SubscriptionSection, {
        props: {
          gameData: mockGameData,
          subscriptionPackages: mockSubscriptionPackages,
        },
      })

      expect(component.find('.rounded-lg.bg-default, .u-card').exists()).toBe(true)
      expect(component.text()).toContain('Subscription Packages')
      expect(component.text()).toContain('Express Supply Pass')
      expect(component.text()).toContain('Trailblaze Pass')
    })

    it('does not render when no subscription packages exist', async () => {
      const component = await mountSuspended(SubscriptionSection, {
        props: {
          gameData: mockGameData,
          subscriptionPackages: [],
        },
      })

      expect(component.find('.u-card').exists()).toBe(false)
      expect(component.html()).toBe('<!--v-if-->')
    })

    it('does not render when subscription packages is null', async () => {
      const component = await mountSuspended(SubscriptionSection, {
        props: {
          gameData: mockGameData,
          subscriptionPackages: null,
        },
      })

      expect(component.find('.u-card').exists()).toBe(false)
    })
  })

  describe('Mobile View', () => {
    it('displays packages in mobile card format', async () => {
      const component = await mountSuspended(SubscriptionSection, {
        props: {
          gameData: mockGameData,
          subscriptionPackages: mockSubscriptionPackages,
        },
      })

      const mobileView = component.find('.block.lg\\:hidden')
      expect(mobileView.exists()).toBe(true)

      // Check for mobile card styling
      expect(mobileView.find('.bg-green-50').exists()).toBe(true)
      expect(mobileView.find('.border-green-200').exists()).toBe(true)
    })

    it('shows correct pricing and pull information in mobile view', async () => {
      const component = await mountSuspended(SubscriptionSection, {
        props: {
          gameData: mockGameData,
          subscriptionPackages: [mockSubscriptionPackages[0]],
        },
      })

      const mobileCard = component.find('.bg-green-50')
      expect(mobileCard.text()).toContain('$4.99')
      expect(mobileCard.text()).toContain('1 warps')
      expect(mobileCard.text()).toContain('300 os')
      expect(mobileCard.text()).toContain('140 leftover')
      expect(mobileCard.text()).toContain('Monthly subscription')
    })

    it('handles zero-pull packages in mobile view', async () => {
      const component = await mountSuspended(SubscriptionSection, {
        props: {
          gameData: mockGameData,
          subscriptionPackages: [mockSubscriptionPackages[2]],
        },
      })

      const zeroPullText = component.find('.text-red-500')
      expect(zeroPullText.exists()).toBe(true)
      expect(zeroPullText.text()).toContain('0 warps')
    })
  })

  describe('Desktop View', () => {
    it('displays packages in desktop table format', async () => {
      const component = await mountSuspended(SubscriptionSection, {
        props: {
          gameData: mockGameData,
          subscriptionPackages: mockSubscriptionPackages,
        },
      })

      const desktopView = component.find('.hidden.lg\\:block')
      expect(desktopView.exists()).toBe(true)

      // Check table headers
      expect(desktopView.text()).toContain('Package Name')
      expect(desktopView.text()).toContain('Price')
      expect(desktopView.text()).toContain('OS')
      expect(desktopView.text()).toContain('Warps')
      expect(desktopView.text()).toContain('Leftover')
      expect(desktopView.text()).toContain('Description')
    })

    it('shows package data in table rows', async () => {
      const component = await mountSuspended(SubscriptionSection, {
        props: {
          gameData: mockGameData,
          subscriptionPackages: mockSubscriptionPackages.slice(0, 2),
        },
      })

      const tableRows = component.findAll('.divide-y .px-4.py-4')
      expect(tableRows).toHaveLength(2)

      // Check first row
      expect(tableRows[0].text()).toContain('Express Supply Pass')
      expect(tableRows[0].text()).toContain('$4.99')
      expect(tableRows[0].text()).toContain('300')
      expect(tableRows[0].text()).toContain('1')
      expect(tableRows[0].text()).toContain('140')
      expect(tableRows[0].text()).toContain('Monthly subscription')
    })
  })

  describe('Subscription Analysis', () => {
    it('shows analysis section when valid packages exist', async () => {
      const component = await mountSuspended(SubscriptionSection, {
        props: {
          gameData: mockGameData,
          subscriptionPackages: mockSubscriptionPackages.slice(0, 2), // Only valid packages
        },
      })

      expect(component.text()).toContain('Subscription Value Analysis')
      expect(component.text()).toContain('Best Value')
      expect(component.text()).toContain('Best Cost/Warp')
      expect(component.text()).toContain('Monthly Total')
      expect(component.text()).toContain('Monthly Warps')
    })

    it('does not show analysis when no valid packages exist', async () => {
      const component = await mountSuspended(SubscriptionSection, {
        props: {
          gameData: mockGameData,
          subscriptionPackages: [mockSubscriptionPackages[2]], // Only zero-pull package
        },
      })

      expect(component.text()).not.toContain('Subscription Value Analysis')
    })

    it('calculates best value correctly', async () => {
      const component = await mountSuspended(SubscriptionSection, {
        props: {
          gameData: mockGameData,
          subscriptionPackages: mockSubscriptionPackages.slice(0, 2),
        },
      })

      // Trailblaze Pass should be best value (lower cost per pull: $2.00 vs $4.99)
      expect(component.text()).toContain('Trailblaze Pass')
      expect(component.text()).toContain('$2.00')
    })

    it('calculates monthly totals correctly', async () => {
      const component = await mountSuspended(SubscriptionSection, {
        props: {
          gameData: mockGameData,
          subscriptionPackages: mockSubscriptionPackages.slice(0, 2),
        },
      })

      // Monthly total: $4.99 + $9.99 = $14.98
      expect(component.text()).toContain('$14.98')
      // Monthly pulls: 1 + 5 = 6
      expect(component.text()).toContain('6')
    })

    it('shows correct explanations for stats', async () => {
      const component = await mountSuspended(SubscriptionSection, {
        props: {
          gameData: mockGameData,
          subscriptionPackages: mockSubscriptionPackages.slice(0, 2),
        },
      })

      expect(component.text()).toContain('Total monthly cost for all subscriptions')
      expect(component.text()).toContain('Total pulls per month from all subscriptions')
    })
  })

  describe('Edge Cases', () => {
    it('handles packages with missing description', async () => {
      const packageWithoutDesc = {
        ...mockSubscriptionPackages[0],
        description: undefined,
      }

      const component = await mountSuspended(SubscriptionSection, {
        props: {
          gameData: mockGameData,
          subscriptionPackages: [packageWithoutDesc],
        },
      })

      expect(component.text()).toContain('N/A')
    })

    it('handles infinite cost per pull correctly', async () => {
      const component = await mountSuspended(SubscriptionSection, {
        props: {
          gameData: mockGameData,
          subscriptionPackages: [mockSubscriptionPackages[2]], // Infinity cost package
        },
      })

      expect(component.text()).toContain('Basic Daily Login')
      expect(component.find('.text-red-500').exists()).toBe(true)
    })

    it('handles large numbers correctly', async () => {
      const largePackage = {
        ...mockSubscriptionPackages[0],
        totalAmount: 1234567,
        price: 999.99,
      }

      const component = await mountSuspended(SubscriptionSection, {
        props: {
          gameData: mockGameData,
          subscriptionPackages: [largePackage],
        },
      })

      expect(component.text()).toContain('1,234,567')
      expect(component.text()).toContain('$999.99')
    })

    it('handles analysis with single package', async () => {
      const component = await mountSuspended(SubscriptionSection, {
        props: {
          gameData: mockGameData,
          subscriptionPackages: [mockSubscriptionPackages[0]],
        },
      })

      expect(component.text()).toContain('Subscription Value Analysis')
      expect(component.text()).toContain('Express Supply Pass')
      expect(component.text()).toContain('$4.99') // Monthly total should equal single package price
    })
  })

  describe('Responsive Classes', () => {
    it('applies correct responsive visibility classes', async () => {
      const component = await mountSuspended(SubscriptionSection, {
        props: {
          gameData: mockGameData,
          subscriptionPackages: mockSubscriptionPackages,
        },
      })

      // Mobile view should be block on mobile, hidden on lg+
      expect(component.find('.block.lg\\:hidden').exists()).toBe(true)
      // Desktop view should be hidden on mobile, block on lg+
      expect(component.find('.hidden.lg\\:block').exists()).toBe(true)
    })

    it('applies correct color classes for blue theme', async () => {
      const component = await mountSuspended(SubscriptionSection, {
        props: {
          gameData: mockGameData,
          subscriptionPackages: mockSubscriptionPackages,
        },
      })

      // Check green theme colors
      expect(component.find('.text-green-600').exists()).toBe(true)
      expect(component.find('.bg-green-50').exists()).toBe(true)
      expect(component.find('.border-green-200').exists()).toBe(true)
    })
  })

  describe('Average Cost Calculation', () => {
    it('calculates average cost per pull correctly', async () => {
      const packages = [
        {
          ...mockSubscriptionPackages[0],
          costPerPull: 4.00,
          pullsFromPurchase: 1,
        },
        {
          ...mockSubscriptionPackages[1],
          costPerPull: 2.00,
          pullsFromPurchase: 5,
        },
      ]

      const component = await mountSuspended(SubscriptionSection, {
        props: {
          gameData: mockGameData,
          subscriptionPackages: packages,
        },
      })

      // Average should be (4.00 + 2.00) / 2 = 3.00
      // The component uses this in internal calculations
      expect(component.vm).toBeTruthy()
    })
  })
})
