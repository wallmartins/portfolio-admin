<script setup lang="ts">
interface Props {
  rows?: number
  columns?: number
  type?: 'text' | 'card' | 'table'
}

const props = withDefaults(defineProps<Props>(), {
  rows: 3,
  columns: 1,
  type: 'text'
})
</script>

<template>
  <div class="space-y-4">
    <!-- Text Skeleton -->
    <div v-if="props.type === 'text'" class="space-y-3">
      <div v-for="i in props.rows" :key="i" class="space-y-2">
        <div class="h-4 bg-muted rounded animate-pulse" :style="{ width: `${Math.random() * 30 + 70}%` }" />
      </div>
    </div>

    <!-- Card Skeleton -->
    <div v-else-if="props.type === 'card'" class="grid gap-4" :class="`grid-cols-${props.columns}`">
      <div v-for="i in props.rows" :key="i" class="border rounded-lg p-4 space-y-3">
        <div class="h-4 bg-muted rounded animate-pulse w-3/4" />
        <div class="h-3 bg-muted rounded animate-pulse w-full" />
        <div class="h-3 bg-muted rounded animate-pulse w-5/6" />
      </div>
    </div>

    <!-- Table Skeleton -->
    <div v-else-if="props.type === 'table'" class="space-y-2">
      <div class="border rounded-lg">
        <div class="grid gap-4 p-4" :style="{ gridTemplateColumns: `repeat(${props.columns}, 1fr)` }">
          <div v-for="i in props.columns" :key="`header-${i}`" class="h-4 bg-muted rounded animate-pulse" />
        </div>
        <div v-for="row in props.rows" :key="row" class="grid gap-4 p-4 border-t" :style="{ gridTemplateColumns: `repeat(${props.columns}, 1fr)` }">
          <div v-for="col in props.columns" :key="`${row}-${col}`" class="h-4 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </div>
  </div>
</template>
