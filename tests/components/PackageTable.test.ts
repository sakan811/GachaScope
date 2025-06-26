// @vitest-environment nuxt
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PackageTable from '~/components/analysis/PackageTable.vue'
import type { ProcessedPurchase } from '~/types/games'

const mockPackages: ProcessedPurchase[] = [
  {
    id: 'pkg_1',
    name: 'Small Purchase',
    price: 4.99,
    baseAmount: 300,
    extraAmount: 60,
    purchaseType: 'normal',
    totalAmount: 360,
    amountPerDollar: 72.14,
    pullsFromPurchase: 2,
    costPerPull: 2.50,
    leftoverAmount: 40,
    efficiency: 72.14,
  },
  {
    id: 'pkg_2',
    name: 'Large Purchase',
    price: 19.99,
    baseAmount: 1000,
    extraAmount: 600,
    purchaseType: 'normal',
    totalAmount: 1600,
    amountPerDollar: 80.04,
    pullsFromPurchase: 10,
    costPerPull: 2.00,
    leftoverAmount: 0,
    efficiency: 80.04,
  },
  {
    id: 'pkg_3',
    name: 'Zero Pull Purchase',
    price: 0.99,
    baseAmount: 50,
    extraAmount: 0,
    purchaseType: 'normal',
    totalAmount: 50,
    amountPerDollar: 50.51,
    pullsFromPurchase: 0,
    costPerPull: Infinity,
    leftoverAmount: 50,
    efficiency: 50.51,
  },
]

describe('PackageTable.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Component Rendering', () => {
    it('renders with valid packages', async () => {
      const component = await mountSuspended(PackageTable, {
        props: {
          packages: mockPackages,
          pullName: 'Warp',
          currencyName: 'OS',
          title: 'Test Purchases',
        },
      })

      expect(component.text()).toContain('Test Purchases')
      expect(component.text()).toContain('Small Purchase')
      expect(component.text()).toContain('Large Purchase')
    })

    it('renders with empty packages array', async () => {
      const component = await mountSuspended(PackageTable, {
        props: {
          packages: [],
          pullName: 'Warp',
          currencyName: 'OS',
          title: 'Empty Test',
        },
      })

      expect(component.text()).toContain('Empty Test')
      expect(component.find('.divide-y').exists()).toBe(true)
      // Should have empty table body
      expect(component.findAll('.px-4.py-4')).toHaveLength(0)
    })
  })

  describe('Table Structure', () => {
    it('displays correct table headers', async () => {
      const component = await mountSuspended(PackageTable, {
        props: {
          packages: mockPackages,
          pullName: 'Warp',
          currencyName: 'Oneiric Shard',
          title: 'Purchase Analysis',
        },
      })

      // Check all column headers
      expect(component.text()).toContain('Name')
      expect(component.text()).toContain('Price')
      expect(component.text()).toContain('Oneiric Shard')
      expect(component.text()).toContain('Warps')
      expect(component.text()).toContain('Leftover')
    })

    it('displays package data in correct columns', async () => {
      const component = await mountSuspended(PackageTable, {
        props: {
          packages: [mockPackages[0]],
          pullName: 'Warp',
          currencyName: 'OS',
          title: 'Single Purchase',
        },
      })

      const tableRow = component.find('.px-4.py-4')
      expect(tableRow.exists()).toBe(true)

      // Check data in correct order: Name, Price, Currency, Pulls, Leftover
      const columns = tableRow.findAll('.grid > div')
      expect(columns[0].text()).toContain('Small Purchase')
      expect(columns[1].text()).toContain('$4.99')
      expect(columns[2].text()).toContain('360')
      expect(columns[3].text()).toContain('2')
      expect(columns[4].text()).toContain('40')
    })

    it('formats large numbers with commas', async () => {
      const largePurchase = {
        ...mockPackages[0],
        totalAmount: 1234567,
      }

      const component = await mountSuspended(PackageTable, {
        props: {
          packages: [largePurchase],
          pullName: 'Warp',
          currencyName: 'OS',
          title: 'Large Numbers',
        },
      })

      expect(component.text()).toContain('1,234,567')
    })
  })

  describe('Zero Pull Purchases', () => {
    it('highlights zero-pull purchases with red text', async () => {
      const component = await mountSuspended(PackageTable, {
        props: {
          packages: [mockPackages[2]], // Zero pull purchase
          pullName: 'Warp',
          currencyName: 'OS',
          title: 'Zero Pull Test',
        },
      })

      const redText = component.find('.text-red-500')
      expect(redText.exists()).toBe(true)
      expect(redText.text()).toContain('0')
    })

    it('applies normal styling to purchases with pulls', async () => {
      const component = await mountSuspended(PackageTable, {
        props: {
          packages: [mockPackages[0]], // Purchase with 2 pulls
          pullName: 'Warp',
          currencyName: 'OS',
          title: 'Normal Pull Test',
          textColor: 'text-gray-900 dark:text-white',
        },
      })

      // Should not have red text for zero pulls
      expect(component.find('.text-red-500').exists()).toBe(false)
      // Should use the provided textColor
      expect(component.html()).toContain('text-gray-900 dark:text-white')
    })
  })

  describe('Customizable Styling', () => {
    it('applies custom header background class', async () => {
      const component = await mountSuspended(PackageTable, {
        props: {
          packages: mockPackages,
          pullName: 'Warp',
          currencyName: 'OS',
          title: 'Custom Style Test',
          headerBg: 'bg-purple-50 dark:bg-purple-900/20',
        },
      })

      expect(component.html()).toContain('bg-purple-50 dark:bg-purple-900/20')
    })

    it('applies custom header border class', async () => {
      const component = await mountSuspended(PackageTable, {
        props: {
          packages: mockPackages,
          pullName: 'Warp',
          currencyName: 'OS',
          title: 'Border Test',
          headerBorder: 'border-blue-200 dark:border-blue-800',
        },
      })

      expect(component.html()).toContain('border-blue-200 dark:border-blue-800')
    })

    it('applies custom text color class', async () => {
      const component = await mountSuspended(PackageTable, {
        props: {
          packages: [mockPackages[0]], // Package with pulls
          pullName: 'Warp',
          currencyName: 'OS',
          title: 'Text Color Test',
          textColor: 'text-blue-600 dark:text-blue-400',
        },
      })

      expect(component.html()).toContain('text-blue-600 dark:text-blue-400')
    })

    it('uses default styling when no custom classes provided', async () => {
      const component = await mountSuspended(PackageTable, {
        props: {
          packages: mockPackages,
          pullName: 'Warp',
          currencyName: 'OS',
          title: 'Default Style Test',
        },
      })

      expect(component.html()).toContain('bg-gray-50 dark:bg-gray-900/20')
      expect(component.html()).toContain('border-gray-200 dark:border-gray-800')
      expect(component.html()).toContain('text-gray-900 dark:text-white')
    })
  })

  describe('Props Validation', () => {
    it('handles different pull name pluralization', async () => {
      const component = await mountSuspended(PackageTable, {
        props: {
          packages: mockPackages,
          pullName: 'Summon',
          currencyName: 'Crystal',
          title: 'Different Game',
        },
      })

      expect(component.text()).toContain('Summons') // Should pluralize
      expect(component.text()).toContain('Crystal')
    })

    it('displays title correctly', async () => {
      const testTitle = 'My Custom Purchase Analysis'
      const component = await mountSuspended(PackageTable, {
        props: {
          packages: mockPackages,
          pullName: 'Warp',
          currencyName: 'OS',
          title: testTitle,
        },
      })

      expect(component.text()).toContain(testTitle)
    })
  })

  describe('Grid Layout', () => {
    it('uses 5-column grid layout', async () => {
      const component = await mountSuspended(PackageTable, {
        props: {
          packages: mockPackages,
          pullName: 'Warp',
          currencyName: 'OS',
          title: 'Grid Test',
        },
      })

      expect(component.find('.grid.grid-cols-5').exists()).toBe(true)
    })

    it('applies gap spacing correctly', async () => {
      const component = await mountSuspended(PackageTable, {
        props: {
          packages: mockPackages,
          pullName: 'Warp',
          currencyName: 'OS',
          title: 'Gap Test',
        },
      })

      expect(component.find('.gap-4').exists()).toBe(true)
    })
  })

  describe('Hover Effects', () => {
    it('applies hover styling to table rows', async () => {
      const component = await mountSuspended(PackageTable, {
        props: {
          packages: mockPackages,
          pullName: 'Warp',
          currencyName: 'OS',
          title: 'Hover Test',
        },
      })

      const tableRow = component.find('.px-4.py-4')
      expect(tableRow.classes()).toContain('hover:bg-gray-50')
      expect(tableRow.classes()).toContain('transition-colors')
    })
  })

  describe('Price Formatting', () => {
    it('formats prices with two decimal places', async () => {
      const purchaseWithOddPrice = {
        ...mockPackages[0],
        price: 4.5,
      }

      const component = await mountSuspended(PackageTable, {
        props: {
          packages: [purchaseWithOddPrice],
          pullName: 'Warp',
          currencyName: 'OS',
          title: 'Price Format Test',
        },
      })

      expect(component.text()).toContain('$4.50')
    })

    it('handles zero price correctly', async () => {
      const freePurchase = {
        ...mockPackages[0],
        price: 0,
      }

      const component = await mountSuspended(PackageTable, {
        props: {
          packages: [freePurchase],
          pullName: 'Warp',
          currencyName: 'OS',
          title: 'Free Purchase Test',
        },
      })

      expect(component.text()).toContain('$0.00')
    })
  })

  describe('Multiple Purchases', () => {
    it('renders all purchases in the array', async () => {
      const component = await mountSuspended(PackageTable, {
        props: {
          packages: mockPackages,
          pullName: 'Warp',
          currencyName: 'OS',
          title: 'Multiple Purchases',
        },
      })

      const tableRows = component.findAll('.divide-y .px-4.py-4')
      expect(tableRows).toHaveLength(3)

      // Check each purchase is rendered
      expect(component.text()).toContain('Small Purchase')
      expect(component.text()).toContain('Large Purchase')
      expect(component.text()).toContain('Zero Pull Purchase')
    })
  })
})
