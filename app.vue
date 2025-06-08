<template>
  <UApp>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Navigation -->
      <nav class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <NuxtLink to="/" class="flex items-center space-x-2">
                <UIcon name="i-heroicons-star" class="text-2xl text-yellow-500" />
                <span class="text-xl font-bold text-gray-900 dark:text-white">HSR Analysis</span>
              </NuxtLink>
            </div>
            
            <div class="flex items-center space-x-4">
              <UButton
                to="/"
                variant="ghost"
                size="sm"
                class="font-medium"
              >
                Home
              </UButton>
              <UButton
                to="/hsr-analysis"
                variant="ghost"
                size="sm"
                class="font-medium"
              >
                Analysis
              </UButton>
              <UColorModeButton />
            </div>
          </div>
        </div>
      </nav>

      <!-- Main content -->
      <main>
        <NuxtPage />
      </main>

      <!-- Footer -->
      <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div class="text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2025 HSR Oneiric Shards Analysis. Built with Nuxt.js & TailwindCSS.</p>
            <p class="mt-2 text-sm">Analysis of optimal spending for Honkai Star Rail gacha pulls</p>
          </div>
        </div>
      </footer>
    </div>
  </UApp>
</template>

<script setup>
// Set page meta
useHead({
  htmlAttrs: {
    lang: 'en'
  },
  titleTemplate: '%s | HSR Analysis',
  meta: [
    { name: 'description', content: 'Analysis of optimal spending for Honkai Star Rail oneiric shards and gacha pulls' },
    { name: 'keywords', content: 'honkai star rail, hsr, oneiric shards, gacha, analysis, cost optimization' }
  ]
})
</script>