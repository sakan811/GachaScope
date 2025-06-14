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
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                      {{ game.metadata.name }}
                    </h3>
                  </div>
                </div>
              </div>
            </template>
            
            <div class="space-y-3">              
              <div class="flex items-center gap-4 text-sm">
                <div class="flex items-center gap-1">
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
        </div>
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

function navigateToGame(gameId) {
  navigateTo(`/games/${gameId}/analysis`)
}
</script>