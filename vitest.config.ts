import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
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
    
    // Test file patterns
    include: [
      'tests/**/*.{test,spec}.{js,ts}',
    ],
    
    // Setup files
    setupFiles: ['./tests/setup.ts'],
    
    // Performance optimizations
    isolate: false, // Faster test execution
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true, // Prevent race conditions in E2E tests
      },
    },
        
    // Retry flaky tests
    retry: 1,
    
    // Global test configuration
    globals: true,
    
    // Environment configuration - using separate environments for different test types
    environment: 'nuxt', // Default environment for most tests
    
    // Timeouts
    testTimeout: 15000,
    hookTimeout: 10000,
  },

  // Projects configuration (Vitest 3.x format) - separate config for different test types
  projects: [
    {
      test: {
        name: 'Unit Tests',
        environment: 'jsdom',
        include: ['tests/**/*.unit.test.{js,ts}'],
        testTimeout: 10000,
        hookTimeout: 8000,
      },
    },
    {
      test: {
        name: 'Integration Tests', 
        environment: 'nuxt',
        include: ['tests/**/*.integration.test.{js,ts}'],
        testTimeout: 20000,
        hookTimeout: 15000,
      },
    },
  ],
})