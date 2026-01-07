import { vi, beforeEach } from 'vitest'
import { ref, computed } from 'vue'

// Mock storage for useState
const stateMap = new Map()

// Clear state between tests
beforeEach(() => {
  stateMap.clear()
  localStorage.clear()
})

// Mock Nuxt auto-imports
;(global as any).definePageMeta = vi.fn()
;(global as any).navigateTo = vi.fn()
;(global as any).useRouter = vi.fn(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn()
}))
;(global as any).useRoute = vi.fn(() => ({
  params: {},
  query: {}
}))
;(global as any).useRuntimeConfig = vi.fn(() => ({
  public: {
    apiUrl: 'http://localhost:9501',
    aiApiUrl: 'http://localhost:3001'
  }
}))
;(global as any).useState = (key: string, init?: () => any) => {
  if (!stateMap.has(key)) {
    stateMap.set(key, ref(init ? init() : undefined))
  }
  return stateMap.get(key)
}
;(global as any).useNuxtApp = vi.fn(() => ({
  $router: {
    push: vi.fn(),
    replace: vi.fn()
  }
}))
;(global as any).$fetch = vi.fn()

// Export Vue functions globally for auto-imports
;(global as any).ref = ref
;(global as any).computed = computed

// Mock import.meta - this needs to be set before any imports
if (!import.meta.client) {
  Object.defineProperty(import.meta, 'client', {
    get: () => true,
    configurable: true
  })
}
