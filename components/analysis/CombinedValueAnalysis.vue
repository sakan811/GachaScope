<template>
  <UCard class="mb-6 sm:mb-8">
    <template #header>
      <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <UIcon
          name="i-heroicons-currency-dollar"
          class="w-5 h-5 sm:w-6 sm:h-6"
        />
        In-App Purchase Value Analysis
      </h2>
    </template>

    <!-- Overall Best Value Card -->
    <div class="grid grid-cols-1 gap-3 sm:gap-4 mb-6">
      <UCard
        v-if="overallStats"
        :class="overallStats.bgClass"
      >
        <div class="text-center p-2 sm:p-3">
          <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1 sm:mb-2">
            {{ overallStats.label }}
          </div>
          <div
            class="text-lg sm:text-xl font-bold break-words"
            :class="overallStats.color"
          >
            {{ overallStats.value }}
          </div>
          <div
            v-if="overallStats.explanation"
            class="text-xs text-gray-500 dark:text-gray-400 mt-1"
          >
            {{ overallStats.explanation }}
          </div>
        </div>
      </UCard>
    </div>

    <!-- Package Type Comparison -->
    <div class="mb-6 pt-6 border-t border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <UIcon
          name="i-heroicons-chart-bar"
          class="w-4 h-4"
        />
        In-App Purchase Type Comparison
      </h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <UCard
          v-for="typeStats in purchaseTypeStats"
          :key="typeStats.type"
          :class="typeStats.bgClass"
        >
          <div class="text-center p-2 sm:p-3">
            <div
              class="text-sm font-medium mb-2"
              :class="typeStats.titleColor"
            >
              {{ typeStats.displayName }}
            </div>
            <div class="space-y-1">
              <div class="text-xs text-gray-600 dark:text-gray-300">
                Best In-App Purchase
              </div>
              <div
                class="text-sm font-bold"
                :class="typeStats.valueColor"
              >
                {{ typeStats.bestPurchaseName }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ typeStats.bestCostPerPull }} per {{ gameData.metadata.pull.name.toLowerCase() }}
              </div>
              <div class="text-xs text-blue-600 dark:text-blue-400 mt-1">
                {{ typeStats.explanation }}
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Zero-Warp Purchases Warning -->
    <div
      v-if="zeroWarpPurchases?.length"
      class="pt-6 border-t border-gray-200 dark:border-gray-700"
    >
      <h3 class="text-lg font-semibold text-red-700 dark:text-red-400 mb-4 flex items-center gap-2">
        <UIcon
          name="i-heroicons-exclamation-triangle"
          class="w-4 h-4"
        />
        Purchases to Avoid
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-300 mb-1">
        These purchases provide no warps and should be avoided purchasing them alone
      </p>

      <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
        They should be purchased only as part of a larger bundle that includes warps
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <UCard
          v-for="purchase in zeroWarpPurchases"
          :key="purchase.id"
          class="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
        >
          <div class="text-center p-2 sm:p-3">
            <div class="text-sm font-medium text-red-700 dark:text-red-300 mb-2">
              {{ purchase.type }}
            </div>
            <div class="space-y-1">
              <div class="text-xs text-gray-600 dark:text-gray-300">
                Avoid This Purchase
              </div>
              <div class="text-sm font-bold text-red-600 dark:text-red-400">
                {{ purchase.name }}
              </div>
              <div class="text-xs text-red-500 dark:text-red-400">
                ${{ purchase.price.toFixed(2) }} - no warps
              </div>
              <div class="text-xs text-red-600 dark:text-red-400 mt-1">
                This purchase provides no warp for the cost
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Savings Analysis - Normal vs First-Time Bonus Comparison -->
    <div
      v-if="purchaseSavingsAnalysis?.length"
      class="pt-6 border-t border-gray-200 dark:border-gray-700"
    >
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <UIcon
          name="i-heroicons-calculator"
          class="w-4 h-4"
        />
        Savings Analysis - Normal vs First-Time Bonus for Oneiric Shard Purchases
      </h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <UCard
          v-for="(savings, index) in purchaseSavingsAnalysis"
          :key="index"
          class="bg-green-50 dark:bg-green-900/20"
        >
          <div class="p-3 sm:p-4">
            <div class="text-center mb-3">
              <div class="text-sm font-medium text-green-600 dark:text-green-400 mb-1">
                {{ savings.normalPurchase }} vs {{ savings.bonusPurchase }}
              </div>
              <div class="text-lg font-bold text-green-600 dark:text-green-400">
                Save {{ savings.savingsAmount }}
              </div>
            </div>

            <div class="space-y-2 text-xs">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-300">Normal Cost:</span>
                <span class="font-medium text-red-600 dark:text-red-400">{{ savings.normalCost }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-300">Bonus Cost:</span>
                <span class="font-medium text-green-600 dark:text-green-400">{{ savings.bonusCost }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-300">You Get:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ savings.bonusPulls }} {{ gameData.metadata.pull.name.toLowerCase() }}s</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-300">Savings:</span>
                <span class="font-bold text-green-600 dark:text-green-400">{{ savings.savingsPercentage }}%</span>
              </div>
            </div>

            <div class="mt-3 pt-2 border-t border-green-200 dark:border-green-800">
              <div class="text-xs text-gray-500 dark:text-gray-400 text-center">
                {{ savings.explanation }}
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { GameData, ProcessedPurchase } from '~/types/games'

interface Props {
  gameData: GameData
  processedPurchases: Record<string, ProcessedPurchase[]>
}

const props = defineProps<Props>()

// Format cost per pull to handle infinity
const formatCostPerPull = (costPerPull: number): string => {
  if (!Number.isFinite(costPerPull) || costPerPull === Infinity) {
    return 'no warp for the cost'
  }
  return `$${costPerPull.toFixed(2)}`
}

// Purchase type configurations
const purchaseTypeConfig = {
  normal: {
    displayName: 'Normal Purchases',
    bgClass: 'bg-red-50 dark:bg-red-900/20',
    titleColor: 'text-red-600 dark:text-red-400',
    valueColor: 'text-red-700 dark:text-red-300',
  },
  first_time_bonus: {
    displayName: 'First-Time Bonus',
    bgClass: 'bg-green-50 dark:bg-green-900/20',
    titleColor: 'text-green-600 dark:text-green-400',
    valueColor: 'text-green-700 dark:text-green-300',
  },
  subscription: {
    displayName: 'Subscriptions',
    bgClass: 'bg-blue-50 dark:bg-blue-900/20',
    titleColor: 'text-blue-600 dark:text-blue-400',
    valueColor: 'text-blue-700 dark:text-blue-300',
  },
  battle_pass: {
    displayName: 'Battle Pass',
    bgClass: 'bg-purple-50 dark:bg-purple-900/20',
    titleColor: 'text-purple-600 dark:text-purple-400',
    valueColor: 'text-purple-700 dark:text-purple-300',
  },
}

// Get all valid purchases across all types
const allValidPurchases = computed(() => {
  const purchases: ProcessedPurchase[] = []
  Object.values(props.processedPurchases).forEach((typePurchases) => {
    if (typePurchases) {
      purchases.push(...typePurchases.filter(purchase => purchase.pullsFromPurchase > 0))
    }
  })
  return purchases
})

// Overall analysis - simplified to only show best overall value
const overallAnalysis = computed(() => {
  if (!allValidPurchases.value.length) return null

  const bestValue = allValidPurchases.value.reduce((best, purchase) =>
    purchase.costPerPull < best.costPerPull ? purchase : best,
  )

  return { bestValue }
})

// Overall stats - only one card now
const overallStats = computed(() => {
  if (!overallAnalysis.value) return null

  return {
    label: 'Best Overall Value',
    value: overallAnalysis.value.bestValue.name,
    color: 'text-green-600 dark:text-green-400',
    bgClass: 'bg-green-50 dark:bg-green-900/20',
    explanation: `Best cost per ${props.gameData.metadata.pull.name.toLowerCase()}: ${formatCostPerPull(overallAnalysis.value.bestValue.costPerPull)}`,
  }
})

// Purchase type comparison stats - now shows purchase names instead of counts
const purchaseTypeStats = computed(() => {
  const stats = []

  for (const [type, config] of Object.entries(purchaseTypeConfig)) {
    const allPurchases = props.processedPurchases[type] || []
    const validPurchases = allPurchases.filter(purchase => purchase.pullsFromPurchase > 0)
    const zeroPullPurchases = allPurchases.filter(purchase => purchase.pullsFromPurchase === 0)

    if (validPurchases.length > 0) {
      const bestPurchase = validPurchases.reduce((best, purchase) =>
        purchase.costPerPull < best.costPerPull ? purchase : best,
      )

      const costDisplay = formatCostPerPull(bestPurchase.costPerPull)
      const explanation = costDisplay === 'no warp for the cost'
        ? 'This purchase provides no warp for the cost'
        : `Each ${props.gameData.metadata.pull.name.toLowerCase()} costs ${costDisplay}`

      stats.push({
        type,
        displayName: config.displayName,
        bgClass: config.bgClass,
        titleColor: config.titleColor,
        valueColor: config.valueColor,
        bestPurchaseName: bestPurchase.name,
        bestCostPerPull: costDisplay,
        explanation,
      })
    }
  }

  return stats.sort((a, b) => {
    // Handle 'no warp for the cost' by putting them at the end
    if (a.bestCostPerPull === 'no warp for the cost' && b.bestCostPerPull !== 'no warp for the cost') return 1
    if (b.bestCostPerPull === 'no warp for the cost' && a.bestCostPerPull !== 'no warp for the cost') return -1
    if (a.bestCostPerPull === 'no warp for the cost' && b.bestCostPerPull === 'no warp for the cost') return 0

    const aValue = parseFloat(a.bestCostPerPull.replace('$', ''))
    const bValue = parseFloat(b.bestCostPerPull.replace('$', ''))

    // Handle NaN values by treating them as high values (put at end)
    if (isNaN(aValue) && isNaN(bValue)) return 0
    if (isNaN(aValue)) return 1
    if (isNaN(bValue)) return -1

    return aValue - bValue
  })
})

// Zero-warp purchases for warning section
const zeroWarpPurchases = computed(() => {
  const allZeroPurchases = []

  for (const [type, config] of Object.entries(purchaseTypeConfig)) {
    const purchases = props.processedPurchases[type] || []
    const zeroPullPurchases = purchases.filter(purchase => purchase.pullsFromPurchase === 0)

    for (const purchase of zeroPullPurchases) {
      allZeroPurchases.push({
        ...purchase,
        type: config.displayName,
      })
    }
  }

  return allZeroPurchases
})

// Purchase-specific savings analysis - comparing actual purchases by name
const purchaseSavingsAnalysis = computed(() => {
  const normalPurchases = props.processedPurchases.normal?.filter(purchase => purchase.pullsFromPurchase > 0) || []
  const bonusPurchases = props.processedPurchases.first_time_bonus?.filter(purchase => purchase.pullsFromPurchase > 0) || []

  if (normalPurchases.length === 0 || bonusPurchases.length === 0) return []

  // Sort purchases by price to match corresponding purchases
  const sortedNormal = [...normalPurchases].sort((a, b) => a.price - b.price)
  const sortedBonus = [...bonusPurchases].sort((a, b) => a.price - b.price)

  const purchaseComparisons = []
  const maxComparisons = Math.min(sortedNormal.length, sortedBonus.length)

  for (let i = 0; i < maxComparisons; i++) {
    const normalPurchase = sortedNormal[i]
    const bonusPurchase = sortedBonus[i]

    const savingsPerPull = normalPurchase.costPerPull - bonusPurchase.costPerPull
    const savingsPercentage = (savingsPerPull / normalPurchase.costPerPull) * 100
    const totalSavings = savingsPerPull * bonusPurchase.pullsFromPurchase

    if (savingsPerPull > 0) {
      purchaseComparisons.push({
        normalPurchase: normalPurchase.name.replace(' (First Purchase)', ''),
        bonusPurchase: bonusPurchase.name,
        normalCost: formatCostPerPull(normalPurchase.costPerPull) + ` per ${props.gameData.metadata.pull.name.toLowerCase()}`,
        bonusCost: formatCostPerPull(bonusPurchase.costPerPull) + ` per ${props.gameData.metadata.pull.name.toLowerCase()}`,
        bonusPulls: bonusPurchase.pullsFromPurchase,
        savingsAmount: `$${totalSavings.toFixed(2)}`,
        savingsPercentage: savingsPercentage.toFixed(1),
        explanation: `First-time bonus gives you ${bonusPurchase.pullsFromPurchase} ${props.gameData.metadata.pull.name.toLowerCase()}s for the same price as ${normalPurchase.pullsFromPurchase} ${props.gameData.metadata.pull.name.toLowerCase()}s`,
      })
    }
  }

  return purchaseComparisons
})
</script>
