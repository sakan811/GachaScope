/*
 * GachaScope - Comprehensive web application for analyzing cost-effectiveness of in-app purchase bundles in gacha games
 * Copyright (C) 2025  Sakan Nirattisaykul
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * along with this program.  If not, see https://www.gnu.org/licenses/.
 */

<template>
  <UContainer>
    <!-- Navigation -->
    <nav class="flex items-center justify-between py-3 sm:py-4 mb-6 sm:mb-8">
      <div class="flex items-center gap-2 sm:gap-4">
        <NuxtLink
          to="/"
          class="flex items-center gap-2 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white"
        >
          <img
            src="/android-chrome-512x512.png"
            alt="GachaScope Logo"
            class="h-8 w-8 sm:h-10 sm:w-10"
          >
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
            GachaScope
          </span>
        </NuxtLink>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center gap-6">
        <NuxtLink
          to="/"
          class="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
          :class="{ 'text-green-600 dark:text-green-400': $route.path === '/' }"
        >
          Home
        </NuxtLink>
        <NuxtLink
          to="/games/hsr/analysis"
          class="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
          :class="{ 'text-green-600 dark:text-green-400': $route.path.includes('/analysis') }"
        >
          HSR Analysis
        </NuxtLink>
        <UColorModeButton class="ml-2" />
      </div>

      <!-- Mobile Menu Button -->
      <div class="flex items-center gap-2 md:hidden">
        <UColorModeButton />
        <UButton
          variant="ghost"
          size="sm"
          :icon="isMobileMenuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'"
          class="p-2"
          :aria-label="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
          @click="toggleMobileMenu"
        />
      </div>
    </nav>

    <!-- Mobile Menu Overlay -->
    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-0 z-50 md:hidden"
      @click="closeMobileMenu"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <!-- Menu Panel -->
      <div class="absolute top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl">
        <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <span class="text-lg font-semibold text-gray-900 dark:text-white">Menu</span>
          <UButton
            variant="ghost"
            size="sm"
            icon="i-heroicons-x-mark"
            class="p-1"
            @click="closeMobileMenu"
          />
        </div>

        <nav class="p-4 space-y-4">
          <NuxtLink
            to="/"
            class="block py-3 px-4 text-base font-medium rounded-lg transition-colors"
            :class="$route.path === '/'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'"
            @click="closeMobileMenu"
          >
            🏠 Home
          </NuxtLink>
          <NuxtLink
            to="/games/hsr/analysis"
            class="block py-3 px-4 text-base font-medium rounded-lg transition-colors"
            :class="$route.path.includes('/analysis')
              ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'"
            @click="closeMobileMenu"
          >
            ⭐ HSR Analysis
          </NuxtLink>
        </nav>
      </div>
    </div>

    <!-- Page Content -->
    <NuxtPage />
  </UContainer>
</template>

<script setup>
// Global app configuration
useHead({
  titleTemplate: '%s - GachaScope',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: 'GachaScope - Comprehensive analysis tool for gacha game in-app purchases' },
    { name: 'keywords', content: 'gacha games, in-app purchase, cost analysis, spending optimization, mobile games' },
  ],
  htmlAttrs: {
    lang: 'en',
  },
})

// Mobile menu state
const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Close mobile menu on route change
const route = useRoute()
watch(() => route.path, () => {
  isMobileMenuOpen.value = false
})

// Close mobile menu on escape key
if (import.meta.client) {
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      isMobileMenuOpen.value = false
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleEscape)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
}
</script>
