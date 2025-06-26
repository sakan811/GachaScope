// @vitest-environment nuxt
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PackageCard from '~/components/analysis/PackageCard.vue'
import type { ProcessedPurchase } from '~/types/games'

const mockPackage: ProcessedPurchase = {
  id: 'pkg_1',
  name: 'Test Package',
  price: 9.99,
  baseAmount: 500,
  extraAmount: 180,
  purchaseType: 'normal',
  totalAmount: 680,
  amountPerDollar: 68.07,
  pullsFromPurchase: 4,
  costPerPull: 2.50,
  leftoverAmount: 40,
  efficiency: 68.07,
}

const zeroPullPackage: ProcessedPurchase = {
  id: 'zero_pkg',
  name: 'Zero Pull Package',
  price: 1.99,
  baseAmount: 100,
  extraAmount: 0,
  purchaseType: 'normal',
  totalAmount: 100,
  amountPerDollar: 50.25,
  pullsFromPurchase: 0,
  costPerPull: Infinity,
  leftoverAmount: 100,
  efficiency: 50.25,
}

describe('PackageCard.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Component Rendering with Valid Package', () => {
    it('renders with valid package data', async () => {
      const component = await mountSuspended(PackageCard, {
        props: {
          pkg: mockPackage,
          pullName: 'Warp',
          currencyName: 'Oneiric Shard',
        },
      })

      expect(component.text()).toContain('$9.99')
      expect(component.text()).toContain('4 warps')
      expect(component.text()).toContain('680 oneiric shard')
      expect(component.text()).toContain('40 leftover')
    })

    it('applies correct default styling classes', async () => {
      const component = await mountSuspended(PackageCard, {
        props: {
          pkg: mockPackage,
          pullName: 'Warp',
          currencyName: 'OS',
        },
      })

      const cardElement = component.find('.p-4.rounded-lg.border')
      expect(cardElement.exists()).toBe(true)
      expect(cardElement.classes()).toContain('bg-gray-50')
      expect(cardElement.classes()).toContain('border-gray-200')
    })

    it('formats price with two decimal places', async () => {
      const packageWithOddPrice = {
        ...mockPackage,
        price: 5.5,
      }

      const component = await mountSuspended(PackageCard, {
        props: {
          pkg: packageWithOddPrice,
          pullName: 'Warp',
          currencyName: 'OS',
        },
      })

      expect(component.text()).toContain('$5.50')
    })
  })

  describe('Component Rendering with Null Package', () => {
    it('shows error message when package is null', async () => {
      const component = await mountSuspended(PackageCard, {
        props: {
          pkg: null,
          pullName: 'Warp',
          currencyName: 'OS',
        },
      })

      expect(component.text()).toContain('Package data unavailable')
      expect(component.find('.border-red-300').exists()).toBe(true)
      expect(component.find('.bg-red-50').exists()).toBe(true)
    })

    it('applies error styling when package is null', async () => {
      const component = await mountSuspended(PackageCard, {
        props: {
          pkg: null,
          pullName: 'Warp',
          currencyName: 'OS',
        },
      })

      const errorCard = component.find('.border-red-300')
      expect(errorCard.exists()).toBe(true)
      expect(errorCard.classes()).toContain('bg-red-50')
      expect(component.find('.text-red-600').exists()).toBe(true)
    })
  })

  describe('Zero Pull Package Handling', () => {
    it('highlights zero-pull packages with red text', async () => {
      const component = await mountSuspended(PackageCard, {
        props: {
          pkg: zeroPullPackage,
          pullName: 'Warp',
          currencyName: 'OS',
        },
      })

      const redText = component.find('.text-red-500')
      expect(redText.exists()).toBe(true)
      expect(redText.text()).toContain('0 warps')
    })

    it('shows correct data for zero-pull package', async () => {
      const component = await mountSuspended(PackageCard, {
        props: {
          pkg: zeroPullPackage,
          pullName: 'Warp',
          currencyName: 'OS',
        },
      })

      expect(component.text()).toContain('$1.99')
      expect(component.text()).toContain('0 warps')
      expect(component.text()).toContain('100 os')
      expect(component.text()).toContain('100 leftover')
    })
  })

  describe('Custom Styling Props', () => {
    it('applies custom background color', async () => {
      const component = await mountSuspended(PackageCard, {
        props: {
          pkg: mockPackage,
          pullName: 'Warp',
          currencyName: 'OS',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        },
      })

      expect(component.html()).toContain('bg-blue-50 dark:bg-blue-900/20')
    })

    it('applies custom border color', async () => {
      const component = await mountSuspended(PackageCard, {
        props: {
          pkg: mockPackage,
          pullName: 'Warp',
          currencyName: 'OS',
          borderColor: 'border-purple-200 dark:border-purple-800',
        },
      })

      expect(component.html()).toContain('border-purple-200 dark:border-purple-800')
    })

    it('applies custom text color for non-zero pulls', async () => {
      const component = await mountSuspended(PackageCard, {
        props: {
          pkg: mockPackage,
          pullName: 'Warp',
          currencyName: 'OS',
          textColor: 'text-green-600 dark:text-green-400',
        },
      })

      expect(component.html()).toContain('text-green-600 dark:text-green-400')
    })
  })

  describe('Null-Safe Property Access', () => {
    it('handles missing price property', async () => {
      const packageMissingPrice = {
        ...mockPackage,
        price: undefined,
      }

      const component = await mountSuspended(PackageCard, {
        props: {
          pkg: packageMissingPrice,
          pullName: 'Warp',
          currencyName: 'OS',
        },
      })

      expect(component.text()).toContain('$0.00')
    })

    it('handles missing pullsFromPurchase property', async () => {
      const packageMissingPulls = {
        ...mockPackage,
        pullsFromPurchase: undefined,
      }

      const component = await mountSuspended(PackageCard, {
        props: {
          pkg: packageMissingPulls,
          pullName: 'Warp',
          currencyName: 'OS',
        },
      })

      expect(component.text()).toContain('0 warps')
      expect(component.find('.text-red-500').exists()).toBe(true)
    })

    it('handles missing totalAmount property', async () => {
      const packageMissingAmount = {
        ...mockPackage,
        totalAmount: undefined,
      }

      const component = await mountSuspended(PackageCard, {
        props: {
          pkg: packageMissingAmount,
          pullName: 'Warp',
          currencyName: 'OS',
        },
      })

      expect(component.text()).toContain('0 os')
    })

    it('handles missing leftoverAmount property', async () => {
      const packageMissingLeftover = {
        ...mockPackage,
        leftoverAmount: undefined,
      }

      const component = await mountSuspended(PackageCard, {
        props: {
          pkg: packageMissingLeftover,
          pullName: 'Warp',
          currencyName: 'OS',
        },
      })

      expect(component.text()).toContain('0 leftover')
    })
  })

  describe('TypeScript Props Interface', () => {
    it('accepts ProcessedPurchase type correctly', async () => {
      const component = await mountSuspended(PackageCard, {
        props: {
          pkg: mockPackage,
          pullName: 'Warp',
          currencyName: 'OS',
        },
      })

      expect(component.vm).toBeTruthy()
    })

    it('accepts null package correctly', async () => {
      const component = await mountSuspended(PackageCard, {
        props: {
          pkg: null,
          pullName: 'Warp',
          currencyName: 'OS',
        },
      })

      expect(component.vm).toBeTruthy()
    })
  })

  describe('Currency and Pull Name Display', () => {
    it('converts currency name to lowercase', async () => {
      const component = await mountSuspended(PackageCard, {
        props: {
          pkg: mockPackage,
          pullName: 'Warp',
          currencyName: 'ONEIRIC SHARD',
        },
      })

      expect(component.text()).toContain('oneiric shard')
      expect(component.text()).not.toContain('ONEIRIC SHARD')
    })

    it('converts pull name to lowercase and pluralizes', async () => {
      const component = await mountSuspended(PackageCard, {
        props: {
          pkg: mockPackage,
          pullName: 'WARP',
          currencyName: 'OS',
        },
      })

      expect(component.text()).toContain('warps')
      expect(component.text()).not.toContain('WARP')
    })
  })

  describe('Edge Cases and Boundary Values', () => {
    it('handles zero price', async () => {
      const freePackage = {
        ...mockPackage,
        price: 0,
      }

      const component = await mountSuspended(PackageCard, {
        props: {
          pkg: freePackage,
          pullName: 'Warp',
          currencyName: 'OS',
        },
      })

      expect(component.text()).toContain('$0.00')
    })

    it('handles very large numbers', async () => {
      const largePackage = {
        ...mockPackage,
        totalAmount: 9999999,
        leftoverAmount: 1234567,
      }

      const component = await mountSuspended(PackageCard, {
        props: {
          pkg: largePackage,
          pullName: 'Warp',
          currencyName: 'OS',
        },
      })

      expect(component.text()).toContain('9999999')
      expect(component.text()).toContain('1234567')
    })

    it('handles negative values gracefully', async () => {
      const negativePackage = {
        ...mockPackage,
        pullsFromPurchase: -1,
        leftoverAmount: -5,
      }

      const component = await mountSuspended(PackageCard, {
        props: {
          pkg: negativePackage,
          pullName: 'Warp',
          currencyName: 'OS',
        },
      })

      // Should treat negative pulls as zero pulls (red text)
      expect(component.find('.text-red-500').exists()).toBe(true)
      expect(component.text()).toContain('-5 leftover')
    })
  })

  describe('Layout and Structure', () => {
    it('maintains proper card structure', async () => {
      const component = await mountSuspended(PackageCard, {
        props: {
          pkg: mockPackage,
          pullName: 'Warp',
          currencyName: 'OS',
        },
      })

      expect(component.find('.p-4.rounded-lg.border').exists()).toBe(true)
      expect(component.find('.flex.justify-between.items-start').exists()).toBe(true)
      expect(component.find('.text-lg.font-bold').exists()).toBe(true)
    })

    it('uses correct text sizing classes', async () => {
      const component = await mountSuspended(PackageCard, {
        props: {
          pkg: mockPackage,
          pullName: 'Warp',
          currencyName: 'OS',
        },
      })

      expect(component.find('.text-lg').exists()).toBe(true) // Price
      expect(component.find('.text-sm').exists()).toBe(true) // Currency amount
      expect(component.find('.text-xs').exists()).toBe(true) // Leftover
    })
  })
})