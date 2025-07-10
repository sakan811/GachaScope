import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineVitestProject({
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
