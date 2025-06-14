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
      <div class="text-4xl sm:text-6xl mb-4">{{ gameData.metadata.icon }}</div>
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-2">
        <span class="block sm:inline">{{ gameData.metadata.name }}</span>
        <span class="block sm:inline sm:before:content-[' - ']">{{ gameData.metadata.currency.name }} Analysis</span>
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
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <!-- Normal Packages -->
        <div>
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Normal Packages</h3>
          <div class="space-y-2 sm:space-y-3">
            <div v-for="(pkg, index) in processedPackages.normal" :key="index" 
                 class="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg gap-2 sm:gap-0">
              <div class="flex justify-between sm:block">
                <div class="font-medium text-gray-900 dark:text-white text-sm sm:text-base">${{ pkg.price.toFixed(2) }}</div>
                <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{{ pkg.totalAmount }} {{ gameData.metadata.currency.shortName.toLowerCase() }}</div>
              </div>
              <div class="flex justify-between sm:text-right">
                <div :class="{'text-red-600 dark:text-red-400': pkg.pullsFromPackage === 0, 'font-medium': true, 'text-sm sm:text-base': true}">{{ pkg.pullsFromPackage }} {{ gameData.metadata.pull.name.toLowerCase() }}s</div>
                <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{{ pkg.leftoverAmount }} leftover</div>
              </div>
            </div>
          </div>
        </div>

        <!-- First-Time Bonus Packages -->
        <div>
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">First-Time Bonus Packages</h3>
          <div class="space-y-2 sm:space-y-3">
            <div v-for="(pkg, index) in processedPackages.first_time_bonus" :key="index" 
                 class="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg gap-2 sm:gap-0">
              <div class="flex justify-between sm:block">
                <div class="font-medium text-gray-900 dark:text-white text-sm sm:text-base">${{ pkg.price.toFixed(2) }}</div>
                <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{{ pkg.totalAmount }} {{ gameData.metadata.currency.shortName.toLowerCase() }}</div>
              </div>
              <div class="flex justify-between sm:text-right">
                <div :class="{'text-red-600 dark:text-red-400': pkg.pullsFromPackage === 0, 'text-green-600 dark:text-green-400 font-medium': pkg.pullsFromPackage !== 0, 'text-sm sm:text-base': true}">{{ pkg.pullsFromPackage }} {{ gameData.metadata.pull.name.toLowerCase() }}s</div>
                <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{{ pkg.leftoverAmount }} leftover</div>
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
        <div v-if="processedPackages.normal.some(pkg => pkg.pullsFromPackage === 0) || processedPackages.first_time_bonus.some(pkg => pkg.pullsFromPackage === 0)" 
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

// Computed chart data
const scatterChartData = computed(() => {
  if (!analysisResult || !processedPackages) return { datasets: [] }
  
  return {
    datasets: [
      {
        label: 'Normal Packages',
        data: processedPackages.normal?.map((pkg) => ({
          x: pkg.pullsFromPackage,
          y: parseFloat(pkg.price.toFixed(2)),
          packageName: pkg.name
        })) || [],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
        pointRadius: 6,
        pointHoverRadius: 10
      },
      {
        label: 'First-Time Bonus Packages',
        data: processedPackages.first_time_bonus?.map((pkg) => ({
          x: pkg.pullsFromPackage,
          y: parseFloat(pkg.price.toFixed(2)),
          packageName: pkg.name
        })) || [],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        pointRadius: 6,
        pointHoverRadius: 10
      }
    ]
  }
})

const scatterChartOptions = computed(() => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: false },
      legend: {
        display: true,
        position: 'top',
        labels: { 
          usePointStyle: true, 
          boxWidth: 8,
          font: { size: isMobile ? 10 : 12 }
        }
      },
      tooltip: {
        titleFont: { size: isMobile ? 11 : 13 },
        bodyFont: { size: isMobile ? 10 : 12 },
        callbacks: {
          title: (context) => context[0].raw.packageName,
          label: (context) => `$${context.parsed.y.toFixed(2)} for ${context.parsed.x} ${gameData.metadata.pull.name.toLowerCase()}s`
        }
      }
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: !isMobile,
          text: `${gameData.metadata.pull.name}s from Package`,
          font: { size: isMobile ? 10 : 12 }
        },
        ticks: { font: { size: isMobile ? 9 : 11 } },
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        title: {
          display: !isMobile,
          text: 'Package Cost ($)',
          font: { size: isMobile ? 10 : 12 }
        },
        ticks: { font: { size: isMobile ? 9 : 11 } },
        grid: { color: 'rgba(156, 163, 175, 0.1)' }
      }
    }
  }
})

const barChartData = computed(() => {
  if (!processedPackages) return { labels: [], datasets: [] }
  
  return {
    labels: processedPackages.normal?.filter(pkg => pkg.pullsFromPackage > 0).map(pkg => pkg.name) || [],
    datasets: [
      {
        label: `Normal Cost/${gameData.metadata.pull.name}`,
        data: processedPackages.normal?.filter(pkg => pkg.pullsFromPackage > 0).map(pkg => 
          pkg.costPerPull === Infinity ? 0 : parseFloat(pkg.costPerPull.toFixed(2))
        ) || [],
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1
      },
      {
        label: `First-Time Cost/${gameData.metadata.pull.name}`,
        data: processedPackages.first_time_bonus?.filter(pkg => pkg.pullsFromPackage > 0).map(pkg => 
          pkg.costPerPull === Infinity ? 0 : parseFloat(pkg.costPerPull.toFixed(2))
        ) || [],
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1
      }
    ]
  }
})

const barChartOptions = computed(() => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: false },
      legend: { 
        display: true, 
        position: 'top',
        labels: { font: { size: isMobile ? 10 : 12 } }
      }
    },
    scales: {
      x: {
        title: { 
          display: !isMobile, 
          text: 'Package',
          font: { size: isMobile ? 10 : 12 }
        },
        ticks: {
          font: { size: isMobile ? 8 : 10 },
          maxRotation: isMobile ? 45 : 0
        },
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        title: { 
          display: !isMobile, 
          text: `Cost per ${gameData.metadata.pull.name} ($)`,
          font: { size: isMobile ? 10 : 12 }
        },
        ticks: { font: { size: isMobile ? 9 : 11 } },
        grid: { color: 'rgba(156, 163, 175, 0.1)' }
      }
    }
  }
})

const insightStats = computed(() => {
  if (!analysisResult || !processedPackages) return []
  
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
      value: analysisResult.insights.bestPackageName, 
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
