<template>
  <UCard class="mb-6 sm:mb-8">
    <template #header>
      <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <UIcon name="i-heroicons-currency-dollar" class="w-5 h-5 sm:w-6 sm:h-6" />
        Combined Value Analysis
      </h2>
    </template>

    <!-- Overall Best Value Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <UCard v-for="stat in overallStats" :key="stat.label" :class="stat.bgClass">
        <div class="text-center p-2 sm:p-3">
          <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1 sm:mb-2">{{ stat.label }}</div>
          <div class="text-lg sm:text-xl font-bold break-words" :class="stat.color">{{ stat.value }}</div>
          <div v-if="stat.explanation" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {{ stat.explanation }}
          </div>
        </div>
      </UCard>
    </div>

    <!-- Package Type Comparison -->
    <div class="mb-6 pt-6 border-t border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <UIcon name="i-heroicons-chart-bar" class="w-4 h-4" />
        Package Type Comparison
      </h3>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <UCard v-for="typeStats in packageTypeStats" :key="typeStats.type" :class="typeStats.bgClass">
          <div class="text-center p-2 sm:p-3">
            <div class="text-sm font-medium mb-2" :class="typeStats.titleColor">{{ typeStats.displayName }}</div>
            <div class="space-y-1">
              <div class="text-xs text-gray-600 dark:text-gray-300">
                Best Cost/{{ gameData.metadata.pull.name }}
              </div>
              <div class="text-lg font-bold" :class="typeStats.valueColor">
                {{ typeStats.bestCostPerPull }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ typeStats.packageCount }} package{{ typeStats.packageCount !== 1 ? 's' : '' }}
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Savings Analysis -->
    <div v-if="savingsAnalysis" class="pt-6 border-t border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <UIcon name="i-heroicons-calculator" class="w-4 h-4" />
        Savings Analysis
      </h3>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <UCard v-for="saving in savingsStats" :key="saving.label" class="bg-green-50 dark:bg-green-900/20">
          <div class="text-center p-2 sm:p-3">
            <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1 sm:mb-2">{{ saving.label }}</div>
            <div class="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">{{ saving.value }}</div>
            <div v-if="saving.explanation" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ saving.explanation }}
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Monthly vs One-time Analysis -->
    <div v-if="monthlyAnalysis" class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
        Monthly vs One-time Analysis
      </h3>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <UCard class="bg-blue-50 dark:bg-blue-900/20">
          <div class="p-3 sm:p-4">
            <h4 class="font-medium text-blue-600 dark:text-blue-400 mb-2">Monthly Subscriptions</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-300">Monthly Cost:</span>
                <span class="font-semibold text-gray-900 dark:text-white">{{ monthlyAnalysis.monthlyCost }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-300">Monthly {{ gameData.metadata.pull.name }}s:</span>
                <span class="font-semibold text-gray-900 dark:text-white">{{ monthlyAnalysis.monthlyPulls }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-300">Annual Cost:</span>
                <span class="font-semibold text-gray-900 dark:text-white">{{ monthlyAnalysis.annualCost }}</span>
              </div>
            </div>
          </div>
        </UCard>

        <UCard class="bg-purple-50 dark:bg-purple-900/20">
          <div class="p-3 sm:p-4">
            <h4 class="font-medium text-purple-600 dark:text-purple-400 mb-2">One-time Purchases</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-300">Best One-time Deal:</span>
                <span class="font-semibold text-gray-900 dark:text-white">{{ monthlyAnalysis.bestOneTime }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-300">Cost per {{ gameData.metadata.pull.name }}:</span>
                <span class="font-semibold text-gray-900 dark:text-white">{{ monthlyAnalysis.bestOneTimeCostPerPull }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-300">Break-even:</span>
                <span class="font-semibold text-gray-900 dark:text-white">{{ monthlyAnalysis.breakEven }}</span>
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

// Overall analysis
const overallAnalysis = computed(() => {
  if (!allValidPackages.value.length) return null

  const bestValue = allValidPackages.value.reduce((best, pkg) => 
    pkg.costPerPull < best.costPerPull ? pkg : best
  )
  
  const worstValue = allValidPackages.value.reduce((worst, pkg) => 
    pkg.costPerPull > worst.costPerPull ? pkg : worst
  )

  const avgCostPerPull = allValidPackages.value.reduce((sum, pkg) => sum + pkg.costPerPull, 0) / allValidPackages.value.length

  const totalPackages = allValidPackages.value.length

  return {
    bestValue,
    worstValue,
    avgCostPerPull,
    totalPackages,
    savings: worstValue.costPerPull - bestValue.costPerPull
  }
})

// Overall stats for top cards
const overallStats = computed(() => {
  if (!overallAnalysis.value) return []

  const formatValue = (value: number, prefix = '$') => 
    Number.isFinite(value) ? `${prefix}${value.toFixed(2)}` : 'N/A'

  return [
    {
      label: 'Best Overall Value',
      value: overallAnalysis.value.bestValue.name,
      color: 'text-green-600 dark:text-green-400',
      bgClass: 'bg-green-50 dark:bg-green-900/20',
      explanation: `Best cost per ${props.gameData.metadata.pull.name.toLowerCase()}`
    },
    {
      label: `Best Cost/${props.gameData.metadata.pull.name}`,
      value: formatValue(overallAnalysis.value.bestValue.costPerPull),
      color: 'text-blue-600 dark:text-blue-400',
      bgClass: 'bg-blue-50 dark:bg-blue-900/20',
      explanation: 'Lowest cost per pull across all types'
    },
    {
      label: 'Maximum Savings',
      value: formatValue(overallAnalysis.value.savings),
      color: 'text-purple-600 dark:text-purple-400',
      bgClass: 'bg-purple-50 dark:bg-purple-900/20',
      explanation: 'Difference between best and worst value'
    },
    {
      label: 'Total Packages',
      value: overallAnalysis.value.totalPackages.toString(),
      color: 'text-gray-900 dark:text-white',
      bgClass: 'bg-gray-50 dark:bg-gray-800/50',
      explanation: 'Available packages across all types'
    }
  ]
})

// Package type comparison stats
const packageTypeStats = computed(() => {
  const stats = []
  
  for (const [type, config] of Object.entries(packageTypeConfig)) {
    const packages = props.processedPackages[type]?.filter(pkg => pkg.pullsFromPackage > 0) || []
    
    if (packages.length > 0) {
      const bestPackage = packages.reduce((best, pkg) => 
        pkg.costPerPull < best.costPerPull ? pkg : best
      )
      
      stats.push({
        type,
        displayName: config.displayName,
        bgClass: config.bgClass,
        titleColor: config.titleColor,
        valueColor: config.valueColor,
        bestCostPerPull: `$${bestPackage.costPerPull.toFixed(2)}`,
        packageCount: packages.length
      })
    }
  }
  
  return stats.sort((a, b) => {
    const aValue = parseFloat(a.bestCostPerPull.replace('$', ''))
    const bValue = parseFloat(b.bestCostPerPull.replace('$', ''))
    return aValue - bValue
  })
})

// Savings analysis
const savingsAnalysis = computed(() => {
  if (!overallAnalysis.value) return null

  const normalPackages = props.processedPackages.normal?.filter(pkg => pkg.pullsFromPackage > 0) || []
  const bonusPackages = props.processedPackages.first_time_bonus?.filter(pkg => pkg.pullsFromPackage > 0) || []

  if (normalPackages.length === 0 || bonusPackages.length === 0) return null

  const bestNormal = normalPackages.reduce((best, pkg) => 
    pkg.costPerPull < best.costPerPull ? pkg : best
  )
  
  const bestBonus = bonusPackages.reduce((best, pkg) => 
    pkg.costPerPull < best.costPerPull ? pkg : best
  )

  const savings = bestNormal.costPerPull - bestBonus.costPerPull
  const savingsPercentage = (savings / bestNormal.costPerPull) * 100

  return {
    bestNormal,
    bestBonus,
    savings,
    savingsPercentage
  }
})

const savingsStats = computed(() => {
  if (!savingsAnalysis.value) return []

  const formatValue = (value: number, prefix = '$') => 
    Number.isFinite(value) ? `${prefix}${value.toFixed(2)}` : 'N/A'

  return [
    {
      label: 'First-Time Bonus Savings',
      value: formatValue(savingsAnalysis.value.savings),
      explanation: `Per ${props.gameData.metadata.pull.name.toLowerCase()} vs normal packages`
    },
    {
      label: 'Savings Percentage',
      value: `${savingsAnalysis.value.savingsPercentage.toFixed(1)}%`,
      explanation: 'First-time bonus discount'
    },
    {
      label: 'Best Normal vs Bonus',
      value: `${formatValue(savingsAnalysis.value.bestNormal.costPerPull)} → ${formatValue(savingsAnalysis.value.bestBonus.costPerPull)}`,
      explanation: 'Cost comparison'
    }
  ]
})

// Monthly vs one-time analysis
const monthlyAnalysis = computed(() => {
  const subscriptions = props.processedPackages.subscription?.filter(pkg => pkg.pullsFromPackage > 0) || []
  const battlePasses = props.processedPackages.battle_pass?.filter(pkg => pkg.pullsFromPackage > 0) || []
  const oneTimePackages = [
    ...(props.processedPackages.normal?.filter(pkg => pkg.pullsFromPackage > 0) || []),
    ...(props.processedPackages.first_time_bonus?.filter(pkg => pkg.pullsFromPackage > 0) || [])
  ]

  if (subscriptions.length === 0 && battlePasses.length === 0) return null

  // Monthly recurring costs
  const monthlySubscriptionCost = subscriptions.reduce((sum, pkg) => sum + pkg.price, 0)
  const monthlySubscriptionPulls = subscriptions.reduce((sum, pkg) => sum + pkg.pullsFromPackage, 0)
  
  // Battle passes (assuming quarterly)
  const monthlyBattlePassCost = battlePasses.reduce((sum, pkg) => sum + pkg.price, 0) / 3
  const monthlyBattlePassPulls = battlePasses.reduce((sum, pkg) => sum + pkg.pullsFromPackage, 0) / 3

  const totalMonthlyCost = monthlySubscriptionCost + monthlyBattlePassCost
  const totalMonthlyPulls = monthlySubscriptionPulls + monthlyBattlePassPulls

  // Best one-time deal
  const bestOneTime = oneTimePackages.length > 0 
    ? oneTimePackages.reduce((best, pkg) => pkg.costPerPull < best.costPerPull ? pkg : best)
    : null

  const formatValue = (value: number, prefix = '$') => 
    Number.isFinite(value) ? `${prefix}${value.toFixed(2)}` : 'N/A'

  const breakEvenMonths = bestOneTime && totalMonthlyCost > 0 
    ? Math.ceil(bestOneTime.price / totalMonthlyCost)
    : null

  return {
    monthlyCost: formatValue(totalMonthlyCost),
    monthlyPulls: Math.round(totalMonthlyPulls).toString(),
    annualCost: formatValue(totalMonthlyCost * 12),
    bestOneTime: bestOneTime?.name || 'N/A',
    bestOneTimeCostPerPull: bestOneTime ? formatValue(bestOneTime.costPerPull) : 'N/A',
    breakEven: breakEvenMonths ? `${breakEvenMonths} months` : 'N/A'
  }
})
</script>