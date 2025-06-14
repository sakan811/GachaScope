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
        'tests/**'
      ]
    },
    // Test file patterns
    include: [
      'tests/**/*.{test,spec}.{js,ts}',
      '**/*.{test,spec}.{nuxt,}.{js,ts}'
    ],
    // Global test timeout
    testTimeout: 10000,
    // Setup files
    setupFiles: ['./tests/setup.ts']
  }
})