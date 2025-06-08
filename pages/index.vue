<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center">
          <div class="text-6xl mb-6">⭐</div>
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Honkai Star Rail
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Oneiric Shards
            </span>
            Analysis
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Make informed decisions when spending money on in-game currency. 
            Analyze the cost-effectiveness of various in-app purchase bundles for optimal gacha rolls.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink to="/hsr-analysis" class="btn-primary text-lg px-8 py-3">
              Start Analysis
            </NuxtLink>
            <a href="#features" class="btn-secondary text-lg px-8 py-3">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Use Our Analysis?
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get detailed insights into HSR spending patterns and optimize your investment
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="card text-center">
            <div class="text-4xl mb-4">💰</div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Cost Optimization
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Compare normal packages vs first-time bonus deals to maximize your shards per dollar
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="card text-center">
            <div class="text-4xl mb-4">📊</div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Interactive Charts
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Visualize cost trends, savings potential, and efficiency metrics with dynamic charts
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="card text-center">
            <div class="text-4xl mb-4">🎯</div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Pull Calculator
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Calculate exact costs for any number of pulls from 1 to 180 with real-time updates
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="bg-white dark:bg-gray-800 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Key Insights
          </h2>
        </div>

        <div class="grid md:grid-cols-4 gap-8">
          <div class="metric-card text-center">
            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              ${{ maxSavings.toFixed(2) }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-300">
              Maximum Savings with First-Time Bonus
            </div>
          </div>

          <div class="metric-card text-center">
            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {{ (savingsPercentage).toFixed(1) }}%
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-300">
              Total Savings on 180 Pulls
            </div>
          </div>

          <div class="metric-card text-center">
            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              ${{ bestEfficiency.toFixed(1) }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-300">
              Best Shards per Dollar (Normal)
            </div>
          </div>

          <div class="metric-card text-center">
            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              160
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-300">
              Shards per Pull
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Optimize Your HSR Spending?
        </h2>
        <p class="text-xl text-blue-100 mb-8">
          Start analyzing your oneiric shards purchases and make every dollar count
        </p>
        <NuxtLink to="/hsr-analysis" class="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200">
          Begin Analysis →
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { NORMAL_COSTS, FIRST_TIME_COSTS, normalPackages } from '~/utils/shardsData'

// Set page meta
useHead({
  title: 'Home',
  meta: [
    { name: 'description', content: 'Optimize your Honkai Star Rail oneiric shards spending with our comprehensive cost analysis tool' }
  ]
})

// Calculate key metrics for display
const maxSavings = computed(() => {
  const savings = NORMAL_COSTS.map((normal, index) => normal - FIRST_TIME_COSTS[index])
  return Math.max(...savings)
})

const savingsPercentage = computed(() => {
  const totalSavings = NORMAL_COSTS[179] - FIRST_TIME_COSTS[179] // 180 pulls
  return (totalSavings / NORMAL_COSTS[179]) * 100
})

const bestEfficiency = computed(() => {
  return Math.max(...normalPackages.map(pkg => pkg.shardsPerDollar))
})
</script>