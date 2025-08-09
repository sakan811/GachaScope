// Mock for @nuxtjs/color-mode/dist/runtime/plugin.client.js
// This provides a complete mock that prevents any import resolution issues

export default function defineNuxtPlugin() {
  return {
    name: 'color-mode-mock',
    setup() {
      // Mock plugin setup - no actual functionality needed for tests
      return Promise.resolve()
    },
  }
}
