import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineVitestProject({
  // Resolve configuration for module resolution
  resolve: {
    alias: {
      // Handle Nuxt's internal aliases and color-mode runtime files
      '#color-mode/client': new URL('./tests/mocks/color-mode-client.js', import.meta.url).pathname,
      '#color-mode/server': new URL('./tests/mocks/color-mode-server.js', import.meta.url).pathname,
      '@nuxtjs/color-mode/dist/runtime/plugin.client.js': new URL('./tests/mocks/color-mode-plugin-client.js', import.meta.url).pathname,
      '@nuxtjs/color-mode/dist/runtime/plugin.server.js': new URL('./tests/mocks/color-mode-plugin-server.js', import.meta.url).pathname,
      '@nuxtjs/color-mode/dist/runtime/composables.js': new URL('./tests/mocks/color-mode-composables.js', import.meta.url).pathname,
      // Handle Nuxt's #imports alias
      '#imports': new URL('./tests/mocks/nuxt-imports.js', import.meta.url).pathname,
    },
  },

  test: {
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '.nuxt/',
        '.output/',
        'coverage/',
        '**/*.d.ts',
        '**/*.config.*',
        'tests/**',
      ],
    },

    // Test file patterns - using filename conventions instead of projects
    include: [
      'tests/**/*.{test,spec}.{js,ts}',
      'tests/**/*.unit.{test,spec}.{js,ts}',
      'tests/**/*.integration.{test,spec}.{js,ts}',
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

    // Projects configuration - replaces deprecated environmentMatchGlobs
    projects: [
      {
        // Unit tests project
        extends: true,
        test: {
          name: 'unit',
          include: ['**/*.unit.{test,spec}.{js,ts}'],
          environment: 'jsdom',
          testTimeout: 10000,
        },
      },
      {
        // Integration tests project
        extends: true,
        test: {
          name: 'integration',
          include: ['**/*.integration.{test,spec}.{js,ts}'],
          environment: 'nuxt',
          testTimeout: 15000,
        },
      },
    ],

    // Timeouts (defaults for projects that don't override)
    testTimeout: 15000,
    hookTimeout: 10000,
  },
})
