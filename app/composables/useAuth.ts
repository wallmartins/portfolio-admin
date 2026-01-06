import type { User } from '~/types/api'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthCallbackResponse {
  name: string
  email: string
  accessToken: string
  avatar: string
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

  // Login with GitHub OAuth - Redirect to backend API
  const loginWithGitHub = () => {
    // Store return URL for after auth
    if (import.meta.client) {
      localStorage.setItem('auth_return_url', window.location.pathname)
    }

    // Redirect to backend OAuth endpoint
    // Backend will redirect to GitHub, then handle callback
    window.location.href = `${config.public.apiUrl}/auth/github/redirect`
  }

  // Handle OAuth callback from backend
  const handleCallback = async (queryParams: URLSearchParams) => {
    try {
      // Extract auth data from URL hash or query params
      // Backend should redirect to /auth/callback with token data
      const authData = queryParams.get('auth_data')

      if (!authData) {
        throw new Error('No auth data received from backend')
      }

      // Parse auth response from backend
      const response: AuthCallbackResponse = JSON.parse(decodeURIComponent(authData))

      // Create user object
      const user: User = {
        id: 0, // Backend doesn't return ID in callback
        name: response.name,
        email: response.email,
        avatar_url: response.avatar
      }

      // Store auth data
      setAuth(response.accessToken, user)

      // Get return URL and redirect
      const returnUrl = localStorage.getItem('auth_return_url') || '/'
      localStorage.removeItem('auth_return_url')

      await router.push(returnUrl)

      return { token: response.accessToken, user }
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
      localStorage.removeItem('auth_return_url')
    }
  }

  // Logout
  const logout = async () => {
    clearAuth()
    await router.push('/login')
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
    setAuth,
    clearAuth
  }
}
