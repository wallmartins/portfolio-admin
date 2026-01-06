export const useApi = () => {
  const config = useRuntimeConfig()
  const auth = useAuth()

  // Create authenticated fetch instance
  const apiFetch = $fetch.create({
    baseURL: config.public.apiUrl,
    onRequest({ options }) {
      // Set default headers
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      }

      // Add auth token if available
      if (auth.token.value) {
        headers.Authorization = `Bearer ${auth.token.value}`
      }

      options.headers = {
        ...headers,
        ...options.headers
      }
    },
    onResponseError({ response }) {
      // Handle common errors
      if (response.status === 401) {
        auth.clearAuth()
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

  return {
    api: apiFetch
  }
}
