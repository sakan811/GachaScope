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
      </div>
    </nav>

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
    { name: 'keywords', content: 'gacha games, in-app purchase, cost analysis, spending optimization, mobile games' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})
</script>