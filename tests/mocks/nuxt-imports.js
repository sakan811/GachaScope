// Mock for #imports - Nuxt's auto-import functionality
import { vi } from 'vitest'

export const useState = vi.fn(() => ({
  value: {
    preference: 'system',
    value: 'light',
    unknown: false,
    forced: false,
    setColorTheme: vi.fn(),
    removeColorScheme: vi.fn(),
  },
}))

export const useNuxtApp = vi.fn(() => ({
  $colorMode: {
    preference: 'system',
    value: 'light',
    unknown: false,
    forced: false,
  },
}))

export const useLazyAsyncData = vi.fn()
export const useAsyncData = vi.fn()
export const useFetch = vi.fn()
export const useRoute = vi.fn()
export const useRouter = vi.fn()
export const useHead = vi.fn()
export const useCookie = vi.fn()
export const defineNuxtPlugin = vi.fn()
export const createApp = vi.fn()
export const nextTick = vi.fn()

// Add other commonly used Nuxt imports as needed
