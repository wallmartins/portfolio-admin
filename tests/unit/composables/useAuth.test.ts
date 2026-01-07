import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'
import * as authModule from '~/composables/useAuth'

// Mock fetch and window
global.fetch = vi.fn()

// Mock window.open
global.window.open = vi.fn()

// Mock isClient to always return true in tests
vi.mock('~/composables/useAuth', async () => {
  const actual = await vi.importActual<typeof authModule>('~/composables/useAuth')
  return {
    ...actual,
    isClient: () => true
  }
})

const { useAuth } = authModule

describe('useAuth', () => {
  let mockRouter: any

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()

    // Create a fresh state map for this test
    const testStateMap = new Map()

    // Reset useState to use shared state within this test
    ;(global as any).useState = (key: string, init?: () => any) => {
      if (!testStateMap.has(key)) {
        testStateMap.set(key, ref(init ? init() : undefined))
      }
      return testStateMap.get(key)
    }

    // Mock router
    mockRouter = {
      push: vi.fn()
    }
    ;(global as any).useRouter = vi.fn(() => mockRouter)
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  describe('initialization', () => {
    it('should initialize with null user when no token in localStorage', () => {
      const { user, isAuthenticated } = useAuth()
      expect(user.value).toBeNull()
      expect(isAuthenticated.value).toBe(false)
    })

    it('should return null token when user is not authenticated', () => {
      const { token } = useAuth()
      expect(token.value).toBeNull()
    })
  })

  describe('initAuth', () => {
    it('should load auth data from localStorage', () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        avatar_url: 'https://avatar.url'
      }
      localStorage.setItem('auth_token', 'test-token-123')
      localStorage.setItem('auth_user', JSON.stringify(mockUser))

      const auth = useAuth()
      auth.initAuth()

      expect(auth.user.value).toEqual(mockUser)
      expect(auth.token.value).toBe('test-token-123')
      expect(auth.isAuthenticated.value).toBe(true)
      expect(auth.isLoading.value).toBe(false)
    })

    it('should handle invalid JSON in localStorage', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      localStorage.setItem('auth_token', 'test-token')
      localStorage.setItem('auth_user', 'invalid-json')

      const auth = useAuth()
      auth.initAuth()

      expect(auth.user.value).toBeNull()
      expect(auth.isAuthenticated.value).toBe(false)
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('should set isLoading to false when no auth data in localStorage', () => {
      const auth = useAuth()
      auth.initAuth()

      expect(auth.isLoading.value).toBe(false)
    })
  })

  describe('setAuth', () => {
    it('should set auth state and localStorage', () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        avatar_url: 'https://avatar.url'
      }
      const token = 'test-token-123'

      const auth = useAuth()
      auth.setAuth(token, mockUser)

      expect(auth.user.value).toEqual(mockUser)
      expect(auth.token.value).toBe(token)
      expect(auth.isAuthenticated.value).toBe(true)
      expect(auth.isLoading.value).toBe(false)

      expect(localStorage.getItem('auth_token')).toBe(token)
      expect(localStorage.getItem('auth_user')).toBe(JSON.stringify(mockUser))
    })
  })

  describe('clearAuth', () => {
    it('should clear auth state and localStorage', () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        avatar_url: 'https://avatar.url'
      }
      localStorage.setItem('auth_token', 'test-token')
      localStorage.setItem('auth_user', JSON.stringify(mockUser))
      localStorage.setItem('auth_return_url', '/dashboard')

      const auth = useAuth()
      auth.setAuth('test-token', mockUser)
      auth.clearAuth()

      expect(auth.user.value).toBeNull()
      expect(auth.token.value).toBeNull()
      expect(auth.isAuthenticated.value).toBe(false)
      expect(auth.isLoading.value).toBe(false)

      expect(localStorage.getItem('auth_token')).toBeNull()
      expect(localStorage.getItem('auth_user')).toBeNull()
      expect(localStorage.getItem('auth_return_url')).toBeNull()
    })
  })

  describe('logout', () => {
    it('should clear auth and redirect to login', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        avatar_url: 'https://avatar.url'
      }

      const auth = useAuth()
      auth.setAuth('test-token', mockUser)

      await auth.logout()

      expect(auth.user.value).toBeNull()
      expect(auth.isAuthenticated.value).toBe(false)
      expect(mockRouter.push).toHaveBeenCalledWith('/login')
    })
  })

  describe('loginWithGitHub', () => {
    it('should open popup window with correct URL', () => {
      const mockPopup = {
        closed: false
      }
      ;(window.open as any).mockReturnValue(mockPopup)

      const auth = useAuth()
      void auth.loginWithGitHub()

      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('/auth/github/redirect'),
        'GitHub OAuth',
        expect.stringContaining('width=600')
      )

      // Reject to avoid hanging promise
      mockPopup.closed = true
    })

    it('should reject if popup is blocked', async () => {
      ;(window.open as any).mockReturnValue(null)

      const auth = useAuth()

      await expect(auth.loginWithGitHub()).rejects.toThrow('Failed to open popup')
    })

    it('should resolve with user data on successful auth', async () => {
      vi.useFakeTimers()

      const mockPopup = {
        closed: false
      }
      ;(window.open as any).mockReturnValue(mockPopup)

      const auth = useAuth()
      const loginPromise = auth.loginWithGitHub()

      // Simulate auth success message
      const authData = {
        name: 'Test User',
        email: 'test@example.com',
        accessToken: 'test-token-123',
        avatar: 'https://avatar.url'
      }

      const messageEvent = new MessageEvent('message', {
        origin: 'http://localhost:9501',
        data: {
          type: 'AUTH_SUCCESS',
          data: authData
        }
      })

      window.dispatchEvent(messageEvent)

      const result = await loginPromise

      expect(result.token).toBe('test-token-123')
      expect(result.user.name).toBe('Test User')
      expect(auth.isAuthenticated.value).toBe(true)

      vi.useRealTimers()
    })

    it('should reject if popup is closed without completing auth', async () => {
      vi.useFakeTimers()

      const mockPopup = {
        closed: false
      }
      ;(window.open as any).mockReturnValue(mockPopup)

      const auth = useAuth()
      const loginPromise = auth.loginWithGitHub()

      // Simulate popup being closed
      mockPopup.closed = true
      vi.advanceTimersByTime(1000)

      await expect(loginPromise).rejects.toThrow('Authentication cancelled')

      vi.useRealTimers()
    })

    it('should ignore messages from wrong origin', async () => {
      vi.useFakeTimers()

      const mockPopup = {
        closed: false
      }
      ;(window.open as any).mockReturnValue(mockPopup)

      const auth = useAuth()
      const loginPromise = auth.loginWithGitHub()

      // Simulate message from wrong origin
      const messageEvent = new MessageEvent('message', {
        origin: 'https://malicious-site.com',
        data: {
          type: 'AUTH_SUCCESS',
          data: {
            name: 'Hacker',
            email: 'hack@evil.com',
            accessToken: 'fake-token',
            avatar: 'https://evil.com/avatar'
          }
        }
      })

      window.dispatchEvent(messageEvent)

      // User should not be authenticated
      expect(auth.isAuthenticated.value).toBe(false)

      // Close popup to resolve promise
      mockPopup.closed = true
      vi.advanceTimersByTime(1000)

      await expect(loginPromise).rejects.toThrow('Authentication cancelled')

      vi.useRealTimers()
    })
  })

  describe('computed properties', () => {
    it('should expose reactive computed properties', () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        avatar_url: 'https://avatar.url'
      }

      const auth = useAuth()

      // Initially null
      expect(auth.user.value).toBeNull()
      expect(auth.token.value).toBeNull()
      expect(auth.isAuthenticated.value).toBe(false)

      // After setAuth
      auth.setAuth('test-token', mockUser)

      expect(auth.user.value).toEqual(mockUser)
      expect(auth.token.value).toBe('test-token')
      expect(auth.isAuthenticated.value).toBe(true)
    })
  })
})
