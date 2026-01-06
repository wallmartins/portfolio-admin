export default defineNuxtRouteMiddleware(() => {
  const { isAuthenticated } = useAuth()

  // Redirect to home if already authenticated
  if (isAuthenticated.value) {
    return navigateTo('/')
  }
})
