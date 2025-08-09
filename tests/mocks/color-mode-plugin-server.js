// Mock for @nuxtjs/color-mode/dist/runtime/plugin.server.js
// This provides a complete mock that prevents any import resolution issues

export default function defineNuxtPlugin() {
  return {
    name: 'color-mode-server-mock',
    setup() {
      // Mock server plugin setup - no actual functionality needed for tests
      return Promise.resolve()
    },
  }
}
