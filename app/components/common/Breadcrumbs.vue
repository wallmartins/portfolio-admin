<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'

interface BreadcrumbItem {
  label: string
  href?: string
}

defineProps<{
  items: BreadcrumbItem[]
}>()
</script>

<template>
  <nav class="flex items-center gap-2 text-sm mb-6">
    <template v-for="(item, index) in items" :key="index">
      <NuxtLink
        v-if="item.href"
        :to="item.href"
        class="text-muted-foreground hover:text-foreground transition-colors"
      >
        {{ item.label }}
      </NuxtLink>
      <span v-else class="font-medium text-foreground">
        {{ item.label }}
      </span>
      <ChevronRight v-if="index < items.length - 1" class="w-4 h-4 text-muted-foreground" />
    </template>
  </nav>
</template>
