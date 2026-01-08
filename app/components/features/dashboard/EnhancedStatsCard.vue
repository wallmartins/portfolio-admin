<script setup lang="ts">
import type { Component } from 'vue'
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-vue-next'

interface Props {
  title: string
  value: number | string
  icon: Component
  trend?: {
    value: number
    isPositive: boolean
  }
  description?: string
  color?: string
  href?: string
}

const props = defineProps<Props>()
</script>

<template>
  <component
    :is="href ? 'NuxtLink' : 'div'"
    :to="href"
    class="relative overflow-hidden bg-card border border-border rounded-xl shadow-custom-sm hover:shadow-custom-md hover:border-primary/20 p-6 transition-all cursor-pointer group"
  >
    <!-- Blue accent bar -->
    <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/50" />

    <!-- Icon - Blue tint -->
    <div class="flex items-start justify-between mb-6">
      <div
        class="w-12 h-12 rounded-lg flex items-center justify-center bg-primary/10 text-primary group-hover:bg-primary/20 transition-all"
      >
        <component :is="icon" class="w-6 h-6" />
      </div>
      <ArrowRight v-if="href" class="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>

    <!-- Value - Larger & Bold -->
    <div class="text-4xl font-bold tracking-tight mb-1.5">{{ value }}</div>

    <!-- Title - Subtle -->
    <div class="text-sm font-medium text-muted-foreground">{{ title }}</div>

    <!-- Trend & Description -->
    <div v-if="trend || description" class="flex items-center gap-3 mt-4 pt-4 border-t border-border">
      <div v-if="trend" class="flex items-center gap-1.5">
        <TrendingUp v-if="trend.isPositive" class="h-3.5 w-3.5 text-emerald-500" />
        <TrendingDown v-else class="h-3.5 w-3.5 text-red-500" />
        <span
          class="text-xs font-semibold"
          :class="trend.isPositive ? 'text-emerald-500' : 'text-red-500'"
        >
          {{ trend.value }}%
        </span>
      </div>
      <p v-if="description" class="text-xs text-muted-foreground flex-1">
        {{ description }}
      </p>
    </div>
  </component>
</template>
