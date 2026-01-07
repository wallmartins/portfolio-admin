<script setup lang="ts">
import type { Component } from 'vue'
import { TrendingUp, TrendingDown } from 'lucide-vue-next'

interface Props {
  title: string
  value: number | string
  icon: Component
  trend?: {
    value: number
    isPositive: boolean
  }
  description?: string
}

const props = defineProps<Props>()
</script>

<template>
  <UiCard>
    <UiCardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
      <UiCardTitle class="text-sm font-medium">{{ title }}</UiCardTitle>
      <component :is="icon" class="h-4 w-4 text-muted-foreground" />
    </UiCardHeader>
    <UiCardContent>
      <div class="text-2xl font-bold">{{ value }}</div>
      <div v-if="trend" class="flex items-center pt-1">
        <TrendingUp v-if="trend.isPositive" class="h-4 w-4 text-green-500 mr-1" />
        <TrendingDown v-else class="h-4 w-4 text-red-500 mr-1" />
        <span
          class="text-xs"
          :class="trend.isPositive ? 'text-green-500' : 'text-red-500'"
        >
          {{ trend.value }}%
        </span>
      </div>
      <p v-if="description" class="text-xs text-muted-foreground pt-1">
        {{ description }}
      </p>
    </UiCardContent>
  </UiCard>
</template>
