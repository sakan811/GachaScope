<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        🌟 HSR Oneiric Shards Analysis
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
        Comprehensive analysis of spending efficiency for Honkai Star Rail oneiric shards purchases,
        comparing normal packages versus first-time bonus packages.
      </p>
    </div>

    <!-- Interactive Calculator -->
    <UCard class="mb-8">
      <template #header>
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <UIcon name="i-heroicons-calculator" />
          Cost Calculator
        </h2>
      </template>

      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <UFormGroup label="Target Pulls" class="mb-4">
            <URange v-model="targetPulls" :min="1" :max="180" :step="1" />
            <div class="text-center mt-2 text-sm text-gray-600 dark:text-gray-300">
              {{ targetPulls }} pulls
            </div>
          </UFormGroup>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <UCard>
            <div class="text-center">
              <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">Normal Cost</div>
              <div class="text-2xl font-bold text-red-600 dark:text-red-400">
                ${{ normalCost.toFixed(2) }}
              </div>
            </div>
          </UCard>

          <UCard>
            <div class="text-center">
              <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">First-Time Cost</div>
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                ${{ firstTimeCost.toFixed(2) }}
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <UAlert 
        v-if="savingsAmount > 0"
        color="green" 
        variant="soft"
        class="mt-4"
      >
        <template #title>
          You save ${{ savingsAmount.toFixed(2) }} ({{ savingsPercent.toFixed(1) }}%) with first-time bonus!
        </template>
      </UAlert>
    </UCard>

    <!-- Cost Comparison Chart -->
    <UCard class="mb-8">
      <template #header>
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <UIcon name="i-heroicons-chart-bar" />
          Cost Comparison: Normal vs First-Time Bonus
        </h2>
      </template>

      <div class="h-96">
        <NuxtChart
          type="line"
          :data="costComparisonData"
          :options="chartOptions"
        />
      </div>
    </UCard>

    <!-- Two column layout for additional charts -->
    <div class="grid lg:grid-cols-2 gap-8 mb-8">
      <!-- Savings Chart -->
      <UCard>
        <template #header>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <UIcon name="i-heroicons-currency-dollar" />
            Savings from First-Time Bonus
          </h3>
        </template>

        <div class="h-64">
          <NuxtChart
            type="line"
            :data="savingsData"
            :options="chartOptions"
          />
        </div>

        <UAlert color="green" variant="soft" class="mt-4">
          <template #title>
            Maximum Savings: ${{ maxSavings.toFixed(2) }} at {{ maxSavingsIndex + 1 }} pulls
          </template>
        </UAlert>
      </UCard>

      <!-- Cost per Pull Chart -->
      <UCard>
        <template #header>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <UIcon name="i-heroicons-chart-pie" />
            Cost per Pull
          </h3>
        </template>

        <div class="h-64">
          <NuxtChart
            type="line"
            :data="costPerPullData"
            :options="chartOptions"
          />
        </div>

        <div class="mt-4 grid grid-cols-2 gap-2">
          <UCard>
            <div class="text-center">
              <div class="text-sm text-gray-600 dark:text-gray-300">Normal (180 pulls)</div>
              <div class="text-lg font-bold text-red-600 dark:text-red-400">
                ${{ costPerPullNormal180.toFixed(2) }}/pull
              </div>
            </div>
          </UCard>
          
          <UCard>
            <div class="text-center">
              <div class="text-sm text-gray-600 dark:text-gray-300">First-Time (180 pulls)</div>
              <div class="text-lg font-bold text-green-600 dark:text-green-400">
                ${{ costPerPullFirstTime180.toFixed(2) }}/pull
              </div>
            </div>
          </UCard>
        </div>
      </UCard>
    </div>

    <!-- Package Efficiency Analysis -->
    <UCard class="mb-8">
      <template #header>
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <UIcon name="i-heroicons-trophy" />
          Package Efficiency Analysis
        </h2>
      </template>

      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <h4 class="font-semibold text-gray-900 dark:text-white mb-3 text-lg">Normal Packages:</h4>
          <div class="space-y-2">
            <UAlert color="red" variant="soft">
              <template #title>
                Best: {{ bestNormalEfficiency.toFixed(2) }} shards per dollar
              </template>
            </UAlert>
            <UAlert color="orange" variant="soft">
              <template #title>
                Worst: {{ worstNormalEfficiency.toFixed(2) }} shards per dollar
              </template>
            </UAlert>
          </div>
          <ul class="mt-4 space-y-2 text-gray-600 dark:text-gray-300">
            <li class="flex items-center gap-2">
              <UIcon name="i-heroicons-x-mark" class="text-red-500" />
              Expensive for regular purchases
            </li>
            <li class="flex items-center gap-2">
              <UIcon name="i-heroicons-x-mark" class="text-red-500" />
              Lower efficiency ratios
            </li>
            <li class="flex items-center gap-2">
              <UIcon name="i-heroicons-x-mark" class="text-red-500" />
              Higher cost per pull
            </li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 dark:text-white mb-3 text-lg">First-Time Bonus:</h4>
          <div class="space-y-2">
            <UAlert color="green" variant="soft">
              <template #title>
                Massive savings on all packages
              </template>
            </UAlert>
            <UAlert color="green" variant="soft">
              <template #title>
                Must-buy for optimal spending
              </template>
            </UAlert>
          </div>
          <ul class="mt-4 space-y-2 text-gray-600 dark:text-gray-300">
            <li class="flex items-center gap-2">
              <UIcon name="i-heroicons-check" class="text-green-500" />
              Massive savings on all packages
            </li>
            <li class="flex items-center gap-2">
              <UIcon name="i-heroicons-check" class="text-green-500" />
              Even small packages become very efficient
            </li>
            <li class="flex items-center gap-2">
              <UIcon name="i-heroicons-check" class="text-green-500" />
              Must-buy for optimal spending
            </li>
          </ul>
        </div>
      </div>
    </UCard>

    <!-- Summary Statistics -->
    <UCard>
      <template #header>
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <UIcon name="i-heroicons-clipboard-document-list" />
          Summary Statistics
        </h2>
      </template>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <UCard>
          <div class="text-center">
            <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">180 Pulls (Normal)</div>
            <div class="text-xl font-bold text-gray-900 dark:text-white">
              ${{ NORMAL_COSTS[179].toFixed(2) }}
            </div>
          </div>
        </UCard>

        <UCard>
          <div class="text-center">
            <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">180 Pulls (First-Time)</div>
            <div class="text-xl font-bold text-green-600 dark:text-green-400">
              ${{ FIRST_TIME_COSTS[179].toFixed(2) }}
            </div>
          </div>
        </UCard>

        <UCard>
          <div class="text-center">
            <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">Total Savings</div>
            <div class="text-xl font-bold text-blue-600 dark:text-blue-400">
              ${{ totalSavings.toFixed(2) }}
            </div>
          </div>
        </UCard>

        <UCard>
          <div class="text-center">
            <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">Savings %</div>
            <div class="text-xl font-bold text-purple-600 dark:text-purple-400">
              {{ totalSavingsPercentage.toFixed(1) }}%
            </div>
          </div>
        </UCard>
      </div>
    </UCard>
  </div>
</template>

<script setup>
import { 
  NORMAL_COSTS, 
  FIRST_TIME_COSTS, 
  normalPackages, 
  firstTimeBonusPackages 
} from '~/utils/shardsData'

// Set page meta
useHead({
  title: 'HSR Analysis',
  meta: [
    { name: 'description', content: 'Detailed analysis of Honkai Star Rail oneiric shards costs and package efficiency' }
  ]
})

// Reactive data
const targetPulls = ref(90)

// Computed values
const normalCost = computed(() => NORMAL_COSTS[targetPulls.value - 1])
const firstTimeCost = computed(() => FIRST_TIME_COSTS[targetPulls.value - 1])
const savingsAmount = computed(() => normalCost.value - firstTimeCost.value)
const savingsPercent = computed(() => (savingsAmount.value / normalCost.value) * 100)

const pulls = Array.from({ length: 180 }, (_, i) => i + 1)
const savings = computed(() => NORMAL_COSTS.map((normal, index) => normal - FIRST_TIME_COSTS[index]))

const maxSavings = computed(() => Math.max(...savings.value))
const maxSavingsIndex = computed(() => savings.value.indexOf(maxSavings.value))

const costPerPullNormal = computed(() => NORMAL_COSTS.map((cost, index) => cost / (index + 1)))
const costPerPullFirstTime = computed(() => FIRST_TIME_COSTS.map((cost, index) => cost / (index + 1)))

const costPerPullNormal180 = computed(() => costPerPullNormal.value[179])
const costPerPullFirstTime180 = computed(() => costPerPullFirstTime.value[179])

const bestNormalEfficiency = computed(() => Math.max(...normalPackages.map(pkg => pkg.shardsPerDollar)))
const worstNormalEfficiency = computed(() => Math.min(...normalPackages.map(pkg => pkg.shardsPerDollar)))

const totalSavings = computed(() => NORMAL_COSTS[179] - FIRST_TIME_COSTS[179])
const totalSavingsPercentage = computed(() => (totalSavings.value / NORMAL_COSTS[179]) * 100)

// Chart data
const costComparisonData = computed(() => ({
  labels: pulls,
  datasets: [
    {
      label: 'Normal Packages',
      data: NORMAL_COSTS,
      borderColor: 'rgb(239, 68, 68)',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      tension: 0.1
    },
    {
      label: 'First-Time Bonus',
      data: FIRST_TIME_COSTS,
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.1
    }
  ]
}))

const savingsData = computed(() => ({
  labels: pulls,
  datasets: [
    {
      label: 'Savings ($)',
      data: savings.value,
      borderColor: 'rgb(168, 85, 247)',
      backgroundColor: 'rgba(168, 85, 247, 0.1)',
      tension: 0.1,
      fill: true
    }
  ]
}))

const costPerPullData = computed(() => ({
  labels: pulls,
  datasets: [
    {
      label: 'Normal ($/pull)',
      data: costPerPullNormal.value,
      borderColor: 'rgb(239, 68, 68)',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      tension: 0.1
    },
    {
      label: 'First-Time ($/pull)',
      data: costPerPullFirstTime.value,
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.1
    }
  ]
}))

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        usePointStyle: true,
        boxWidth: 6
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(156, 163, 175, 0.1)'
      }
    }
  }
}
</script>