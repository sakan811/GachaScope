<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">🌟 HSR Oneiric Shards Analysis</h1>
      <p class="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
        Comprehensive analysis of package-based spending for Honkai Star Rail oneiric shards. 
        See exactly how many pulls you get from different package combinations and their costs.
      </p>
    </div>

    <!-- Package Comparison -->
    <UCard class="mb-8">
      <template #header>
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <UIcon name="i-heroicons-cube" />Available Packages
        </h2>
      </template>
      <div class="grid lg:grid-cols-2 gap-6">
        <!-- Normal Packages -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Normal Packages</h3>
          <div class="space-y-3">
            <div v-for="(pkg, index) in normalPackages" :key="index" class="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div>
                <div class="font-medium text-gray-900 dark:text-white">${{ pkg.price.toFixed(2) }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-300">{{ pkg.totalShards }} shards</div>
              </div>
              <div class="text-right">
                <div class="font-medium text-red-600 dark:text-red-400">{{ pkg.pullsFromPackage }} pulls</div>
                <div class="text-sm text-gray-600 dark:text-gray-300">{{ pkg.leftoverShards }} leftover</div>
              </div>
            </div>
          </div>
        </div>

        <!-- First-Time Bonus Packages -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">First-Time Bonus Packages</h3>
          <div class="space-y-3">
            <div v-for="(pkg, index) in firstTimeBonusPackages" :key="index" class="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div>
                <div class="font-medium text-gray-900 dark:text-white">${{ pkg.price.toFixed(2) }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-300">{{ pkg.totalShards }} shards</div>
              </div>
              <div class="text-right">
                <div class="font-medium text-green-600 dark:text-green-400">{{ pkg.pullsFromPackage }} pulls</div>
                <div class="text-sm text-gray-600 dark:text-gray-300">{{ pkg.leftoverShards }} leftover</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Charts -->
    <div class="grid lg:grid-cols-2 gap-8 mb-8">
      <!-- Cost vs Pulls Chart -->
      <UCard>
        <template #header>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <UIcon name="i-heroicons-chart-bar" />Cost vs Pulls Obtained
          </h3>
        </template>
        <div class="h-80">
          <canvas ref="costVsPullsChart"></canvas>
        </div>
        <div class="mt-4 text-sm text-gray-600 dark:text-gray-300">
          Shows the relationship between spending and pulls you actually get from package purchases.
        </div>
      </UCard>

      <!-- Efficiency Comparison -->
      <UCard>
        <template #header>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <UIcon name="i-heroicons-chart-pie" />Package Efficiency
          </h3>
        </template>
        <div class="h-80">
          <canvas ref="efficiencyChart"></canvas>
        </div>
        <div class="mt-4 text-sm text-gray-600 dark:text-gray-300">
          Cost per pull for each individual package. Lower is better.
        </div>
      </UCard>
    </div>

    <!-- Savings Analysis -->
    <UCard class="mb-8">
      <template #header>
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <UIcon name="i-heroicons-currency-dollar" />First-Time Bonus Savings
        </h2>
      </template>
      <div class="h-64 mb-4">
        <canvas ref="savingsChart"></canvas>
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <UCard v-for="stat in savingsStats" :key="stat.label">
          <div class="text-center">
            <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">{{ stat.label }}</div>
            <div class="text-xl font-bold" :class="stat.color">{{ stat.value }}</div>
          </div>
        </UCard>
      </div>
    </UCard>
  </div>
</template>

<script setup>
import { normalPackages, firstTimeBonusPackages, normalScenarios, firstTimeScenarios, chartData } from '~/utils/shardsData'

useHead({
  title: 'HSR Analysis',
  meta: [{ name: 'description', content: 'Package-based analysis of Honkai Star Rail oneiric shards costs and spending efficiency' }]
})

// Reactive data
const selectedTab = ref(0)
const costVsPullsChart = ref(null)
const efficiencyChart = ref(null)
const savingsChart = ref(null)
const chartInstances = shallowRef({})

// Tab configuration
const tabItems = [
  { label: 'Normal Packages', value: 0 },
  { label: 'First-Time Bonus', value: 1 }
]

// Computed values
const displayedScenarios = computed(() => {
  return selectedTab.value === 0 ? normalScenarios : firstTimeScenarios
})

const savingsStats = computed(() => {
  const maxSavings = Math.max(...chartData.savingsData.map(d => d.savings))
  const maxSavingsScenario = chartData.savingsData.find(d => d.savings === maxSavings)
  const totalSavings = chartData.savingsData.reduce((sum, d) => sum + d.savings, 0)
  const avgSavings = totalSavings / chartData.savingsData.length
  
  return [
    { label: 'Max Savings', value: `$${maxSavings.toFixed(2)}`, color: 'text-green-600 dark:text-green-400' },
    { label: 'Best Scenario', value: `${maxSavingsScenario?.pulls || 0} pulls`, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Avg Savings', value: `$${avgSavings.toFixed(2)}`, color: 'text-purple-600 dark:text-purple-400' },
    { label: 'Scenarios', value: chartData.savingsData.length.toString(), color: 'text-gray-900 dark:text-white' }
  ]
})

// Chart creation functions
const createChart = async (canvasRef, config, type = 'line') => {
  if (process.server || !canvasRef.value) return
  
  const Chart = await import('chart.js')
  Chart.Chart.register(
    Chart.LineElement, Chart.PointElement, Chart.LineController, Chart.BarElement, Chart.BarController,
    Chart.CategoryScale, Chart.LinearScale, Chart.Title, Chart.Tooltip, Chart.Legend, Chart.Filler
  )
  
  return new Chart.Chart(canvasRef.value, {
    type,
    data: config.data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { 
        legend: { labels: { usePointStyle: true, boxWidth: 6 } },
        tooltip: config.tooltip || {}
      },
      scales: {
        x: { 
          grid: { display: false }, 
          ticks: { maxTicksLimit: 10 },
          title: { display: true, text: config.xAxisLabel || '' }
        },
        y: { 
          beginAtZero: true, 
          grid: { color: 'rgba(156, 163, 175, 0.1)' },
          title: { display: true, text: config.yAxisLabel || '' }
        }
      }
    }
  })
}

const createCharts = async () => {
  // Cost vs Pulls Chart
  if (costVsPullsChart.value && !chartInstances.value.costVsPulls) {
    chartInstances.value.costVsPulls = await createChart(costVsPullsChart, {
      data: {
        datasets: [
          {
            label: 'Normal Packages',
            data: chartData.normalData.map(d => ({ x: d.pulls, y: d.cost })),
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            pointRadius: 4,
            pointHoverRadius: 6
          },
          {
            label: 'First-Time Bonus',
            data: chartData.firstTimeData.map(d => ({ x: d.pulls, y: d.cost })),
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      },
      xAxisLabel: 'Pulls Obtained',
      yAxisLabel: 'Cost ($)',
      tooltip: {
        callbacks: {
          afterLabel: function(context) {
            const dataPoint = context.dataset.data[context.dataIndex]
            const scenario = context.datasetIndex === 0 ? 
              chartData.normalData[context.dataIndex]?.scenario : 
              chartData.firstTimeData[context.dataIndex]?.scenario
            return scenario ? `Scenario: ${scenario}` : ''
          }
        }
      }
    }, 'scatter')
  }

  // Efficiency Chart
  if (efficiencyChart.value && !chartInstances.value.efficiency) {
    chartInstances.value.efficiency = await createChart(efficiencyChart, {
      data: {
        labels: normalPackages.map((_, i) => `Package ${i + 1}`),
        datasets: [
          {
            label: 'Normal Cost/Pull',
            data: normalPackages.map(pkg => pkg.costPerPull === Infinity ? 0 : pkg.costPerPull),
            backgroundColor: 'rgba(239, 68, 68, 0.7)',
            borderColor: 'rgb(239, 68, 68)',
            borderWidth: 1
          },
          {
            label: 'First-Time Cost/Pull',
            data: firstTimeBonusPackages.map(pkg => pkg.costPerPull === Infinity ? 0 : pkg.costPerPull),
            backgroundColor: 'rgba(34, 197, 94, 0.7)',
            borderColor: 'rgb(34, 197, 94)',
            borderWidth: 1
          }
        ]
      },
      xAxisLabel: 'Package',
      yAxisLabel: 'Cost per Pull ($)'
    }, 'bar')
  }

  // Savings Chart
  if (savingsChart.value && !chartInstances.value.savings) {
    chartInstances.value.savings = await createChart(savingsChart, {
      data: {
        labels: chartData.savingsData.map(d => `${d.pulls} pulls`),
        datasets: [{
          label: 'Savings ($)',
          data: chartData.savingsData.map(d => d.savings),
          borderColor: 'rgb(168, 85, 247)',
          backgroundColor: 'rgba(168, 85, 247, 0.1)',
          fill: true,
          tension: 0.2,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      xAxisLabel: 'Pull Count',
      yAxisLabel: 'Savings ($)'
    })
  }
}

const destroyCharts = () => {
  Object.values(chartInstances.value).forEach(chart => chart?.destroy())
  chartInstances.value = {}
}

onMounted(() => nextTick(createCharts))
onUnmounted(destroyCharts)
</script>