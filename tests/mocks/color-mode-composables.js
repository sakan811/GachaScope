// Mock for @nuxtjs/color-mode/dist/runtime/composables.js
import { vi } from 'vitest'

export const useColorMode = vi.fn(() => ({
  preference: 'system',
  value: 'light',
  unknown: false,
  forced: false,
  setColorTheme: vi.fn(),
  removeColorScheme: vi.fn(),
}))
