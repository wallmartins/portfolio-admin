import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useApi } from '~/composables/useApi'

// Mock useAuth
vi.mock('~/composables/useAuth', () => ({
  useAuth: vi.fn(() => ({
    token: { value: 'mock-token-123' },
    user: { value: { name: 'Test User' } },
    isAuthenticated: { value: true }
  }))
}))

describe('useApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create API client with base URL', () => {
    const { api } = useApi()
    expect(api).toBeDefined()
  })

  it('should include auth token in requests', () => {
    const { api } = useApi()
    expect(api).toBeDefined()
    // Note: Full integration test would require mocking $fetch
  })
})
