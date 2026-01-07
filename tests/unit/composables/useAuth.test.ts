import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuth } from '~/composables/useAuth'

// Mock fetch
global.fetch = vi.fn()

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should initialize with null user when no token in localStorage', () => {
    const { user, isAuthenticated } = useAuth()
    expect(user.value).toBeNull()
    expect(isAuthenticated.value).toBe(false)
  })

  it('should set authenticated state when user data exists in localStorage', () => {
    const mockUser = {
      name: 'Test User',
      email: 'test@example.com',
      avatar: 'https://avatar.url',
      accessToken: 'mock-token'
    }
    localStorage.setItem('user', JSON.stringify(mockUser))

    const { user, isAuthenticated } = useAuth()
    expect(user.value).toEqual(mockUser)
    expect(isAuthenticated.value).toBe(true)
  })

  it('should clear user data on logout', () => {
    const mockUser = {
      name: 'Test User',
      email: 'test@example.com',
      avatar: 'https://avatar.url',
      accessToken: 'mock-token'
    }
    localStorage.setItem('user', JSON.stringify(mockUser))

    const { logout, user, isAuthenticated } = useAuth()
    logout()

    expect(user.value).toBeNull()
    expect(isAuthenticated.value).toBe(false)
    expect(localStorage.getItem('user')).toBeNull()
  })

  it('should return auth token when user is authenticated', () => {
    const mockUser = {
      name: 'Test User',
      email: 'test@example.com',
      avatar: 'https://avatar.url',
      accessToken: 'test-token-123'
    }
    localStorage.setItem('user', JSON.stringify(mockUser))

    const { token } = useAuth()
    expect(token.value).toBe('test-token-123')
  })

  it('should return null token when user is not authenticated', () => {
    const { token } = useAuth()
    expect(token.value).toBeNull()
  })
})
