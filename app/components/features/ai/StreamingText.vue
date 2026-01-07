<script setup lang="ts">
interface Props {
  text: string
  isStreaming?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isStreaming: false
})
</script>

<template>
  <div class="relative">
    <div class="prose prose-sm max-w-none p-4 bg-muted/50 rounded-lg border">
      <p class="whitespace-pre-wrap">{{ text }}</p>
      <span v-if="isStreaming" class="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />
    </div>
  </div>
</template>
