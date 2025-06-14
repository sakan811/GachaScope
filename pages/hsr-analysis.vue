<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">🌟 HSR Oneiric Shards Analysis</h1>
      <p class="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
        Comprehensive analysis of spending efficiency for Honkai Star Rail oneiric shards purchases, comparing normal packages versus first-time bonus packages.
      </p>
    </div>

    <!-- Interactive Calculator -->
    <UCard class="mb-8">
      <template #header>
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <UIcon name="i-heroicons-calculator" />Cost Calculator
        </h2>
      </template>
      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <UFormGroup label="Target Pulls" class="mb-4">
            <URange v-model="targetPulls" :min="1" :max="180" :step="1" />
            <div class="text-center mt-2 text-sm text-gray-600 dark:text-gray-300">{{ targetPulls }} pulls</div>
          </UFormGroup>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <UCard v-for="(cost, type) in costs" :key="type">
            <div class="text-center">
              <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">{{ cost.label }}</div>
              <div class="text-2xl font-bold" :class="cost.color">${{ cost.value.toFixed(2) }}</div>
            </div>
          </UCard>
        </div>
      </div>
      <UAlert v-if="savingsAmount > 0" color="green" variant="soft" class="mt-4">
        <template #title>You save ${{ savingsAmount.toFixed(2) }} ({{ savingsPercent.toFixed(1) }}%) with first-time bonus!</template>
      </UAlert>
    </UCard>

    <!-- Cost Comparison Chart -->
    <UCard class="mb-8">
      <template #header>
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <UIcon name="i-heroicons-chart-bar" />Cost Comparison: Normal vs First-Time Bonus
        </h2>
      </template>
      <div class="h-96">
        <canvas ref="costComparisonChart"></canvas>
      </div>
    </UCard>

    <!-- Two Column Charts -->
    <div class="grid lg:grid-cols-2 gap-8 mb-8">
      <!-- Savings Chart -->
      <UCard>
        <template #header>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <UIcon name="i-heroicons-currency-dollar" />Savings from First-Time Bonus
          </h3>
        </template>
        <div class="h-64">
          <canvas ref="savingsChart"></canvas>
        </div>
        <UAlert color="green" variant="soft" class="mt-4">
          <template #title>Maximum Savings: ${{ maxSavings.toFixed(2) }} at {{ maxSavingsIndex + 1 }} pulls</template>
        </UAlert>
      </UCard>

      <!-- Cost per Pull Chart -->
      <UCard>
        <template #header>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <UIcon name="i-heroicons-chart-pie" />Cost per Pull
          </h3>
        </template>
        <div class="h-64">
          <canvas ref="costPerPullChart"></canvas>
        </div>
        <div class="mt-4 grid grid-cols-2 gap-2">
          <UCard>
            <div class="text-center">
              <div class="text-sm text-gray-600 dark:text-gray-300">Normal (180 pulls)</div>
              <div class="text-lg font-bold text-red-600 dark:text-red-400">${{ (stats.normal180 / 180).toFixed(2) }}/pull</div>
            </div>
          </UCard>
          <UCard>
            <div class="text-center">
              <div class="text-sm text-gray-600 dark:text-gray-300">First-Time (180 pulls)</div>
              <div class="text-lg font-bold text-green-600 dark:text-green-400">${{ (stats.firstTime180 / 180).toFixed(2) }}/pull</div>
            </div>
          </UCard>
        </div>
      </UCard>
    </div>

    <!-- Package Efficiency Analysis -->
    <UCard class="mb-8">
      <template #header>
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <UIcon name="i-heroicons-trophy" />Package Efficiency Analysis
        </h2>
      </template>
      <div class="grid md:grid-cols-2 gap-6">
        <div v-for="pkg in packageAnalysis" :key="pkg.title">
          <h4 class="font-semibold text-gray-900 dark:text-white mb-3 text-lg">{{ pkg.title }}</h4>
          <div class="space-y-2">
            <UAlert v-for="alert in pkg.alerts" :key="alert.title" :color="alert.color" variant="soft">
              <template #title>{{ alert.title }}</template>
            </UAlert>
          </div>
          <ul class="mt-4 space-y-2 text-gray-600 dark:text-gray-300">
            <li v-for="item in pkg.items" :key="item.text" class="flex items-center gap-2">
              <UIcon :name="item.icon" :class="item.color" />{{ item.text }}
            </li>
          </ul>
        </div>
      </div>
    </UCard>

    <!-- Summary Statistics -->
    <UCard>
      <template #header>
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <UIcon name="i-heroicons-clipboard-document-list" />Summary Statistics
        </h2>
      </template>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <UCard v-for="stat in summaryStats" :key="stat.label">
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
import { NORMAL_COSTS, FIRST_TIME_COSTS, normalPackages } from '~/utils/shardsData'

useHead({
  title: 'HSR Analysis',
  meta: [{ name: 'description', content: 'Detailed analysis of Honkai Star Rail oneiric shards costs and package efficiency' }]
})

// Reactive data
const targetPulls = ref(90)
const costComparisonChart = ref(null)
const savingsChart = ref(null)
const costPerPullChart = ref(null)
const chartInstances = shallowRef({})

// Sample data for cleaner charts
const sampleIndices = Array.from({length: 37}, (_, i) => i * 5 - (i > 0 ? 1 : 0)).filter(i => i >= 0 && i < 180)
const pulls = sampleIndices.map(i => i + 1)
const sampledData = {
  normal: sampleIndices.map(i => NORMAL_COSTS[i]),
  firstTime: sampleIndices.map(i => FIRST_TIME_COSTS[i])
}

// Computed values
const costs = computed(() => ({
  normal: { label: 'Normal Cost', value: NORMAL_COSTS[targetPulls.value - 1], color: 'text-red-600 dark:text-red-400' },
  firstTime: { label: 'First-Time Cost', value: FIRST_TIME_COSTS[targetPulls.value - 1], color: 'text-green-600 dark:text-green-400' }
}))

const savingsAmount = computed(() => costs.value.normal.value - costs.value.firstTime.value)
const savingsPercent = computed(() => (savingsAmount.value / costs.value.normal.value) * 100)

const savings = computed(() => sampledData.normal.map((normal, i) => normal - sampledData.firstTime[i]))
const allSavings = NORMAL_COSTS.map((normal, i) => normal - FIRST_TIME_COSTS[i])
const maxSavings = computed(() => Math.max(...allSavings))
const maxSavingsIndex = computed(() => allSavings.indexOf(maxSavings.value))

const costPerPull = computed(() => ({
  normal: sampledData.normal.map((cost, i) => cost / pulls[i]),
  firstTime: sampledData.firstTime.map((cost, i) => cost / pulls[i])
}))

const stats = computed(() => ({
  normal180: NORMAL_COSTS[179],
  firstTime180: FIRST_TIME_COSTS[179],
  totalSavings: NORMAL_COSTS[179] - FIRST_TIME_COSTS[179],
  totalSavingsPercentage: ((NORMAL_COSTS[179] - FIRST_TIME_COSTS[179]) / NORMAL_COSTS[179]) * 100,
  bestEfficiency: Math.max(...normalPackages.map(pkg => pkg.shardsPerDollar)),
  worstEfficiency: Math.min(...normalPackages.map(pkg => pkg.shardsPerDollar))
}))

// Chart configurations
const chartConfigs = {
  costComparison: {
    datasets: [
      { label: 'Normal Packages', data: sampledData.normal, color: 'rgb(239, 68, 68)' },
      { label: 'First-Time Bonus', data: sampledData.firstTime, color: 'rgb(34, 197, 94)' }
    ]
  },
  savings: {
    datasets: [{ label: 'Savings ($)', data: savings, color: 'rgb(168, 85, 247)', fill: true }]
  },
  costPerPull: {
    datasets: [
      { label: 'Normal ($/pull)', data: costPerPull.value.normal, color: 'rgb(239, 68, 68)' },
      { label: 'First-Time ($/pull)', data: costPerPull.value.firstTime, color: 'rgb(34, 197, 94)' }
    ]
  }
}

// Template data
const packageAnalysis = [
  {
    title: 'Normal Packages:',
    alerts: [
      { title: `Best: ${stats.value.bestEfficiency.toFixed(2)} shards per dollar`, color: 'red' },
      { title: `Worst: ${stats.value.worstEfficiency.toFixed(2)} shards per dollar`, color: 'orange' }
    ],
    items: [
      { text: 'Expensive for regular purchases', icon: 'i-heroicons-x-mark', color: 'text-red-500' },
      { text: 'Lower efficiency ratios', icon: 'i-heroicons-x-mark', color: 'text-red-500' },
      { text: 'Higher cost per pull', icon: 'i-heroicons-x-mark', color: 'text-red-500' }
    ]
  },
  {
    title: 'First-Time Bonus:',
    alerts: [
      { title: 'Massive savings on all packages', color: 'green' },
      { title: 'Must-buy for optimal spending', color: 'green' }
    ],
    items: [
      { text: 'Massive savings on all packages', icon: 'i-heroicons-check', color: 'text-green-500' },
      { text: 'Even small packages become very efficient', icon: 'i-heroicons-check', color: 'text-green-500' },
      { text: 'Must-buy for optimal spending', icon: 'i-heroicons-check', color: 'text-green-500' }
    ]
  }
]

const summaryStats = computed(() => [
  { label: '180 Pulls (Normal)', value: `$${stats.value.normal180.toFixed(2)}`, color: 'text-gray-900 dark:text-white' },
  { label: '180 Pulls (First-Time)', value: `$${stats.value.firstTime180.toFixed(2)}`, color: 'text-green-600 dark:text-green-400' },
  { label: 'Total Savings', value: `$${stats.value.totalSavings.toFixed(2)}`, color: 'text-blue-600 dark:text-blue-400' },
  { label: 'Savings %', value: `${stats.value.totalSavingsPercentage.toFixed(1)}%`, color: 'text-purple-600 dark:text-purple-400' }
])

// Chart creation
const createChart = async (canvasRef, config, type = 'line') => {
  if (process.server || !canvasRef.value) return
  
  const Chart = await import('chart.js')
  Chart.Chart.register(Chart.LineElement, Chart.PointElement, Chart.LineController, Chart.CategoryScale, Chart.LinearScale, Chart.Title, Chart.Tooltip, Chart.Legend, Chart.Filler)
  
  return new Chart.Chart(canvasRef.value, {
    type,
    data: {
      labels: pulls,
      datasets: config.datasets.map(ds => ({
        ...ds,
        borderColor: ds.color,
        backgroundColor: ds.color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
        tension: 0.2,
        pointRadius: 3,
        pointHoverRadius: 5,
        fill: ds.fill || false
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { usePointStyle: true, boxWidth: 6 } } },
      elements: { point: { radius: 3, hoverRadius: 5 }, line: { tension: 0.2 } },
      scales: {
        x: { grid: { display: false }, ticks: { maxTicksLimit: 10 } },
        y: { beginAtZero: true, grid: { color: 'rgba(156, 163, 175, 0.1)' } }
      }
    }
  })
}

const createCharts = async () => {
  const chartConfigurations = {
    costComparisonChart: { ref: costComparisonChart, config: chartConfigs.costComparison },
    savingsChart: { ref: savingsChart, config: chartConfigs.savings },
    costPerPullChart: { ref: costPerPullChart, config: chartConfigs.costPerPull }
  }
  
  for (const [key, { ref: chartRef, config }] of Object.entries(chartConfigurations)) {
    if (chartRef.value && !chartInstances.value[key]) {
      chartInstances.value[key] = await createChart(chartRef, config)
    }
  }
}

const destroyCharts = () => {
  Object.values(chartInstances.value).forEach(chart => chart?.destroy())
  chartInstances.value = {}
}

onMounted(() => nextTick(createCharts))
onUnmounted(destroyCharts)
</script>