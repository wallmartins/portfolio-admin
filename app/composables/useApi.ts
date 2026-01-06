import type { UseFetchOptions } from 'nuxt/app'

export const useApi = () => {
  const config = useRuntimeConfig()
  const { token } = useAuth()

  // Create authenticated fetch instance
  const apiFetch = $fetch.create({
    baseURL: config.public.apiUrl,
    headers: {
      'Content-Type': 'application/json'
    },
    onRequest({ options }) {
      // Add auth token if available
      if (token.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token.value}`
        }
      }
    },
    onResponseError({ response }) {
      // Handle common errors
      if (response.status === 401) {
        const { clearAuth } = useAuth()
        clearAuth()
        navigateTo('/login')
      }

      if (response.status === 403) {
        console.error('Forbidden:', response._data)
      }

      if (response.status === 404) {
        console.error('Not found:', response._data)
      }

      if (response.status >= 500) {
        console.error('Server error:', response._data)
      }
    }
  })

  // Wrapper for useFetch with auth
  const useApiFetch = <T>(url: string, options?: UseFetchOptions<T>) => {
    return useFetch<T>(url, {
      ...options,
      baseURL: config.public.apiUrl,
      headers: {
        ...options?.headers,
        ...(token.value ? { Authorization: `Bearer ${token.value}` } : {})
      },
      watch: [token],
      onResponseError({ response }) {
        if (response.status === 401) {
          const { clearAuth } = useAuth()
          clearAuth()
          navigateTo('/login')
        }
      }
    })
  }

  return {
    api: apiFetch,
    useApiFetch
  }
}
