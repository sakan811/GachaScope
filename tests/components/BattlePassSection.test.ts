// @vitest-environment nuxt
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BattlePassSection from '~/components/analysis/BattlePassSection.vue'
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

const mockBattlePassPackages: ProcessedPurchase[] = [
  {
    id: 'bp_1',
    name: 'Nameless Medal',
    price: 9.99,
    baseAmount: 500,
    extraAmount: 180,
    purchaseType: 'battle_pass',
    totalAmount: 680,
    amountPerDollar: 68.07,
    pullsFromPurchase: 4,
    costPerPull: 2.50,
    leftoverAmount: 40,
    efficiency: 68.07,
    description: 'Premium Battle Pass',
  },
  {
    id: 'bp_2',
    name: 'Nameless Glory',
    price: 19.99,
    baseAmount: 1000,
    extraAmount: 600,
    purchaseType: 'battle_pass',
    totalAmount: 1600,
    amountPerDollar: 80.04,
    pullsFromPurchase: 10,
    costPerPull: 2.00,
    leftoverAmount: 0,
    efficiency: 80.04,
    description: 'Deluxe Battle Pass',
  },
  {
    id: 'bp_3',
    name: 'Zero Pull Battle Pass',
    price: 4.99,
    baseAmount: 100,
    extraAmount: 0,
    purchaseType: 'battle_pass',
    totalAmount: 100,
    amountPerDollar: 20.04,
    pullsFromPurchase: 0,
    costPerPull: Infinity,
    leftoverAmount: 100,
    efficiency: 20.04,
  },
]

describe('BattlePassSection.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Component Rendering', () => {
    it('renders with valid battle pass packages', async () => {
      const component = await mountSuspended(BattlePassSection, {
        props: {
          gameData: mockGameData,
          battlePassPackages: mockBattlePassPackages,
        },
      })

      expect(component.find('.u-card').exists()).toBe(true)
      expect(component.text()).toContain('Battle Pass')
      expect(component.text()).toContain('Nameless Medal')
      expect(component.text()).toContain('Nameless Glory')
    })

    it('does not render when no battle pass packages exist', async () => {
      const component = await mountSuspended(BattlePassSection, {
        props: {
          gameData: mockGameData,
          battlePassPackages: [],
        },
      })

      expect(component.find('.u-card').exists()).toBe(false)
      expect(component.html()).toBe('<!--v-if-->')
    })

    it('does not render when battle pass packages is null', async () => {
      const component = await mountSuspended(BattlePassSection, {
        props: {
          gameData: mockGameData,
          battlePassPackages: null,
        },
      })

      expect(component.find('.u-card').exists()).toBe(false)
    })
  })

  describe('Mobile View', () => {
    it('displays packages in mobile card format', async () => {
      const component = await mountSuspended(BattlePassSection, {
        props: {
          gameData: mockGameData,
          battlePassPackages: mockBattlePassPackages,
        },
      })

      const mobileView = component.find('.block.lg\\:hidden')
      expect(mobileView.exists()).toBe(true)

      // Check for mobile card styling
      expect(mobileView.find('.bg-purple-50').exists()).toBe(true)
      expect(mobileView.find('.border-purple-200').exists()).toBe(true)
    })

    it('shows correct pricing and pull information in mobile view', async () => {
      const component = await mountSuspended(BattlePassSection, {
        props: {
          gameData: mockGameData,
          battlePassPackages: [mockBattlePassPackages[0]],
        },
      })

      const mobileCard = component.find('.bg-purple-50')
      expect(mobileCard.text()).toContain('$9.99')
      expect(mobileCard.text()).toContain('4 warps')
      expect(mobileCard.text()).toContain('680 os')
      expect(mobileCard.text()).toContain('40 leftover')
    })

    it('handles zero-pull packages in mobile view', async () => {
      const component = await mountSuspended(BattlePassSection, {
        props: {
          gameData: mockGameData,
          battlePassPackages: [mockBattlePassPackages[2]],
        },
      })

      const zeroPullText = component.find('.text-red-500')
      expect(zeroPullText.exists()).toBe(true)
      expect(zeroPullText.text()).toContain('0 warps')
    })
  })

  describe('Desktop View', () => {
    it('displays packages in desktop table format', async () => {
      const component = await mountSuspended(BattlePassSection, {
        props: {
          gameData: mockGameData,
          battlePassPackages: mockBattlePassPackages,
        },
      })

      const desktopView = component.find('.hidden.lg\\:block')
      expect(desktopView.exists()).toBe(true)

      // Check table headers
      expect(desktopView.text()).toContain('Battle Pass Name')
      expect(desktopView.text()).toContain('Price')
      expect(desktopView.text()).toContain('OS')
      expect(desktopView.text()).toContain('Warps')
      expect(desktopView.text()).toContain('Leftover')
      expect(desktopView.text()).toContain('Description')
    })

    it('shows package data in table rows', async () => {
      const component = await mountSuspended(BattlePassSection, {
        props: {
          gameData: mockGameData,
          battlePassPackages: mockBattlePassPackages.slice(0, 2),
        },
      })

      const tableRows = component.findAll('.divide-y .px-4.py-4')
      expect(tableRows).toHaveLength(2)

      // Check first row
      expect(tableRows[0].text()).toContain('Nameless Medal')
      expect(tableRows[0].text()).toContain('$9.99')
      expect(tableRows[0].text()).toContain('680')
      expect(tableRows[0].text()).toContain('4')
      expect(tableRows[0].text()).toContain('40')
      expect(tableRows[0].text()).toContain('Premium Battle Pass')
    })
  })

  describe('Name Formatting', () => {
    it('formats battle pass names correctly', async () => {
      const testPackage = {
        ...mockBattlePassPackages[0],
        name: 'Nameless Glory Medal Test',
      }

      const component = await mountSuspended(BattlePassSection, {
        props: {
          gameData: mockGameData,
          battlePassPackages: [testPackage],
        },
      })

      expect(component.text()).toContain('Nameless Glory Medal Test')
    })
  })

  describe('Battle Pass Analysis', () => {
    it('shows analysis section when valid packages exist', async () => {
      const component = await mountSuspended(BattlePassSection, {
        props: {
          gameData: mockGameData,
          battlePassPackages: mockBattlePassPackages.slice(0, 2), // Only valid packages
        },
      })

      expect(component.text()).toContain('Battle Pass Value Analysis')
      expect(component.text()).toContain('Best Value')
      expect(component.text()).toContain('Best Cost/Warp')
      expect(component.text()).toContain('Total Value')
      expect(component.text()).toContain('Total Warps')
    })

    it('does not show analysis when no valid packages exist', async () => {
      const component = await mountSuspended(BattlePassSection, {
        props: {
          gameData: mockGameData,
          battlePassPackages: [mockBattlePassPackages[2]], // Only zero-pull package
        },
      })

      expect(component.text()).not.toContain('Battle Pass Value Analysis')
    })

    it('calculates best value correctly', async () => {
      const component = await mountSuspended(BattlePassSection, {
        props: {
          gameData: mockGameData,
          battlePassPackages: mockBattlePassPackages.slice(0, 2),
        },
      })

      // Nameless Glory should be best value (lower cost per pull)
      expect(component.text()).toContain('Nameless Glory')
      expect(component.text()).toContain('$2.00')
    })

    it('calculates total values correctly', async () => {
      const component = await mountSuspended(BattlePassSection, {
        props: {
          gameData: mockGameData,
          battlePassPackages: mockBattlePassPackages.slice(0, 2),
        },
      })

      // Total value: $9.99 + $19.99 = $29.98
      expect(component.text()).toContain('$29.98')
      // Total pulls: 4 + 10 = 14
      expect(component.text()).toContain('14')
    })
  })

  describe('Edge Cases', () => {
    it('handles packages with missing description', async () => {
      const packageWithoutDesc = {
        ...mockBattlePassPackages[0],
        description: undefined,
      }

      const component = await mountSuspended(BattlePassSection, {
        props: {
          gameData: mockGameData,
          battlePassPackages: [packageWithoutDesc],
        },
      })

      expect(component.text()).toContain('N/A')
    })

    it('handles infinite cost per pull correctly', async () => {
      const component = await mountSuspended(BattlePassSection, {
        props: {
          gameData: mockGameData,
          battlePassPackages: [mockBattlePassPackages[2]], // Infinity cost package
        },
      })

      expect(component.text()).toContain('Zero Pull Battle Pass')
      expect(component.find('.text-red-500').exists()).toBe(true)
    })

    it('handles large numbers correctly', async () => {
      const largePackage = {
        ...mockBattlePassPackages[0],
        totalAmount: 1234567,
        price: 999.99,
      }

      const component = await mountSuspended(BattlePassSection, {
        props: {
          gameData: mockGameData,
          battlePassPackages: [largePackage],
        },
      })

      expect(component.text()).toContain('1,234,567')
      expect(component.text()).toContain('$999.99')
    })
  })

  describe('Responsive Classes', () => {
    it('applies correct responsive visibility classes', async () => {
      const component = await mountSuspended(BattlePassSection, {
        props: {
          gameData: mockGameData,
          battlePassPackages: mockBattlePassPackages,
        },
      })

      // Mobile view should be block on mobile, hidden on lg+
      expect(component.find('.block.lg\\:hidden').exists()).toBe(true)
      // Desktop view should be hidden on mobile, block on lg+
      expect(component.find('.hidden.lg\\:block').exists()).toBe(true)
    })

    it('applies correct color classes for different states', async () => {
      const component = await mountSuspended(BattlePassSection, {
        props: {
          gameData: mockGameData,
          battlePassPackages: mockBattlePassPackages,
        },
      })

      // Check purple theme colors
      expect(component.find('.text-purple-600').exists()).toBe(true)
      expect(component.find('.bg-purple-50').exists()).toBe(true)
      expect(component.find('.border-purple-200').exists()).toBe(true)
    })
  })
})