export function useColorMode() {
  const colorMode = useState<'light' | 'dark'>('color-mode', () => {
    // Initialize from localStorage on client-side only
    if (process.client) {
      const stored = localStorage.getItem('portfolio-admin-theme')
      if (stored === 'dark' || stored === 'light') {
        return stored
      }
    }
    // Default to dark mode
    return 'dark'
  })

  function applyTheme(theme: 'light' | 'dark') {
    if (!process.client) return
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  function toggleColorMode() {
    const newMode = colorMode.value === 'light' ? 'dark' : 'light'
    colorMode.value = newMode
    if (process.client) {
      localStorage.setItem('portfolio-admin-theme', newMode)
    }
    applyTheme(newMode)
  }

  // Apply theme on client side
  if (process.client) {
    watch(colorMode, (newMode) => {
      applyTheme(newMode)
    }, { immediate: true })
  }

  return {
    colorMode: readonly(colorMode),
    toggleColorMode
  }
}
