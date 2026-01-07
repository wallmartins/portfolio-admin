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

// Helper to check if we're on client side (can be mocked in tests)
export const isClient = () => {
  return import.meta.client || typeof window !== 'undefined'
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
    if (isClient()) {
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

  // Login with GitHub OAuth - Open popup window
  const loginWithGitHub = () => {
    return new Promise<{ token: string; user: User }>((resolve, reject) => {
      // Open OAuth in popup window
      const width = 600
      const height = 700
      const left = (window.screen.width - width) / 2
      const top = (window.screen.height - height) / 2

      const popup = window.open(
        `${config.public.apiUrl}/auth/github/redirect`,
        'GitHub OAuth',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
      )

      if (!popup) {
        reject(new Error('Failed to open popup. Please allow popups for this site.'))
        return
      }

      // Listen for message from popup
      const handleMessage = (event: MessageEvent) => {
        // Verify origin - extract base URL from config
        const apiOrigin = new URL(config.public.apiUrl).origin

        if (event.origin !== apiOrigin) {
          return
        }

        // Check if it's our auth success message
        if (event.data?.type === 'AUTH_SUCCESS') {
          window.removeEventListener('message', handleMessage)

          const authData = event.data.data as AuthCallbackResponse

          // Create user object
          const user: User = {
            id: 0,
            name: authData.name,
            email: authData.email,
            avatar_url: authData.avatar
          }

          // Store auth data
          setAuth(authData.accessToken, user)

          resolve({ token: authData.accessToken, user })
        }
      }

      window.addEventListener('message', handleMessage)

      // Check if popup was closed without completing auth
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed)
          window.removeEventListener('message', handleMessage)
          reject(new Error('Authentication cancelled'))
        }
      }, 1000)
    })
  }

  // Set authentication data
  const setAuth = (token: string, user: User) => {
    authState.value = {
      token,
      user,
      isAuthenticated: true,
      isLoading: false
    }

    if (isClient()) {
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

    if (isClient()) {
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
    logout,
    setAuth,
    clearAuth
  }
}
