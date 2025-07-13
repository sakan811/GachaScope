export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/test-utils/module', '@nuxt/eslint'],
  devtools: { enabled: true },

  // App configuration
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'GachaScope - Gacha Game Analysis Tool',
      meta: [
        { name: 'description', content: 'Comprehensive analysis tool for gacha game in-app purchases and spending optimization' },
        { name: 'keywords', content: 'gacha games, in-app purchase, cost analysis, spending optimization, mobile games, HSR' },
        { name: 'author', content: 'GachaScope' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:title', content: 'GachaScope - Gacha Game In-App Purchases Analysis' },
        { property: 'og:description', content: 'Make informed decisions about your gacha game spending with detailed package analysis' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://gachascope.fukudev.org/' },
        { property: 'og:site_name', content: 'GachaScope' },
        { property: 'og:locale', content: 'en_US' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'GachaScope - Gacha Game Analysis Tool' },
        { name: 'twitter:description', content: 'Make informed decisions about your gacha game spending with detailed package analysis' },
        { name: 'twitter:url', content: 'https://gachascope.fukudev.org/' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://gachascope.fukudev.org/' },
      ],
    },
  },
  css: ['~/assets/css/main.css'],

  // Router configuration for game-based routing
  router: {
    options: {
      strict: false,
    },
  },

  // Runtime configuration
  runtimeConfig: {
    // Public keys (exposed to client-side)
    public: {
      siteName: 'GachaScope',
      siteDescription: 'Gacha Game Analysis Tool',
      siteUrl: 'https://gachascope.fukudev.org',
      version: '1.0.0',
    },
  },

  // Build optimization
  build: {
    transpile: ['chart.js'],
  },
  compatibilityDate: '2025-05-15',

  // Nitro configuration for Vercel deployment
  nitro: {
    preset: 'vercel-edge',
  },

  // Vite configuration
  vite: {
    optimizeDeps: {
      include: ['chart.js', 'vue-chartjs'],
    },
  },

  // TypeScript configuration - exclude tests from type checking
  typescript: {
    strict: true,
    typeCheck: {
      eslint: {
        files: './pages/**/*.{js,ts,vue}',
      },
    },
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },
})
