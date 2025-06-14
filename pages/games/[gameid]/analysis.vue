<template>
  <div v-if="!gameData" class="container mx-auto px-4 py-8">
    <UAlert color="red" variant="solid">
      <template #title>Game Not Found</template>
      <template #description>
        The game "{{ route.params.gameId }}" is not supported yet.
      </template>
    </UAlert>
  </div>

  <div v-else-if="!analysisResult" class="container mx-auto px-4 py-8">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600 dark:text-gray-400">Loading analysis...</p>
    </div>
  </div>

  <div v-else class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Back Button -->
    <div class="mb-4 sm:mb-6">
      <UButton 
        variant="ghost" 
        icon="i-heroicons-arrow-left" 
        size="sm"
        @click="navigateTo('/')"
      >
        <span class="hidden sm:inline">Back to Home</span>
        <span class="sm:hidden">Back</span>
      </UButton>
    </div>

    <!-- Header -->
    <div class="text-center mb-6 sm:mb-8">
      <div class="text-4xl sm:text-6xl mb-4">🌟</div>
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-2">
        <span class="block sm:inline">{{ gameData.metadata.name }}</span>
        <span class="block sm:inline sm:before:content-[' - ']">{{ " " }}</span>
        <span class="block sm:inline">{{ gameData.metadata.currency.name }} Analysis</span>
      </h1>
      <p class="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
        Comprehensive analysis of {{ gameData.metadata.currency.name.toLowerCase() }} packages for {{ gameData.metadata.name }}. 
        See exactly how many {{ gameData.metadata.pull.name.toLowerCase() }}s you get from different package combinations.
      </p>
    </div>

    <!-- Package Comparison -->
    <UCard class="mb-6 sm:mb-8">
      <template #header>
        <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <UIcon name="i-heroicons-cube" class="w-5 h-5 sm:w-6 sm:h-6" />Available Packages
        </h2>
      </template>
      
      <!-- Mobile View: Stacked Cards -->
      <div class="block lg:hidden space-y-6">
        <!-- Normal Packages Mobile -->
        <div v-if="processedPackages.normal">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Normal Packages</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div v-for="(pkg, index) in processedPackages.normal" :key="index" 
                 class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div class="flex justify-between items-start mb-2">
                <div class="text-lg font-bold text-gray-900 dark:text-white">${{ pkg.price.toFixed(2) }}</div>
                <div class="text-right">
                  <div :class="pkg.pullsFromPackage === 0 ? 'text-red-500 font-medium' : 'text-gray-900 dark:text-white font-semibold'">
                    {{ pkg.pullsFromPackage }} {{ gameData.metadata.pull.name.toLowerCase() }}s
                  </div>
                </div>
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">
                {{ pkg.totalAmount }} {{ gameData.metadata.currency.shortName.toLowerCase() }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ pkg.leftoverAmount }} leftover
              </div>
            </div>
          </div>
        </div>

        <!-- First-Time Bonus Packages Mobile -->
        <div v-if="processedPackages.first_time_bonus">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">First-Time Bonus Packages</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div v-for="(pkg, index) in processedPackages.first_time_bonus" :key="index" 
                 class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div class="flex justify-between items-start mb-2">
                <div class="text-lg font-bold text-gray-900 dark:text-white">${{ pkg.price.toFixed(2) }}</div>
                <div class="text-right">
                  <div :class="pkg.pullsFromPackage === 0 ? 'text-red-500 font-medium' : 'text-green-600 dark:text-green-400 font-semibold'">
                    {{ pkg.pullsFromPackage }} {{ gameData.metadata.pull.name.toLowerCase() }}s
                  </div>
                </div>
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">
                {{ pkg.totalAmount }} {{ gameData.metadata.currency.shortName.toLowerCase() }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ pkg.leftoverAmount }} leftover
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop View: Table Layout -->
      <div class="hidden lg:block">
        <div class="grid grid-cols-2 gap-8">
          <!-- Normal Packages Desktop -->
          <div v-if="processedPackages.normal">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Normal Packages</h3>
            <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div class="bg-red-50 dark:bg-red-900/20 px-4 py-3 border-b border-red-200 dark:border-red-800">
                <div class="grid grid-cols-4 gap-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <div>Price</div>
                  <div>{{ gameData.metadata.currency.shortName }}</div>
                  <div>{{ gameData.metadata.pull.name }}s</div>
                  <div>Leftover</div>
                </div>
              </div>
              <div class="divide-y divide-gray-200 dark:divide-gray-700">
                <div v-for="(pkg, index) in processedPackages.normal" :key="index" 
                     class="px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div class="grid grid-cols-4 gap-4 items-center">
                    <div class="font-semibold text-gray-900 dark:text-white">
                      ${{ pkg.price.toFixed(2) }}
                    </div>
                    <div class="text-gray-600 dark:text-gray-300">
                      {{ pkg.totalAmount.toLocaleString() }}
                    </div>
                    <div :class="pkg.pullsFromPackage === 0 ? 'text-red-500 font-medium' : 'text-gray-900 dark:text-white font-medium'">
                      {{ pkg.pullsFromPackage }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ pkg.leftoverAmount }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- First-Time Bonus Packages Desktop -->
          <div v-if="processedPackages.first_time_bonus">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">First-Time Bonus Packages</h3>
            <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div class="bg-green-50 dark:bg-green-900/20 px-4 py-3 border-b border-green-200 dark:border-green-800">
                <div class="grid grid-cols-4 gap-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <div>Price</div>
                  <div>{{ gameData.metadata.currency.shortName }}</div>
                  <div>{{ gameData.metadata.pull.name }}s</div>
                  <div>Leftover</div>
                </div>
              </div>
              <div class="divide-y divide-gray-200 dark:divide-gray-700">
                <div v-for="(pkg, index) in processedPackages.first_time_bonus" :key="index" 
                     class="px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div class="grid grid-cols-4 gap-4 items-center">
                    <div class="font-semibold text-gray-900 dark:text-white">
                      ${{ pkg.price.toFixed(2) }}
                    </div>
                    <div class="text-gray-600 dark:text-gray-300">
                      {{ pkg.totalAmount.toLocaleString() }}
                    </div>
                    <div :class="pkg.pullsFromPackage === 0 ? 'text-red-500 font-medium' : 'text-green-600 dark:text-green-400 font-medium'">
                      {{ pkg.pullsFromPackage }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ pkg.leftoverAmount }}
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
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
      <!-- Cost vs Pulls Chart -->
      <UCard>
        <template #header>
          <h3 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <UIcon name="i-heroicons-chart-bar" class="w-4 h-4 sm:w-5 sm:h-5" />Cost vs {{ gameData.metadata.pull.name }}s Obtained
          </h3>
        </template>
        <div class="h-64 sm:h-80 w-full">
          <Scatter 
            :data="scatterChartData" 
            :options="scatterChartOptions" 
            :height="256"
          />
        </div>
        <div class="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
          Shows cost vs {{ gameData.metadata.pull.name.toLowerCase() }}s for each package. Green dots represent better value from first-time bonuses.
        </div>
      </UCard>

      <!-- Efficiency Comparison -->
      <UCard>
        <template #header>
          <h3 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <UIcon name="i-heroicons-chart-pie" class="w-4 h-4 sm:w-5 sm:h-5" />Package Efficiency
          </h3>
        </template>
        <div class="h-64 sm:h-80 w-full">
          <Bar 
            :data="barChartData" 
            :options="barChartOptions" 
            :height="256"
          />
        </div>
        <div class="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
          Cost per {{ gameData.metadata.pull.name.toLowerCase() }} for each package. Lower is better.
        </div>
        <div v-if="hasZeroPullPackages" 
             class="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 italic">
          Note: Packages with 0 pulls are not included in efficiency calculations
        </div>
      </UCard>
    </div>

    <!-- Insights Section -->
    <UCard class="mb-6 sm:mb-8">
      <template #header>
        <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <UIcon name="i-heroicons-currency-dollar" class="w-5 h-5 sm:w-6 sm:h-6" />Summary
        </h2>
      </template>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <UCard v-for="stat in insightStats" :key="stat.label" class="bg-gray-50 dark:bg-gray-800/50">
          <div class="text-center p-2 sm:p-3">
            <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1 sm:mb-2">{{ stat.label }}</div>
            <div class="text-lg sm:text-xl font-bold break-words" :class="stat.color">{{ stat.value }}</div>
          </div>
        </UCard>
      </div>
    </UCard>
  </div>
</template>

<script setup>
import { getGameById } from '~/utils/gameRegistry'
import { useGameAnalysis } from '~/composables/useGameAnalysis'
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

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const route = useRoute()
const { analyzeGame, getProcessedPackages } = useGameAnalysis()
const gameId = route.params.gameId

// Get game data
const gameData = getGameById(gameId)

// Validate game exists
if (!gameData) {
  throw createError({
    statusCode: 404,
    statusMessage: `Game "${gameId}" not found`
  })
}

// Set page meta
useHead({
  title: `${gameData.metadata.name} Analysis`,
  meta: [
    { name: 'description', content: `Comprehensive ${gameData.metadata.currency.name} package analysis for ${gameData.metadata.name}` }
  ]
})

// Get analysis data
const analysisResult = analyzeGame(gameId)
const processedPackages = getProcessedPackages(gameId)

// Computed properties
const hasZeroPullPackages = computed(() => {
  if (!processedPackages) return false
  return Object.values(processedPackages).some(packages => 
    packages?.some(pkg => pkg.pullsFromPackage === 0)
  )
})

const scatterChartData = computed(() => {
  if (!processedPackages) return { datasets: [] }
  
  const datasets = []
  
  if (processedPackages.normal?.length) {
    datasets.push({
      label: 'Normal Packages',
      data: processedPackages.normal.map(pkg => ({
        x: pkg.pullsFromPackage,
        y: parseFloat(pkg.price.toFixed(2)),
        packageName: pkg.name
      })),
      backgroundColor: 'rgba(239, 68, 68, 0.8)',
      borderColor: 'rgb(239, 68, 68)',
      pointRadius: 6,
      pointHoverRadius: 10
    })
  }
  
  if (processedPackages.first_time_bonus?.length) {
    datasets.push({
      label: 'First-Time Bonus',
      data: processedPackages.first_time_bonus.map(pkg => ({
        x: pkg.pullsFromPackage,
        y: parseFloat(pkg.price.toFixed(2)),
        packageName: pkg.name
      })),
      backgroundColor: 'rgba(34, 197, 94, 0.8)',
      borderColor: 'rgb(34, 197, 94)',
      pointRadius: 6,
      pointHoverRadius: 10
    })
  }
  
  return { datasets }
})

const barChartData = computed(() => {
  if (!processedPackages) return { labels: [], datasets: [] }
  
  const validNormal = processedPackages.normal?.filter(pkg => pkg.pullsFromPackage > 0) || []
  const validBonus = processedPackages.first_time_bonus?.filter(pkg => pkg.pullsFromPackage > 0) || []
  
  const allLabels = [...validNormal, ...validBonus].map(pkg => pkg.name)
  
  return {
    labels: allLabels,
    datasets: [
      {
        label: `Normal Cost/${gameData.metadata.pull.name}`,
        data: allLabels.map(label => {
          const pkg = validNormal.find(p => p.name === label)
          return pkg ? parseFloat(pkg.costPerPull.toFixed(2)) : null
        }),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1
      },
      {
        label: `First-Time Cost/${gameData.metadata.pull.name}`,
        data: allLabels.map(label => {
          const pkg = validBonus.find(p => p.name === label)
          return pkg ? parseFloat(pkg.costPerPull.toFixed(2)) : null
        }),
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1
      }
    ]
  }
})

const createChartOptions = (isScatter = false) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
  
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: false },
      legend: { 
        display: true, 
        position: 'top',
        labels: { 
          font: { size: isMobile ? 10 : 12 },
          ...(isScatter && { usePointStyle: true, boxWidth: 8 })
        }
      }
    },
    scales: {
      x: {
        ...(isScatter && { type: 'linear', position: 'bottom' }),
        title: { 
          display: !isMobile, 
          text: isScatter ? `${gameData.metadata.pull.name}s from Package` : 'Package',
          font: { size: isMobile ? 10 : 12 }
        },
        ticks: { 
          font: { size: isMobile ? (isScatter ? 9 : 8) : (isScatter ? 11 : 10) },
          ...(!isScatter && { maxRotation: isMobile ? 45 : 0 })
        },
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        title: { 
          display: !isMobile, 
          text: isScatter ? 'Package Cost ($)' : `Cost per ${gameData.metadata.pull.name} ($)`,
          font: { size: isMobile ? 10 : 12 }
        },
        ticks: { font: { size: isMobile ? 9 : 11 } },
        grid: { color: 'rgba(156, 163, 175, 0.1)' }
      }
    }
  }
  
  if (isScatter) {
    baseOptions.plugins.tooltip = {
      titleFont: { size: isMobile ? 11 : 13 },
      bodyFont: { size: isMobile ? 10 : 12 },
      callbacks: {
        title: (context) => context[0].raw.packageName,
        label: (context) => `$${context.parsed.y.toFixed(2)} for ${context.parsed.x} ${gameData.metadata.pull.name.toLowerCase()}s`
      }
    }
  }
  
  return baseOptions
}

const scatterChartOptions = computed(() => createChartOptions(true))
const barChartOptions = computed(() => createChartOptions(false))

const insightStats = computed(() => {
  if (!analysisResult) return []
  
  const formatValue = (value, prefix = '$') => 
    Number.isFinite(value) ? `${prefix}${value.toFixed(2)}` : 'N/A'

  return [
    { 
      label: 'Max Savings', 
      value: formatValue(analysisResult.insights.maxSavings), 
      color: 'text-green-600 dark:text-green-400' 
    },
    { 
      label: 'Best Package', 
      value: analysisResult.insights.bestPackageName || 'N/A', 
      color: 'text-blue-600 dark:text-blue-400' 
    },
    { 
      label: 'Avg Savings', 
      value: formatValue(analysisResult.insights.avgSavings), 
      color: 'text-purple-600 dark:text-purple-400' 
    },
    { 
      label: `Best Cost/${gameData.metadata.pull.name}`, 
      value: formatValue(analysisResult.insights.bestScenario?.costPerPull), 
      color: 'text-gray-900 dark:text-white' 
    }
  ]
})
</script>
