export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated, isLoading } = useAuth()

  // Don't redirect while checking auth state
  if (isLoading.value) {
    return
  }

  // Public routes that don't require authentication
  const publicRoutes = ['/login']
  const isPublicRoute = publicRoutes.some(route => to.path.startsWith(route))

  // Redirect to login if not authenticated and trying to access protected route
  if (!isAuthenticated.value && !isPublicRoute) {
    return navigateTo('/login')
  }

  // Redirect to home if authenticated and trying to access public route
  if (isAuthenticated.value && isPublicRoute) {
    return navigateTo('/')
  }
})
