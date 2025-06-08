<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
        ⭐ Honkai Star Rail - Oneiric Shards Cost Analysis
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-300">
        Analysis of optimal spending for 1-180 pulls
      </p>
    </div>

    <!-- Interactive Calculator -->
    <div class="card mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        🧮 Pull Cost Calculator
      </h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Target number of pulls: {{ targetPulls }}
          </label>
          <input 
            v-model.number="targetPulls"
            type="range" 
            min="1" 
            max="180" 
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>1</span>
            <span>90</span>
            <span>180</span>
          </div>
        </div>

        <div class="grid md:grid-cols-3 gap-4">
          <div class="metric-card text-center">
            <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">Normal Cost</div>
            <div class="text-2xl font-bold text-gray-900 dark:text-white">
              ${{ normalCost.toFixed(2) }}
            </div>
          </div>

          <div class="metric-card text-center">
            <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">First-Time Cost</div>
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">
              ${{ firstTimeCost.toFixed(2) }}
            </div>
          </div>

          <div class="metric-card text-center">
            <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">Savings</div>
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${{ savingsAmount.toFixed(2) }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              ({{ savingsPercent.toFixed(1) }}%)
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cost Comparison Chart -->
    <div class="card mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        📊 Cost Comparison: Normal vs First-Time Bonus
      </h2>
      <div class="h-96">
        <canvas ref="costChart"></canvas>
      </div>
    </div>

    <!-- Two column layout for additional charts -->
    <div class="grid lg:grid-cols-2 gap-8 mb-8">
      <!-- Savings Chart -->
      <div class="card">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          💰 Savings from First-Time Bonus
        </h3>
        <div class="h-64">
          <canvas ref="savingsChart"></canvas>
        </div>
        <div class="mt-4 p-3 bg-green-50 dark:bg-green-900 rounded-lg">
          <div class="text-sm text-green-800 dark:text-green-200">
            <strong>Maximum Savings:</strong> ${{ maxSavings.toFixed(2) }} at {{ maxSavingsIndex + 1 }} pulls
          </div>
        </div>
      </div>

      <!-- Cost per Pull Chart -->
      <div class="card">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          📈 Cost per Pull
        </h3>
        <div class="h-64">
          <canvas ref="costPerPullChart"></canvas>
        </div>
        <div class="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div class="p-2 bg-blue-50 dark:bg-blue-900 rounded">
            <div class="text-blue-800 dark:text-blue-200">
              <strong>Normal (180 pulls):</strong> ${{ costPerPullNormal180.toFixed(2) }}/pull
            </div>
          </div>
          <div class="p-2 bg-green-50 dark:bg-green-900 rounded">
            <div class="text-green-800 dark:text-green-200">
              <strong>First-Time (180 pulls):</strong> ${{ costPerPullFirstTime180.toFixed(2) }}/pull
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Package Efficiency Analysis -->
    <div class="grid lg:grid-cols-2 gap-8 mb-8">
      <!-- Normal Packages -->
      <div class="card">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Normal Packages
        </h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="text-left py-2 text-gray-600 dark:text-gray-300">Package</th>
                <th class="text-left py-2 text-gray-600 dark:text-gray-300">Total Shards</th>
                <th class="text-left py-2 text-gray-600 dark:text-gray-300">Shards/$</th>
                <th class="text-left py-2 text-gray-600 dark:text-gray-300">Cost/Pull</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pkg in normalPackages" :key="pkg.price" class="border-b border-gray-100 dark:border-gray-800">
                <td class="py-2 font-medium text-gray-900 dark:text-white">${{ pkg.price }}</td>
                <td class="py-2 text-gray-600 dark:text-gray-300">${{ pkg.costPerPull.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Key Insights -->
    <div class="card mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        🔍 Key Insights
      </h2>
      <div class="grid lg:grid-cols-2 gap-8">
        <div>
          <h4 class="font-semibold text-gray-900 dark:text-white mb-3">Normal Packages:</h4>
          <ul class="space-y-2 text-gray-600 dark:text-gray-300">
            <li>• Most efficient: $99.99 package ({{ bestNormalEfficiency.toFixed(1) }} shards/$)</li>
            <li>• Least efficient: $0.99 package ({{ worstNormalEfficiency.toFixed(1) }} shards/$)</li>
            <li>• Best for: Regular spending</li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-gray-900 dark:text-white mb-3">First-Time Bonus:</h4>
          <ul class="space-y-2 text-gray-600 dark:text-gray-300">
            <li>• Massive savings on all packages</li>
            <li>• Even small packages become very efficient</li>
            <li>• Must-buy for optimal spending</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Summary Statistics -->
    <div class="card">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        📋 Summary Statistics
      </h2>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="metric-card text-center">
          <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">180 Pulls (Normal)</div>
          <div class="text-xl font-bold text-gray-900 dark:text-white">
            ${{ NORMAL_COSTS[179].toFixed(2) }}
          </div>
        </div>

        <div class="metric-card text-center">
          <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">180 Pulls (First-Time)</div>
          <div class="text-xl font-bold text-green-600 dark:text-green-400">
            ${{ FIRST_TIME_COSTS[179].toFixed(2) }}
          </div>
        </div>

        <div class="metric-card text-center">
          <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">Total Savings</div>
          <div class="text-xl font-bold text-blue-600 dark:text-blue-400">
            ${{ totalSavings.toFixed(2) }}
          </div>
        </div>

        <div class="metric-card text-center">
          <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">Savings %</div>
          <div class="text-xl font-bold text-purple-600 dark:text-purple-400">
            {{ totalSavingsPercentage.toFixed(1) }}%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import { 
  NORMAL_COSTS, 
  FIRST_TIME_COSTS, 
  normalPackages, 
  firstTimeBonusPackages 
} from '~/utils/shardsData'

// Register Chart.js components
Chart.register(...registerables)

// Set page meta
useHead({
  title: 'HSR Analysis',
  meta: [
    { name: 'description', content: 'Detailed analysis of Honkai Star Rail oneiric shards costs and package efficiency' }
  ]
})

// Reactive data
const targetPulls = ref(90)
const costChart = ref(null)
const savingsChart = ref(null)
const costPerPullChart = ref(null)

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

// Chart configurations
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        usePointStyle: true,
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

// Initialize charts
onMounted(async () => {
  await nextTick()
  
  // Cost comparison chart
  if (costChart.value) {
    new Chart(costChart.value, {
      type: 'line',
      data: {
        labels: pulls,
        datasets: [
          {
            label: 'Normal Packages',
            data: NORMAL_COSTS,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
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
      },
      options: chartOptions
    })
  }

  // Savings chart
  if (savingsChart.value) {
    new Chart(savingsChart.value, {
      type: 'line',
      data: {
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
      },
      options: chartOptions
    })
  }

  // Cost per pull chart
  if (costPerPullChart.value) {
    new Chart(costPerPullChart.value, {
      type: 'line',
      data: {
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
      },
      options: chartOptions
    })
  }
})
</script>