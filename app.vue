<template>
  <UContainer>
    <!-- Navigation -->
    <nav class="flex items-center justify-between py-4 mb-8">
      <div class="flex items-center gap-4">
        <NuxtLink to="/" class="text-2xl font-bold text-gray-900 dark:text-white">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            GachaScope
          </span>
        </NuxtLink>
        <span v-if="currentGameContext" class="text-sm text-gray-500 dark:text-gray-400">
          {{ currentGameContext.name }}
        </span>
      </div>
      
      <div class="flex items-center gap-4">
        <NuxtLink 
          to="/" 
          class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
          active-class="text-blue-600 dark:text-blue-400 font-medium"
        >
          Home
        </NuxtLink>
        
        <!-- Dynamic game navigation - only show if we have games -->
        <div v-if="availableGames.length > 0" class="relative">
          <UDropdown :items="gameMenuItems" :popper="{ placement: 'bottom-start' }">
            <UButton 
              variant="ghost" 
              trailing-icon="i-heroicons-chevron-down-20-solid"
              :class="isOnAnalysisPage ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'"
            >
              Analysis
            </UButton>
          </UDropdown>
        </div>
        
        <UColorModeButton />
      </div>
    </nav>

    <!-- Page Content -->
    <NuxtPage />

    <!-- Footer -->
    <footer class="mt-16 py-8 border-t border-gray-200 dark:border-gray-700">
      <div class="text-center text-sm text-gray-600 dark:text-gray-400">
        <p class="mb-2">© 2025 GachaScope - Gacha Game Analysis Tool</p>
        <p>Built with Nuxt.js & TailwindCSS</p>
      </div>
    </footer>
  </UContainer>
</template>

<script setup>
import { getActiveGames, getGameById } from '~/utils/gameRegistry'

// Global app configuration
useHead({
  titleTemplate: '%s - GachaScope',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: 'GachaScope - Comprehensive analysis tool for gacha game in-app purchases' },
    { name: 'keywords', content: 'gacha games, in-app purchase, cost analysis, spending optimization, mobile games' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const route = useRoute()

// Get available games (currently only HSR)
const availableGames = getActiveGames()

// Determine current game context based on route
const currentGameContext = computed(() => {
  const gameId = route.params.gameId as string
  if (gameId) {
    return getGameById(gameId)?.metadata
  }
  return null
})

// Check if we're on an analysis page
const isOnAnalysisPage = computed(() => {
  return route.path.includes('/games/') && route.path.includes('/analysis')
})

// Generate game menu items for dropdown
const gameMenuItems = computed(() => [
  [{
    label: 'Available Games',
    slot: 'header'
  }],
  ...availableGames.map(game => ([{
    label: game.metadata.name,
    icon: 'i-heroicons-star',
    to: `/games/${game.metadata.id}/analysis`,
    description: game.metadata.description
  }])),
  [{
    label: 'More games coming soon...',
    disabled: true,
    icon: 'i-heroicons-plus-circle'
  }]
])
</script>