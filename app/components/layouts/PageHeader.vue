<script setup lang="ts">
interface Props {
  title: string
  description?: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex items-center justify-between mb-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">
        {{ title }}
      </h1>
      <p v-if="description" class="text-muted-foreground mt-2">
        {{ description }}
      </p>
    </div>

    <div class="flex items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
