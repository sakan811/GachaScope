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
            Make informed decisions when purchasing oneiric shard packages. 
            Analyze the exact number of pulls you get from different package combinations and their costs.
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
            Why Use Our Package Analysis?
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get detailed insights into HSR package spending and optimize your shard purchases
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="card text-center">
            <div class="text-4xl mb-4">📦</div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Package-Based Analysis
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              See exactly how many pulls you get from each package purchase, including leftover shards
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="card text-center">
            <div class="text-4xl mb-4">📊</div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Realistic Scenarios
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Compare common spending patterns and package combinations players actually use
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="card text-center">
            <div class="text-4xl mb-4">💰</div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              First-Time Bonus Tracking
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Calculate massive savings from first-time bonus packages vs normal pricing
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
            Package Insights
          </h2>
        </div>

        <div class="grid md:grid-cols-4 gap-8">
          <div class="metric-card text-center">
            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              ${{ stats.maxSavings.toFixed(2) }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-300">
              Maximum Savings Available
            </div>
          </div>

          <div class="metric-card text-center">
            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {{ stats.bestBonusPackage.pullsFromPackage }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-300">
              Max Pulls from Single Bonus Package
            </div>
          </div>

          <div class="metric-card text-center">
            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              ${{ stats.bestEfficiency.toFixed(2) }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-300">
              Best Cost per Pull (Bonus)
            </div>
          </div>

          <div class="metric-card text-center">
            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {{ stats.packageCount }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-300">
              Package Options Available
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Package Showcase -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Package Comparison
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-300">
            See the difference between normal and first-time bonus packages
          </p>
        </div>

        <div class="grid lg:grid-cols-2 gap-8">
          <!-- Example Normal Package -->
          <UCard>
            <template #header>
              <h3 class="text-xl font-semibold text-red-600 dark:text-red-400">Normal Package Example</h3>
            </template>
            <div class="space-y-4">
              <div class="flex justify-between items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div>
                  <div class="font-bold text-lg text-gray-900 dark:text-white">${{ exampleNormalPackage.price.toFixed(2) }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-300">{{ exampleNormalPackage.totalShards }} shards</div>
                </div>
                <div class="text-right">
                  <div class="font-bold text-lg text-red-600">{{ exampleNormalPackage.pullsFromPackage }} pulls</div>
                  <div class="text-sm text-gray-600 dark:text-gray-300">${{ exampleNormalPackage.costPerPull.toFixed(2) }}/pull</div>
                </div>
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-300">
                Leftover: {{ exampleNormalPackage.leftoverShards }} shards
              </div>
            </div>
          </UCard>

          <!-- Example First-Time Package -->
          <UCard>
            <template #header>
              <h3 class="text-xl font-semibold text-green-600 dark:text-green-400">First-Time Bonus Example</h3>
            </template>
            <div class="space-y-4">
              <div class="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div>
                  <div class="font-bold text-lg text-gray-900 dark:text-white">${{ exampleBonusPackage.price.toFixed(2) }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-300">{{ exampleBonusPackage.totalShards }} shards</div>
                </div>
                <div class="text-right">
                  <div class="font-bold text-lg text-green-600">{{ exampleBonusPackage.pullsFromPackage }} pulls</div>
                  <div class="text-sm text-gray-600 dark:text-gray-300">${{ exampleBonusPackage.costPerPull.toFixed(2) }}/pull</div>
                </div>
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-300">
                Leftover: {{ exampleBonusPackage.leftoverShards }} shards
              </div>
              <UAlert color="green" variant="soft">
                <template #title>
                  Save ${{ (exampleNormalPackage.costPerPull * exampleBonusPackage.pullsFromPackage - exampleBonusPackage.price).toFixed(2) }} 
                  compared to normal!
                </template>
              </UAlert>
            </div>
          </UCard>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Optimize Your Package Purchases?
        </h2>
        <p class="text-xl text-blue-100 mb-8">
          Start analyzing different package combinations and see exactly what you get for your money
        </p>
        <NuxtLink to="/hsr-analysis" class="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200">
          Analyze Packages →
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { normalPackages, firstTimeBonusPackages, chartData } from '~/utils/shardsData'

// Set page meta
useHead({
  title: 'Home',
  meta: [
    { name: 'description', content: 'Optimize your Honkai Star Rail oneiric shards package purchases with our comprehensive analysis tool' }
  ]
})

// Calculate stats based on package data
const stats = computed(() => {
  // Find max savings from chart data
  const maxSavings = Math.max(...chartData.savingsData.map(d => d.savings))
  
  // Find best packages
  const bestBonusPackage = firstTimeBonusPackages.reduce((best, pkg) => 
    pkg.pullsFromPackage > best.pullsFromPackage ? pkg : best
  )
  
  const bestEfficiency = Math.min(...firstTimeBonusPackages
    .filter(pkg => pkg.costPerPull < Infinity)
    .map(pkg => pkg.costPerPull)
  )
  
  const packageCount = normalPackages.length
  
  return {
    maxSavings,
    bestBonusPackage,
    bestEfficiency,
    packageCount
  }
})

// Example packages for showcase (middle-tier packages)
const exampleNormalPackage = computed(() => normalPackages[2]) // Third package
const exampleBonusPackage = computed(() => firstTimeBonusPackages[2]) // Third package
</script>