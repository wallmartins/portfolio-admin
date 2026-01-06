<script setup lang="ts" generic="T extends { id: number; name: string }">
import { computed } from 'vue'
import { X, ChevronDown } from 'lucide-vue-next'

interface Props {
  modelValue: number[]
  options: T[]
  label?: string
  placeholder?: string
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select items...'
})

const emit = defineEmits<{
  'update:modelValue': [value: number[]]
}>()

const selectedItems = computed(() => {
  return props.options.filter(option => props.modelValue.includes(option.id))
})

const availableItems = computed(() => {
  return props.options.filter(option => !props.modelValue.includes(option.id))
})

function addItem(id: number) {
  emit('update:modelValue', [...props.modelValue, id])
}

function removeItem(id: number) {
  emit('update:modelValue', props.modelValue.filter(itemId => itemId !== id))
}
</script>

<template>
  <div class="space-y-2">
    <UiLabel v-if="props.label">
      {{ props.label }}
    </UiLabel>

    <div class="space-y-2">
      <!-- Selected items -->
      <div v-if="selectedItems.length > 0" class="flex flex-wrap gap-2">
        <UiBadge
          v-for="item in selectedItems"
          :key="item.id"
          variant="secondary"
          class="gap-1"
        >
          {{ item.name }}
          <button
            type="button"
            class="ml-1 hover:text-destructive"
            @click="removeItem(item.id)"
          >
            <X class="w-3 h-3" />
          </button>
        </UiBadge>
      </div>

      <!-- Dropdown to add items -->
      <UiDropdownMenu>
        <UiDropdownMenuTrigger as-child>
          <UiButton
            type="button"
            variant="outline"
            class="w-full justify-between"
            :disabled="availableItems.length === 0"
          >
            {{ availableItems.length > 0 ? props.placeholder : 'All items selected' }}
            <ChevronDown class="ml-2 h-4 w-4" />
          </UiButton>
        </UiDropdownMenuTrigger>

        <UiDropdownMenuContent class="w-full max-h-[300px] overflow-y-auto">
          <UiDropdownMenuItem
            v-for="item in availableItems"
            :key="item.id"
            @click="addItem(item.id)"
          >
            {{ item.name }}
          </UiDropdownMenuItem>
        </UiDropdownMenuContent>
      </UiDropdownMenu>
    </div>

    <p v-if="props.description" class="text-sm text-muted-foreground">
      {{ props.description }}
    </p>
  </div>
</template>
