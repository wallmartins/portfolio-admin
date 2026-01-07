<script setup lang="ts">
import type { Experience } from '~/types/api'
import { Briefcase } from 'lucide-vue-next'

interface Props {
  experiences: Experience[]
}

defineProps<Props>()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short'
  })
}

const getDateRange = (experience: Experience) => {
  const start = formatDate(experience.start_date)
  const end = experience.end_date ? formatDate(experience.end_date) : 'Present'
  return `${start} - ${end}`
}
</script>

<template>
  <div class="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:ml-[8.75rem] md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
    <div
      v-for="experience in experiences"
      :key="experience.id"
      class="relative"
    >
      <div class="md:flex items-center md:space-x-4 mb-3">
        <div class="flex items-center space-x-4 md:space-x-2 md:space-x-reverse">
          <!-- Icon -->
          <div class="flex items-center justify-center w-10 h-10 rounded-full bg-primary shadow md:order-1">
            <Briefcase class="w-5 h-5 text-primary-foreground" />
          </div>
          <!-- Date -->
          <time class="text-sm font-medium text-muted-foreground md:w-28">
            {{ getDateRange(experience) }}
          </time>
        </div>
        <!-- Title -->
        <div class="ml-14 md:ml-0">
          <h3 class="text-lg font-semibold">{{ experience.role }}</h3>
          <p class="text-sm text-muted-foreground">{{ experience.company }}</p>
        </div>
      </div>
      <!-- Description -->
      <div class="ml-14 md:ml-44 space-y-2">
        <div
          v-for="(translation, index) in experience.translations"
          :key="index"
          class="p-4 rounded-lg bg-muted/50"
        >
          <div class="flex items-center gap-2 mb-2">
            <UiBadge variant="outline" class="text-xs">
              {{ translation.locale }}
            </UiBadge>
          </div>
          <p class="text-sm">{{ translation.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
