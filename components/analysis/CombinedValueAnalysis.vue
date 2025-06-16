<template>
  <UCard class="mb-6 sm:mb-8">
    <template #header>
      <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <UIcon name="i-heroicons-currency-dollar" class="w-5 h-5 sm:w-6 sm:h-6" />
        In-App Purchase Value Analysis
      </h2>
    </template>

    <!-- Overall Best Value Card -->
    <div class="grid grid-cols-1 gap-3 sm:gap-4 mb-6">
      <UCard v-if="overallStats" :class="overallStats.bgClass">
        <div class="text-center p-2 sm:p-3">
          <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1 sm:mb-2">{{ overallStats.label }}</div>
          <div class="text-lg sm:text-xl font-bold break-words" :class="overallStats.color">{{ overallStats.value }}</div>
          <div v-if="overallStats.explanation" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {{ overallStats.explanation }}
          </div>
        </div>
      </UCard>
    </div>

    <!-- Package Type Comparison -->
    <div class="mb-6 pt-6 border-t border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <UIcon name="i-heroicons-chart-bar" class="w-4 h-4" />
        In-App Purchase Type Comparison
      </h3>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <UCard v-for="typeStats in packageTypeStats" :key="typeStats.type" :class="typeStats.bgClass">
          <div class="text-center p-2 sm:p-3">
            <div class="text-sm font-medium mb-2" :class="typeStats.titleColor">{{ typeStats.displayName }}</div>
            <div class="space-y-1">
              <div class="text-xs text-gray-600 dark:text-gray-300">
                Best In-App Purchase
              </div>
              <div class="text-sm font-bold" :class="typeStats.valueColor">
                {{ typeStats.bestPackageName }}
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

    <!-- Savings Analysis - Normal vs First-Time Bonus Comparison -->
    <div v-if="packageSavingsAnalysis?.length" class="pt-6 border-t border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <UIcon name="i-heroicons-calculator" class="w-4 h-4" />
        Savings Analysis - Normal vs First-Time Bonus for Oneiric Shard Purchases
      </h3>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <UCard v-for="(savings, index) in packageSavingsAnalysis" :key="index" class="bg-green-50 dark:bg-green-900/20">
          <div class="p-3 sm:p-4">
            <div class="text-center mb-3">
              <div class="text-sm font-medium text-green-600 dark:text-green-400 mb-1">
                {{ savings.normalPackage }} vs {{ savings.bonusPackage }}
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
import type { GameData, ProcessedPackage } from '~/types/games'

interface Props {
  gameData: GameData
  processedPackages: Record<string, ProcessedPackage[]>
}

const props = defineProps<Props>()

// Format cost per pull to handle infinity
const formatCostPerPull = (costPerPull: number): string => {
  if (!Number.isFinite(costPerPull) || costPerPull === Infinity) {
    return 'no warp for the cost'
  }
  return `$${costPerPull.toFixed(2)}`
}

// Package type configurations
const packageTypeConfig = {
  normal: {
    displayName: 'Normal Packages',
    bgClass: 'bg-red-50 dark:bg-red-900/20',
    titleColor: 'text-red-600 dark:text-red-400',
    valueColor: 'text-red-700 dark:text-red-300'
  },
  first_time_bonus: {
    displayName: 'First-Time Bonus',
    bgClass: 'bg-green-50 dark:bg-green-900/20',
    titleColor: 'text-green-600 dark:text-green-400',
    valueColor: 'text-green-700 dark:text-green-300'
  },
  subscription: {
    displayName: 'Subscriptions',
    bgClass: 'bg-blue-50 dark:bg-blue-900/20',
    titleColor: 'text-blue-600 dark:text-blue-400',
    valueColor: 'text-blue-700 dark:text-blue-300'
  },
  battle_pass: {
    displayName: 'Battle Pass',
    bgClass: 'bg-purple-50 dark:bg-purple-900/20',
    titleColor: 'text-purple-600 dark:text-purple-400',
    valueColor: 'text-purple-700 dark:text-purple-300'
  }
}

// Get all valid packages across all types
const allValidPackages = computed(() => {
  const packages: ProcessedPackage[] = []
  Object.values(props.processedPackages).forEach(typePackages => {
    if (typePackages) {
      packages.push(...typePackages.filter(pkg => pkg.pullsFromPackage > 0))
    }
  })
  return packages
})

// Overall analysis - simplified to only show best overall value
const overallAnalysis = computed(() => {
  if (!allValidPackages.value.length) return null

  const bestValue = allValidPackages.value.reduce((best, pkg) => 
    pkg.costPerPull < best.costPerPull ? pkg : best
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
    explanation: `Best cost per ${props.gameData.metadata.pull.name.toLowerCase()}: ${formatCostPerPull(overallAnalysis.value.bestValue.costPerPull)}`
  }
})

// Package type comparison stats - now shows package names instead of counts
const packageTypeStats = computed(() => {
  const stats = []
  
  for (const [type, config] of Object.entries(packageTypeConfig)) {
    const packages = props.processedPackages[type]?.filter(pkg => pkg.pullsFromPackage > 0) || []
    
    if (packages.length > 0) {
      const bestPackage = packages.reduce((best, pkg) => 
        pkg.costPerPull < best.costPerPull ? pkg : best
      )
      
      const costDisplay = formatCostPerPull(bestPackage.costPerPull)
      const explanation = costDisplay === 'no warp for the cost' 
        ? 'This package provides no warps for the cost'
        : `Each ${props.gameData.metadata.pull.name.toLowerCase()} costs ${costDisplay}`
      
      stats.push({
        type,
        displayName: config.displayName,
        bgClass: config.bgClass,
        titleColor: config.titleColor,
        valueColor: config.valueColor,
        bestPackageName: bestPackage.name,
        bestCostPerPull: costDisplay,
        explanation
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
    return aValue - bValue
  })
})

// Package-specific savings analysis - comparing actual packages by name
const packageSavingsAnalysis = computed(() => {
  const normalPackages = props.processedPackages.normal?.filter(pkg => pkg.pullsFromPackage > 0) || []
  const bonusPackages = props.processedPackages.first_time_bonus?.filter(pkg => pkg.pullsFromPackage > 0) || []

  if (normalPackages.length === 0 || bonusPackages.length === 0) return []

  // Sort packages by price to match corresponding packages
  const sortedNormal = [...normalPackages].sort((a, b) => a.price - b.price)
  const sortedBonus = [...bonusPackages].sort((a, b) => a.price - b.price)

  const packageComparisons = []
  const maxComparisons = Math.min(sortedNormal.length, sortedBonus.length)

  for (let i = 0; i < maxComparisons; i++) {
    const normalPkg = sortedNormal[i]
    const bonusPkg = sortedBonus[i]
    
    const savingsPerPull = normalPkg.costPerPull - bonusPkg.costPerPull
    const savingsPercentage = (savingsPerPull / normalPkg.costPerPull) * 100
    const totalSavings = savingsPerPull * bonusPkg.pullsFromPackage
    
    if (savingsPerPull > 0) {
      packageComparisons.push({
        normalPackage: normalPkg.name.replace(' (First Purchase)', ''),
        bonusPackage: bonusPkg.name,
        normalCost: formatCostPerPull(normalPkg.costPerPull) + ` per ${props.gameData.metadata.pull.name.toLowerCase()}`,
        bonusCost: formatCostPerPull(bonusPkg.costPerPull) + ` per ${props.gameData.metadata.pull.name.toLowerCase()}`,
        bonusPulls: bonusPkg.pullsFromPackage,
        savingsAmount: `$${totalSavings.toFixed(2)}`,
        savingsPercentage: savingsPercentage.toFixed(1),
        explanation: `First-time bonus gives you ${bonusPkg.pullsFromPackage} ${props.gameData.metadata.pull.name.toLowerCase()}s for the same price as ${normalPkg.pullsFromPackage} ${props.gameData.metadata.pull.name.toLowerCase()}s`
      })
    }
  }

  return packageComparisons
})
</script>