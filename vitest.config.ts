import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    // Add coverage configuration
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
    // Test file patterns
    include: [
      'tests/**/*.{test,spec}.{js,ts}',
      '**/*.{test,spec}.{nuxt,}.{js,ts}',
    ],
    // Different timeouts for different test types
    testTimeout: 15000, // Default timeout
    // Setup files
    setupFiles: ['./tests/setup.ts'],
    // Environment for different test patterns
    environmentMatchGlobs: [
      ['tests/e2e/**', 'nuxt'],
      ['tests/unit/**', 'jsdom'],
      ['tests/integration/**', 'nuxt'],
    ],
  },
})
