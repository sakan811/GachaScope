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

    <!-- Package Overview -->
    <UCard class="mb-8">
      <template #header>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <UIcon name="i-heroicons-cube" class="w-5 h-5" />Package Overview
        </h2>
      </template>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Package Type Cards -->
        <div v-for="(packages, type) in filteredPackages" :key="type" 
             :class="getPackageTypeStyle(type).card">
          <div class="p-4">
            <h3 class="font-medium mb-3" :class="getPackageTypeStyle(type).title">
              {{ getPackageTypeName(type) }}
            </h3>
            <div class="space-y-2">
              <div v-for="pkg in packages.slice(0, 2)" :key="pkg.id" 
                   class="text-sm border rounded p-2 bg-white dark:bg-gray-800">
                <div class="flex justify-between items-center">
                  <span class="font-medium">${{ pkg.price.toFixed(2) }}</span>
                  <span :class="pkg.pullsFromPackage === 0 ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'">
                    {{ pkg.pullsFromPackage }} {{ gameData.metadata.pull.name.toLowerCase() }}s
                  </span>
                </div>
              </div>
              <div v-if="packages.length > 2" class="text-xs text-gray-500 text-center">
                +{{ packages.length - 2 }} more
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
  normal: 'Normal',
  first_time_bonus: 'First-Time Bonus',
  subscription: 'Subscriptions',
  battle_pass: 'Battle Pass'
}

const getPackageTypeStyle = (type) => packageTypeStyles[type] || packageTypeStyles.normal
const getPackageTypeName = (type) => packageTypeNames[type] || type

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