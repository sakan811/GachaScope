export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/test-utils/module'],
  css: ['~/assets/css/main.css'],
  
  // Router configuration for game-based routing
  router: {
    options: {
      strict: false
    }
  },
  
  // Nitro configuration for better performance
  nitro: {
    preset: 'node-server',
    compressPublicAssets: true
  },
  
  // App configuration
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'GachaScope - Gacha Game Analysis Tool',
      meta: [
        { name: 'description', content: 'Comprehensive analysis tool for gacha game in-app purchases and spending optimization' },
        { name: 'keywords', content: 'gacha games, in-app purchase, cost analysis, spending optimization, mobile games, HSR' },
        { property: 'og:title', content: 'GachaScope - Gacha Game In-App Purchases Analysis' },
        { property: 'og:description', content: 'Make informed decisions about your gacha game spending with detailed package analysis' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  
  // Runtime configuration
  runtimeConfig: {
    // Public keys (exposed to client-side)
    public: {
      siteName: 'GachaScope',
      siteDescription: 'Gacha Game Analysis Tool',
      version: '2.0.0'
    }
  },
  
  // Build optimization
  build: {
    transpile: ['chart.js']
  },
  
  // Vite configuration
  vite: {
    optimizeDeps: {
      include: ['chart.js', 'vue-chartjs']
    }
  },
  
  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: true
  }
})