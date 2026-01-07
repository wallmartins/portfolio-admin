import { vi } from 'vitest'

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
