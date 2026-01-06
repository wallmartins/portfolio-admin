<script setup lang="ts">
import { FileQuestion } from 'lucide-vue-next'
import type { Component } from 'vue'

interface Props {
  title: string
  description?: string
  icon?: Component
  actionLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: FileQuestion
})

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center p-12 text-center">
    <div class="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
      <component :is="props.icon" class="w-8 h-8 text-muted-foreground" />
    </div>

    <h3 class="text-lg font-semibold mb-2">
      {{ props.title }}
    </h3>

    <p v-if="props.description" class="text-sm text-muted-foreground mb-6 max-w-md">
      {{ props.description }}
    </p>

    <UiButton v-if="props.actionLabel" @click="emit('action')">
      {{ props.actionLabel }}
    </UiButton>
  </div>
</template>
