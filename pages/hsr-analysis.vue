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
        <div class="h-80 w-full">
          <Scatter 
            :data="scatterChartData" 
            :options="scatterChartOptions" 
            :height="320"
          />
        </div>
        <div class="mt-4 text-sm text-gray-600 dark:text-gray-300">
          Shows cost vs pulls for each individual package. Green dots represent better value from first-time bonuses.
        </div>
      </UCard>

      <!-- Efficiency Comparison -->
      <UCard>
        <template #header>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <UIcon name="i-heroicons-chart-pie" />Package Efficiency
          </h3>
        </template>
        <div class="h-80 w-full">
          <Bar 
            :data="barChartData" 
            :options="barChartOptions" 
            :height="320"
          />
        </div>
        <div class="mt-4 text-sm text-gray-600 dark:text-gray-300">
          Cost per pull for each individual package. Lower is better. First-time bonus packages show dramatic savings.
        </div>
      </UCard>
    </div>

    <!-- Savings Analysis -->
    <UCard class="mb-8">
      <template #header>
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <UIcon name="i-heroicons-currency-dollar" />First-Time Bonus Package Savings
        </h2>
      </template>
      <div class="h-64 w-full mb-4">
        <Bar 
          :data="savingsChartData" 
          :options="savingsChartOptions" 
          :height="256"
        />
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
import { normalPackages, firstTimeBonusPackages } from '~/utils/shardsData'
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

useHead({
  title: 'HSR Analysis',
  meta: [{ name: 'description', content: 'Package-based analysis of Honkai Star Rail oneiric shards costs and spending efficiency' }]
})

// Scatter Chart Data - Cost vs Pulls
const scatterChartData = computed(() => ({
  datasets: [
    {
      label: 'Normal Packages',
      data: normalPackages.map((pkg, index) => ({
        x: pkg.pullsFromPackage,
        y: parseFloat(pkg.price.toFixed(2)),
        packageName: `Normal Package ${index + 1}`
      })),
      backgroundColor: 'rgba(239, 68, 68, 0.8)',
      borderColor: 'rgb(239, 68, 68)',
      pointRadius: 6,
      pointHoverRadius: 10
    },
    {
      label: 'First-Time Bonus Packages',
      data: firstTimeBonusPackages.map((pkg, index) => ({
        x: pkg.pullsFromPackage,
        y: parseFloat(pkg.price.toFixed(2)),
        packageName: `Bonus Package ${index + 1}`
      })),
      backgroundColor: 'rgba(34, 197, 94, 0.8)',
      borderColor: 'rgb(34, 197, 94)',
      pointRadius: 6,
      pointHoverRadius: 10
    }
  ]
}))

const scatterChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: false
    },
    legend: {
      display: true,
      position: 'top',
      labels: {
        usePointStyle: true,
        boxWidth: 8
      }
    },
    tooltip: {
      callbacks: {
        title: function(context) {
          return context[0].raw.packageName
        },
        label: function(context) {
          return `$${context.parsed.y.toFixed(2)} for ${context.parsed.x} pulls`
        }
      }
    }
  },
  scales: {
    x: {
      type: 'linear',
      position: 'bottom',
      title: {
        display: true,
        text: 'Pulls from Package'
      },
      grid: {
        display: false
      }
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Package Cost ($)'
      },
      grid: {
        color: 'rgba(156, 163, 175, 0.1)'
      }
    }
  }
}))

// Bar Chart Data - Package Efficiency
const barChartData = computed(() => ({
  labels: normalPackages.map((_, i) => `Package ${i + 1}`),
  datasets: [
    {
      label: 'Normal Cost/Pull',
      data: normalPackages.map(pkg => {
        // Show actual cost per pull, or null for packages with 0 pulls
        return pkg.pullsFromPackage === 0 ? null : parseFloat(pkg.costPerPull.toFixed(2))
      }),
      backgroundColor: 'rgba(239, 68, 68, 0.7)',
      borderColor: 'rgb(239, 68, 68)',
      borderWidth: 1
    },
    {
      label: 'First-Time Cost/Pull',
      data: firstTimeBonusPackages.map(pkg => {
        // Show actual cost per pull, or null for packages with 0 pulls
        return pkg.pullsFromPackage === 0 ? null : parseFloat(pkg.costPerPull.toFixed(2))
      }),
      backgroundColor: 'rgba(34, 197, 94, 0.7)',
      borderColor: 'rgb(34, 197, 94)',
      borderWidth: 1
    }
  ]
}))

const barChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: false
    },
    legend: {
      display: true,
      position: 'top'
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const packageIndex = context.dataIndex
          const isNormal = context.datasetIndex === 0
          const pkg = isNormal ? normalPackages[packageIndex] : firstTimeBonusPackages[packageIndex]
          
          if (pkg.pullsFromPackage === 0) {
            return `${context.dataset.label}: $${pkg.price.toFixed(2)} for 0 pulls (no value)`
          }
          return `${context.dataset.label}: $${context.parsed.y.toFixed(2)} per pull`
        }
      }
    }
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Package'
      },
      grid: {
        display: false
      }
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Cost per Pull ($)'
      },
      grid: {
        color: 'rgba(156, 163, 175, 0.1)'
      }
    }
  }
}))

// Savings Chart Data
const savingsChartData = computed(() => {
  const savingsData = firstTimeBonusPackages.map((bonusPackage, index) => {
    const normalPackage = normalPackages[index]
    if (!normalPackage) return null
    
    // Calculate actual savings: difference in total shards for same price
    const normalShards = normalPackage.totalShards
    const bonusShards = bonusPackage.totalShards
    const extraShards = bonusShards - normalShards
    const shardsValueInDollars = (extraShards / normalShards) * normalPackage.price
    
    return {
      savings: Math.max(0, parseFloat(shardsValueInDollars.toFixed(2))),
      bonusPulls: bonusPackage.pullsFromPackage,
      normalPulls: normalPackage.pullsFromPackage,
      extraShards: extraShards
    }
  }).filter(Boolean)

  return {
    labels: savingsData.map((_, i) => `Package ${i + 1}`),
    datasets: [{
      label: 'Savings per Package ($)',
      data: savingsData.map(s => s.savings),
      backgroundColor: 'rgba(168, 85, 247, 0.7)',
      borderColor: 'rgb(168, 85, 247)',
      borderWidth: 2,
      extraData: savingsData // Store extra data for tooltips
    }]
  }
})

const savingsChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: false
    },
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        afterLabel: function(context) {
          const dataPoint = context.dataset.extraData[context.dataIndex]
          return [
            `Bonus pulls: ${dataPoint.bonusPulls} vs Normal: ${dataPoint.normalPulls}`,
            `Extra shards: ${dataPoint.extraShards}`
          ]
        }
      }
    }
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Package'
      },
      grid: {
        display: false
      }
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Savings ($)'
      },
      grid: {
        color: 'rgba(156, 163, 175, 0.1)'
      }
    }
  }
}))

// Computed stats
const savingsStats = computed(() => {
  const savingsData = savingsChartData.value.datasets[0].extraData
  if (!savingsData || savingsData.length === 0) return []
  
  const maxSavings = Math.max(...savingsData.map(s => s.savings))
  const maxSavingsIndex = savingsData.findIndex(s => s.savings === maxSavings)
  const totalSavings = savingsData.reduce((sum, s) => sum + s.savings, 0)
  const avgSavings = totalSavings / savingsData.length
  const bestPackage = firstTimeBonusPackages.reduce((best, pkg) => 
    pkg.costPerPull < best.costPerPull && pkg.costPerPull !== Infinity ? pkg : best
  )
  
  return [
    { label: 'Max Package Savings', value: `$${maxSavings.toFixed(2)}`, color: 'text-green-600 dark:text-green-400' },
    { label: 'Best Package', value: `Package ${maxSavingsIndex + 1}`, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Avg Package Savings', value: `$${avgSavings.toFixed(2)}`, color: 'text-purple-600 dark:text-purple-400' },
    { label: 'Best Cost/Pull', value: `$${bestPackage.costPerPull.toFixed(2)}`, color: 'text-gray-900 dark:text-white' }
  ]
})
</script>