<script setup lang="ts">
import { Trash2, Download, X } from 'lucide-vue-next'

interface Props {
  selectedCount: number
  onDelete?: () => void
  onExport?: () => void
  onClear: () => void
}

const props = defineProps<Props>()
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-200 ease-out"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div
      v-if="selectedCount > 0"
      class="fixed top-4 left-1/2 -translate-x-1/2 z-[60] bg-card border border-border/50 rounded-lg shadow-lg px-4 py-3 flex items-center gap-4 min-w-[300px]"
    >
      <div class="flex-1 text-sm font-medium">
        {{ selectedCount }} {{ selectedCount === 1 ? 'item' : 'items' }} selected
      </div>

      <div class="flex items-center gap-2">
        <UiButton
          v-if="onExport"
          variant="outline"
          size="sm"
          @click="onExport"
        >
          <Download class="w-4 h-4 mr-2" />
          Export
        </UiButton>

        <UiButton
          v-if="onDelete"
          variant="destructive"
          size="sm"
          @click="onDelete"
        >
          <Trash2 class="w-4 h-4 mr-2" />
          Delete
        </UiButton>

        <UiButton
          variant="ghost"
          size="icon"
          @click="onClear"
          class="h-8 w-8"
        >
          <X class="w-4 h-4" />
        </UiButton>
      </div>
    </div>
  </Transition>
</template>
