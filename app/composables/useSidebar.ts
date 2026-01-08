export function useSidebar() {
  const isCollapsed = useState<boolean>('sidebar-collapsed', () => {
    // Initialize from localStorage on client-side only
    if (process.client) {
      const stored = localStorage.getItem('portfolio-admin-sidebar-collapsed')
      if (stored !== null) {
        return stored === 'true'
      }
    }
    return false
  })

  function toggleSidebar() {
    isCollapsed.value = !isCollapsed.value
    if (process.client) {
      localStorage.setItem('portfolio-admin-sidebar-collapsed', String(isCollapsed.value))
    }
  }

  function collapseSidebar() {
    isCollapsed.value = true
    if (process.client) {
      localStorage.setItem('portfolio-admin-sidebar-collapsed', 'true')
    }
  }

  function expandSidebar() {
    isCollapsed.value = false
    if (process.client) {
      localStorage.setItem('portfolio-admin-sidebar-collapsed', 'false')
    }
  }

  return {
    isCollapsed: readonly(isCollapsed),
    toggleSidebar,
    collapseSidebar,
    expandSidebar
  }
}
