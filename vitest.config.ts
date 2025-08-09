import { fileURLToPath } from 'node:url'
import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineVitestProject({
  // Resolve configuration for module resolution
  resolve: {
    alias: {
      // Handle Nuxt's #imports alias for unit tests
      '#imports': new URL('./tests/mocks/nuxt-imports.js', import.meta.url).pathname,
      '~/': fileURLToPath(new URL('./', import.meta.url)),
    },
  },

  test: {
    // Server dependencies to transform
    server: {
      deps: {
        inline: ['@nuxt/ui', '@nuxtjs/color-mode'],
      },
    },

    // Test file patterns - using filename conventions instead of projects
    include: [
      'tests/**/*.{test,spec}.{js,ts}',
    ],

    // Setup files
    setupFiles: ['./tests/setup.ts'],

    // Performance optimizations
    isolate: false, // Faster execution
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true, // Prevent race conditions
      },
    },

    // Retry flaky tests
    retry: 1,

    // Global test configuration
    globals: true,

    // Default environment
    environment: 'happy-dom',

    // Projects are not needed as top-level include is used
  },
})
