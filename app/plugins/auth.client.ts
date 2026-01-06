export default defineNuxtPlugin(() => {
  const { initAuth } = useAuth()

  // Initialize auth on client side
  initAuth()
})
