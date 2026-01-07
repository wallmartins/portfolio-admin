import { ref } from 'vue'
import { vi } from 'vitest'

export const isClient = vi.fn(() => true)

export const useAuth = vi.fn(() => ({
  user: ref(null),
  token: ref(null),
  isAuthenticated: ref(false),
  isLoading: ref(false),
  initAuth: vi.fn(),
  loginWithGitHub: vi.fn(),
  logout: vi.fn(),
  setAuth: vi.fn(),
  clearAuth: vi.fn()
}))
