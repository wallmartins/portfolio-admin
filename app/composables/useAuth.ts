import type { AuthResponse, User } from '~/types/api'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export const useAuth = () => {
  const config = useRuntimeConfig()
  const router = useRouter()

  // State
  const authState = useState<AuthState>('auth', () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true
  }))

  // Initialize auth from localStorage on client side
  const initAuth = () => {
    if (import.meta.client) {
      const token = localStorage.getItem('auth_token')
      const userStr = localStorage.getItem('auth_user')

      if (token && userStr) {
        try {
          authState.value = {
            token,
            user: JSON.parse(userStr),
            isAuthenticated: true,
            isLoading: false
          }
        } catch (error) {
          console.error('Failed to parse user data:', error)
          clearAuth()
        }
      } else {
        authState.value.isLoading = false
      }
    }
  }

  // Login with GitHub OAuth
  const loginWithGitHub = () => {
    const githubClientId = config.public.githubClientId
    const redirectUri = `${window.location.origin}/auth/callback`
    const state = Math.random().toString(36).substring(7)

    // Store state for verification
    localStorage.setItem('oauth_state', state)

    // Redirect to GitHub OAuth
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&state=${state}&scope=user:email`
    window.location.href = authUrl
  }

  // Handle OAuth callback
  const handleCallback = async (code: string, state: string) => {
    try {
      // Verify state
      const storedState = localStorage.getItem('oauth_state')
      if (state !== storedState) {
        throw new Error('Invalid state parameter')
      }

      // Exchange code for token via backend
      const response = await $fetch<AuthResponse>('/api/auth/github-callback', {
        method: 'POST',
        body: { code }
      })

      // Store auth data
      setAuth(response.token, response.user)

      // Clean up
      localStorage.removeItem('oauth_state')

      // Redirect to dashboard
      await router.push('/')

      return response
    } catch (error) {
      console.error('Auth callback error:', error)
      clearAuth()
      throw error
    }
  }

  // Set authentication data
  const setAuth = (token: string, user: User) => {
    authState.value = {
      token,
      user,
      isAuthenticated: true,
      isLoading: false
    }

    if (import.meta.client) {
      localStorage.setItem('auth_token', token)
      localStorage.setItem('auth_user', JSON.stringify(user))
    }
  }

  // Clear authentication
  const clearAuth = () => {
    authState.value = {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false
    }

    if (import.meta.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      localStorage.removeItem('oauth_state')
    }
  }

  // Logout
  const logout = async () => {
    clearAuth()
    await router.push('/login')
  }

  // Refresh user data
  const refreshUser = async () => {
    try {
      if (!authState.value.token) return

      const user = await $fetch<User>('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${authState.value.token}`
        }
      })

      authState.value.user = user
      if (import.meta.client) {
        localStorage.setItem('auth_user', JSON.stringify(user))
      }

      return user
    } catch (error) {
      console.error('Failed to refresh user:', error)
      clearAuth()
      throw error
    }
  }

  return {
    // State
    user: computed(() => authState.value.user),
    token: computed(() => authState.value.token),
    isAuthenticated: computed(() => authState.value.isAuthenticated),
    isLoading: computed(() => authState.value.isLoading),

    // Methods
    initAuth,
    loginWithGitHub,
    handleCallback,
    logout,
    refreshUser,
    setAuth,
    clearAuth
  }
}
