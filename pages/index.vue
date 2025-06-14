<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center">
          <div class="text-6xl mb-6">📊</div>
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              GachaScope
            </span>
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            The ultimate analysis tool for gacha game in-app purchases. 
            Make informed spending decisions with detailed cost breakdowns and efficiency analysis.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton color="primary" size="lg" class="px-8 py-3" @click="scrollToGames">
              Explore Games
            </UButton>
            <UButton variant="outline" size="lg" class="px-8 py-3" @click="scrollToFeatures">
              Learn More
            </UButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Supported Games Section -->
    <section id="games" class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Supported Games
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose from our growing library of supported gacha games
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UCard 
            v-for="game in supportedGames" 
            :key="game.metadata.id"
            :class="[
              'cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg',
              'border-2 hover:border-blue-500 dark:hover:border-blue-400'
            ]"
            @click="navigateToGame(game.metadata.id)"
          >
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="text-2xl">{{ game.metadata.icon }}</div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                      {{ game.metadata.name }}
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-300">
                      by {{ game.metadata.developer }}
                    </p>
                  </div>
                </div>
                <UBadge 
                  v-if="game.metadata.status === 'beta'" 
                  color="yellow" 
                  variant="soft"
                >
                  Beta
                </UBadge>
              </div>
            </template>
            
            <div class="space-y-3">
              <p class="text-gray-600 dark:text-gray-300 text-sm">
                {{ game.metadata.description }}
              </p>
              
              <div class="flex items-center gap-4 text-sm">
                <div class="flex items-center gap-1">
                  <span>{{ game.metadata.currency.icon }}</span>
                  <span class="text-gray-600 dark:text-gray-300">{{ game.metadata.currency.name }}</span>
                </div>
                <div class="text-gray-600 dark:text-gray-300">
                  {{ game.packages.normal.length + game.packages.firstTimeBonus.length }} packages
                </div>
              </div>
              
              <div class="pt-2">
                <UButton 
                  block 
                  color="primary" 
                  @click.stop="navigateToGame(game.metadata.id)"
                >
                  Analyze Packages →
                </UButton>
              </div>
            </div>
          </UCard>

          <!-- Coming Soon Card -->
          <UCard class="border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div class="text-center py-8">
              <div class="text-4xl mb-4">🚀</div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                More Games Coming Soon
              </h3>
              <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
                We're constantly adding support for new gacha games
              </p>
              <UButton variant="ghost" size="sm" disabled>
                Request a Game
              </UButton>
            </div>
          </UCard>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="bg-white dark:bg-gray-800 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose GachaScope?
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get detailed insights into your gacha game spending with our comprehensive analysis tools
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-heroicons-calculator" class="text-2xl text-blue-600 dark:text-blue-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Precise Cost Analysis
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Calculate exact costs per pull, efficiency ratings, and leftover currency for every package combination
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-heroicons-gift" class="text-2xl text-green-600 dark:text-green-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              First-Time Bonus Tracking
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Maximize your savings by understanding the true value of first-time purchase bonuses
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-heroicons-chart-bar" class="text-2xl text-purple-600 dark:text-purple-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Interactive Visualizations
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Explore your data with dynamic charts showing cost efficiency, savings potential, and spending scenarios
            </p>
          </div>

          <!-- Feature 4 -->
          <div class="text-center">
            <div class="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-heroicons-scale" class="text-2xl text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Scenario Comparisons
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Compare different spending strategies and package combinations to find the best value for your budget
            </p>
          </div>

          <!-- Feature 5 -->
          <div class="text-center">
            <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-heroicons-shield-check" class="text-2xl text-red-600 dark:text-red-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Responsible Spending
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Make informed decisions with clear cost breakdowns and spending recommendations
            </p>
          </div>

          <!-- Feature 6 -->
          <div class="text-center">
            <div class="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-heroicons-arrow-trending-up" class="text-2xl text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Multi-Game Support
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Compare spending efficiency across different games and optimize your gacha game portfolio
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Platform Statistics
          </h2>
        </div>

        <div class="grid md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {{ supportedGames.length }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-300">
              Supported Games
            </div>
          </div>

          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {{ totalPackages }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-300">
              Total Packages Analyzed
            </div>
          </div>

          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              ${{ maxSavings.toFixed(0) }}+
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-300">
              Maximum Potential Savings
            </div>
          </div>

          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {{ totalScenarios }}+
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-300">
              Spending Scenarios
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Optimize Your Gacha Spending?
        </h2>
        <p class="text-xl text-blue-100 mb-8">
          Start analyzing your favorite games and discover the most efficient spending strategies
        </p>
        <UButton 
          size="lg" 
          color="white" 
          variant="solid"
          class="px-8 py-3"
          @click="scrollToGames"
        >
          Choose Your Game →
        </UButton>
      </div>
    </section>
  </div>
</template>

<script setup>
import { getActiveGames } from '~/utils/gameRegistry'

// Set page meta
useHead({
  title: 'Home',
  meta: [
    { name: 'description', content: 'GachaScope - The ultimate analysis tool for gacha game in-app purchases. Optimize your spending across multiple games.' }
  ]
})

// Get all supported games (currently only HSR is active)
const supportedGames = getActiveGames()

// Calculate statistics based on available games
const totalPackages = computed(() => {
  return supportedGames.reduce((total, game) => 
    total + game.packages.normal.length + game.packages.firstTimeBonus.length, 0
  )
})

const maxSavings = computed(() => {
  // Simple estimation - this could be more sophisticated
  return supportedGames.length * 150 // Rough estimate of max savings per game
})

const totalScenarios = computed(() => {
  return supportedGames.reduce((total, game) => 
    total + game.metadata.analysisConfig.maxScenarios * 2, 0 // Normal + bonus scenarios
  )
})

// Navigation functions
function scrollToGames() {
  document.getElementById('games')?.scrollIntoView({ behavior: 'smooth' })
}

function scrollToFeatures() {
  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
}

function navigateToGame(gameId) {
  navigateTo(`/games/${gameId}/analysis`)
}
</script>