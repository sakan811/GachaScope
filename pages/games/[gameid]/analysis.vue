<template>
  <div v-if="!gameData" class="container mx-auto px-4 py-8">
    <UAlert color="red" variant="solid">
      <template #title>Game Not Found</template>
      <template #description>
        The game "{{ route.params.gameId }}" is not supported yet.
      </template>
    </UAlert>
  </div>

  <div v-else class="container mx-auto px-4 py-8 max-w-6xl">
    <!-- Back Button -->
    <UButton 
      variant="ghost" 
      icon="i-heroicons-arrow-left" 
      size="sm"
      @click="navigateTo('/')"
      class="mb-6"
    >
      <span class="hidden sm:inline">Back to Home</span>
      <span class="sm:hidden">Back</span>
    </UButton>

    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        {{ gameData.metadata.name }} Analysis
      </h1>
      <p class="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        Comprehensive {{ gameData.metadata.currency.name.toLowerCase() }} package analysis to optimize your spending.
      </p>
    </div>

    <!-- Combined Value Analysis -->
    <CombinedValueAnalysis 
      :game-data="gameData" 
      :processed-packages="processedPackages"
    />

    <!-- Package Overview - Show All Packages -->
    <UCard class="mb-8">
      <template #header>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <UIcon name="i-heroicons-cube" class="w-5 h-5" />In-App Purchase Overview
        </h2>
      </template>
      
      <div class="space-y-6">
        <div v-for="(packages, type) in filteredPackages" :key="type" class="space-y-4">
          <h3 class="text-lg font-medium flex items-center gap-2" :class="getPackageTypeStyle(type).title">
            <UIcon :name="getPackageTypeIcon(type)" class="w-4 h-4" />
            {{ getPackageTypeName(type) }}
          </h3>
          
          <!-- Mobile View: Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:hidden">
            <div v-for="pkg in packages" :key="pkg.id" 
                 :class="[getPackageTypeStyle(type).card, 'p-3 rounded-lg']">
              <div class="flex justify-between items-start mb-2">
                <div class="text-sm font-bold text-gray-900 dark:text-white">${{ pkg.price.toFixed(2) }}</div>
                <div class="text-right">
                  <div :class="pkg.pullsFromPackage === 0 ? 'text-red-500 font-medium' : 'text-gray-600 dark:text-gray-300'">
                    {{ pkg.pullsFromPackage }} {{ gameData.metadata.pull.name.toLowerCase() }}s
                  </div>
                </div>
              </div>
              <div class="text-xs text-gray-600 dark:text-gray-300 mb-1">
                {{ pkg.totalAmount.toLocaleString() }} {{ gameData.metadata.currency.shortName.toLowerCase() }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {{ pkg.leftoverAmount }} leftover
              </div>
              <div class="text-xs font-medium" :class="getPackageTypeStyle(type).title">
                ${{ pkg.costPerPull.toFixed(2) }} per {{ gameData.metadata.pull.name.toLowerCase() }}
              </div>
            </div>
          </div>

          <!-- Desktop View: Table -->
          <div class="hidden lg:block">
            <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div :class="[getPackageTypeStyle(type).card, 'px-4 py-3 border-b']">
                <div class="grid grid-cols-6 gap-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <div>In-App Purchase Name</div>
                  <div>Price</div>
                  <div>{{ gameData.metadata.currency.shortName }}</div>
                  <div>{{ gameData.metadata.pull.name }}s</div>
                  <div>Leftover</div>
                  <div>Cost per {{ gameData.metadata.pull.name }}</div>
                </div>
              </div>
              <div class="divide-y divide-gray-200 dark:divide-gray-700">
                <div v-for="pkg in packages" :key="pkg.id" 
                     class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div class="grid grid-cols-6 gap-4 items-center">
                    <div class="font-medium text-gray-900 dark:text-white text-sm">
                      {{ pkg.name }}
                    </div>
                    <div class="font-semibold text-gray-900 dark:text-white">
                      ${{ pkg.price.toFixed(2) }}
                    </div>
                    <div class="text-gray-600 dark:text-gray-300">
                      {{ pkg.totalAmount.toLocaleString() }}
                    </div>
                    <div :class="pkg.pullsFromPackage === 0 ? 'text-red-500 font-medium' : 'text-gray-900 dark:text-white'">
                      {{ pkg.pullsFromPackage }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ pkg.leftoverAmount }}
                    </div>
                    <div class="font-medium" :class="getPackageTypeStyle(type).title">
                      ${{ pkg.costPerPull.toFixed(2) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Cost vs Pulls Chart -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Cost vs {{ gameData.metadata.pull.name }}s
          </h3>
        </template>
        <div class="h-80 w-full">
          <Scatter :data="scatterChartData" :options="scatterChartOptions" />
        </div>
      </UCard>

      <!-- Efficiency Chart -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Package Efficiency
          </h3>
        </template>
        <div class="h-80 w-full">
          <Bar :data="barChartData" :options="barChartOptions" />
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
import { getGameById } from '~/utils/gameRegistry'
import { useGameAnalysis } from '~/composables/useGameAnalysis'
import CombinedValueAnalysis from '~/components/analysis/CombinedValueAnalysis.vue'
import { useChartConfig } from '~/composables/useChartConfig'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Scatter } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

const route = useRoute()
const { getProcessedPackages, generateChartsFromPackages } = useGameAnalysis()
const gameId = route.params.gameId
const gameData = ref(getGameById(gameId))

if (!gameData.value) {
  throw createError({ statusCode: 404, statusMessage: `Game "${gameId}" not found` })
}

useHead({
  title: `${gameData.value.metadata.name} Analysis`,
  meta: [{ 
    name: 'description', 
    content: `${gameData.value.metadata.currency.name} package analysis for ${gameData.value.metadata.name}` 
  }]
})

const processedPackages = getProcessedPackages(gameId)
const chartsData = processedPackages ? generateChartsFromPackages(processedPackages) : null

// Filter out empty package types
const filteredPackages = computed(() => {
  if (!processedPackages) return {}
  return Object.fromEntries(
    Object.entries(processedPackages).filter(([_, packages]) => packages && packages.length > 0)
  )
})

// Package type styling
const packageTypeStyles = {
  normal: { 
    card: 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800',
    title: 'text-red-600 dark:text-red-400'
  },
  first_time_bonus: { 
    card: 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800',
    title: 'text-green-600 dark:text-green-400'
  },
  subscription: { 
    card: 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800',
    title: 'text-blue-600 dark:text-blue-400'
  },
  battle_pass: { 
    card: 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800',
    title: 'text-purple-600 dark:text-purple-400'
  }
}

const packageTypeNames = {
  normal: 'Normal Oneiric Shard Purchase',
  first_time_bonus: 'First-Time Bonus Oneiric Shard Purchase',
  subscription: 'Subscription',
  battle_pass: 'Battle Pass'
}

const packageTypeIcons = {
  normal: 'i-heroicons-shopping-bag',
  first_time_bonus: 'i-heroicons-gift',
  subscription: 'i-heroicons-calendar',
  battle_pass: 'i-heroicons-trophy'
}

const getPackageTypeStyle = (type) => packageTypeStyles[type] || packageTypeStyles.normal
const getPackageTypeName = (type) => packageTypeNames[type] || type
const getPackageTypeIcon = (type) => packageTypeIcons[type] || 'i-heroicons-cube'

// Chart data and options
const { packageTypeColors, typeLabels, createChartOptions } = useChartConfig(gameData)

const scatterChartData = computed(() => {
  if (!chartsData) return { datasets: [] }
  
  const groupedData = chartsData.scatterData.reduce((acc, point) => {
    acc[point.type] = acc[point.type] || []
    acc[point.type].push({ x: point.x, y: point.y, packageName: point.packageName })
    return acc
  }, {})
  
  return {
    datasets: Object.entries(groupedData).map(([type, data]) => ({
      label: typeLabels[type] || type,
      data,
      backgroundColor: packageTypeColors[type]?.bg || 'rgba(156, 163, 175, 0.8)',
      borderColor: packageTypeColors[type]?.border || 'rgb(156, 163, 175)',
      pointRadius: 6
    }))
  }
})

const barChartData = computed(() => {
  if (!chartsData?.barData) return { labels: [], datasets: [] }
  
  const allPackageNames = new Set()
  Object.values(chartsData.barData).forEach(packages => {
    packages.forEach(pkg => allPackageNames.add(pkg.package))
  })
  
  const labels = Array.from(allPackageNames)
  const datasets = Object.entries(chartsData.barData).map(([type, packages]) => ({
    label: typeLabels[type] || type,
    data: labels.map(label => {
      const pkg = packages.find(p => p.package === label)
      return pkg ? parseFloat(pkg.costPerPull.toFixed(2)) : null
    }),
    backgroundColor: packageTypeColors[type]?.bg || 'rgba(156, 163, 175, 0.7)',
    borderColor: packageTypeColors[type]?.border || 'rgb(156, 163, 175)',
    borderWidth: 1
  }))
  
  return { labels, datasets }
})

const scatterChartOptions = computed(() => createChartOptions(true))
const barChartOptions = computed(() => createChartOptions(false))
</script>