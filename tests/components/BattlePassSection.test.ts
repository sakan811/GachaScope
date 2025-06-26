// @vitest-environment nuxt
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BattlePassSection from '~/components/analysis/BattlePassSection.vue'
import type { GameData, ProcessedPackage } from '~/types/games'

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

const mockBattlePassPackages: ProcessedPackage[] = [
  {
    id: 'bp_1',
    name: 'Nameless Medal',
    price: 9.99,
    baseAmount: 500,
    extraAmount: 180,
    purchaseType: 'battle_pass',
    totalAmount: 680,
    amountPerDollar: 68.07,
    pullsFromPackage: 4,
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
    pullsFromPackage: 10,
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
    pullsFromPackage: 0,
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

      expect(component.html()).toContain('Battle Pass')
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

      expect(component.html()).toBe('<!--v-if-->')
    })

    it('does not render when battle pass packages is null', async () => {
      const component = await mountSuspended(BattlePassSection, {
        props: {
          gameData: mockGameData,
          battlePassPackages: null,
        },
      })

      expect(component.html()).toBe('<!--v-if-->')
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

      expect(component.html()).toContain('bg-purple-50')
      expect(component.html()).toContain('border-purple-200')
    })

    it('shows correct pricing and pull information in mobile view', async () => {
      const component = await mountSuspended(BattlePassSection, {
        props: {
          gameData: mockGameData,
          battlePassPackages: [mockBattlePassPackages[0]],
        },
      })

      expect(component.text()).toContain('$9.99')
      expect(component.text()).toContain('4 warps')
      expect(component.text()).toContain('680 os')
      expect(component.text()).toContain('40 leftover')
    })

    it('handles zero-pull packages in mobile view', async () => {
      const component = await mountSuspended(BattlePassSection, {
        props: {
          gameData: mockGameData,
          battlePassPackages: [mockBattlePassPackages[2]],
        },
      })

      expect(component.html()).toContain('text-red-500')
      expect(component.text()).toContain('0 warps')
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
  })
})
