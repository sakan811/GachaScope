<template>
  <UCard class="mb-6 sm:mb-8">
    <template #header>
      <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <UIcon name="i-heroicons-currency-dollar" class="w-5 h-5 sm:w-6 sm:h-6" />
        Combined Value Analysis
      </h2>
    </template>

    <!-- Overall Best Value Card (only one card now) -->
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
        Package Type Comparison
      </h3>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <UCard v-for="typeStats in packageTypeStats" :key="typeStats.type" :class="typeStats.bgClass">
          <div class="text-center p-2 sm:p-3">
            <div class="text-sm font-medium mb-2" :class="typeStats.titleColor">{{ typeStats.displayName }}</div>
            <div class="space-y-1">
              <div class="text-xs text-gray-600 dark:text-gray-300">
                Best Package
              </div>
              <div class="text-sm font-bold" :class="typeStats.valueColor">
                {{ typeStats.bestPackageName }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ typeStats.bestCostPerPull }}
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Savings Analysis - Normal vs First-Time Bonus Comparison -->
    <div v-if="tierSavingsAnalysis?.length" class="pt-6 border-t border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <UIcon name="i-heroicons-calculator" class="w-4 h-4" />
        Savings Analysis - Normal vs First-Time Bonus
      </h3>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <UCard v-for="(tier, index) in tierSavingsAnalysis" :key="index" class="bg-green-50 dark:bg-green-900/20">
          <div class="text-center p-2 sm:p-3">
            <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1 sm:mb-2">{{ tier.tierName }}</div>
            <div class="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">{{ tier.savings }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ tier.explanation }}
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-300 mt-2">
              {{ tier.comparison }}
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
    explanation: `Best cost per ${props.gameData.metadata.pull.name.toLowerCase()}`
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
      
      stats.push({
        type,
        displayName: config.displayName,
        bgClass: config.bgClass,
        titleColor: config.titleColor,
        valueColor: config.valueColor,
        bestPackageName: bestPackage.name,
        bestCostPerPull: `$${bestPackage.costPerPull.toFixed(2)}`
      })
    }
  }
  
  return stats.sort((a, b) => {
    const aValue = parseFloat(a.bestCostPerPull.replace('$', ''))
    const bValue = parseFloat(b.bestCostPerPull.replace('$', ''))
    return aValue - bValue
  })
})

// Tier-based savings analysis - comparing normal vs first-time bonus for each tier
const tierSavingsAnalysis = computed(() => {
  const normalPackages = props.processedPackages.normal?.filter(pkg => pkg.pullsFromPackage > 0) || []
  const bonusPackages = props.processedPackages.first_time_bonus?.filter(pkg => pkg.pullsFromPackage > 0) || []

  if (normalPackages.length === 0 || bonusPackages.length === 0) return []

  // Sort packages by price to match tiers
  const sortedNormal = [...normalPackages].sort((a, b) => a.price - b.price)
  const sortedBonus = [...bonusPackages].sort((a, b) => a.price - b.price)

  const tierComparisons = []
  const maxTiers = Math.min(sortedNormal.length, sortedBonus.length)

  for (let i = 0; i < maxTiers; i++) {
    const normalPkg = sortedNormal[i]
    const bonusPkg = sortedBonus[i]
    
    const savingsPerPull = normalPkg.costPerPull - bonusPkg.costPerPull
    const savingsPercentage = (savingsPerPull / normalPkg.costPerPull) * 100
    
    if (savingsPerPull > 0) {
      tierComparisons.push({
        tierName: `Tier ${i + 1} ($${normalPkg.price.toFixed(2)})`,
        savings: `$${savingsPerPull.toFixed(2)}`,
        explanation: `${savingsPercentage.toFixed(1)}% savings per ${props.gameData.metadata.pull.name.toLowerCase()}`,
        comparison: `${normalPkg.costPerPull.toFixed(2)} → ${bonusPkg.costPerPull.toFixed(2)}`
      })
    }
  }

  return tierComparisons
})

// Monthly vs one-time analysis (unchanged)
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