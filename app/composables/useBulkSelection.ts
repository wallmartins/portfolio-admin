export function useBulkSelection<T extends { id: string | number }>() {
  const selectedIds = ref<Set<string | number>>(new Set())
  const isAllSelected = ref(false)

  const selectedCount = computed(() => selectedIds.value.size)
  const hasSelection = computed(() => selectedIds.value.size > 0)

  function toggleItem(id: string | number) {
    const newSet = new Set(selectedIds.value)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    selectedIds.value = newSet
    updateAllSelectedState()
  }

  function toggleAll(items: T[]) {
    if (isAllSelected.value) {
      selectedIds.value = new Set()
      isAllSelected.value = false
    } else {
      selectedIds.value = new Set(items.map(item => item.id))
      isAllSelected.value = true
    }
  }

  function clearSelection() {
    selectedIds.value = new Set()
    isAllSelected.value = false
  }

  function isSelected(id: string | number) {
    return selectedIds.value.has(id)
  }

  function updateAllSelectedState() {
    // This should be called when items change
    isAllSelected.value = false
  }

  function getSelectedIds() {
    return Array.from(selectedIds.value)
  }

  return {
    selectedIds: readonly(selectedIds),
    selectedCount,
    hasSelection,
    isAllSelected: readonly(isAllSelected),
    toggleItem,
    toggleAll,
    clearSelection,
    isSelected,
    getSelectedIds
  }
}
