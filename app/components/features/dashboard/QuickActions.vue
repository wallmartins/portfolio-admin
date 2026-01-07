<script setup lang="ts">
import { FileText, FolderKanban, Wrench, Link2 } from 'lucide-vue-next'

const quickActions = [
  {
    title: 'New Post',
    description: 'Create a new blog post',
    icon: FileText,
    href: '/posts/create',
    color: 'bg-blue-500'
  },
  {
    title: 'New Project',
    description: 'Add a portfolio project',
    icon: FolderKanban,
    href: '/projects/create',
    color: 'bg-green-500'
  },
  {
    title: 'Add Technology',
    description: 'Add a new tech to stack',
    icon: Wrench,
    href: '/techs/create',
    color: 'bg-purple-500'
  },
  {
    title: 'Add Social Link',
    description: 'Add a social media link',
    icon: Link2,
    href: '/social/create',
    color: 'bg-orange-500'
  }
]
</script>

<template>
  <UiCard>
    <UiCardHeader>
      <UiCardTitle>Quick Actions</UiCardTitle>
      <UiCardDescription>Common tasks to get you started</UiCardDescription>
    </UiCardHeader>
    <UiCardContent>
      <div class="grid gap-4 md:grid-cols-2">
        <NuxtLink
          v-for="action in quickActions"
          :key="action.href"
          :to="action.href"
          class="flex items-start gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
        >
          <div :class="[action.color, 'rounded-lg p-2 text-white']">
            <component :is="action.icon" class="h-5 w-5" />
          </div>
          <div class="flex-1">
            <h3 class="font-semibold">{{ action.title }}</h3>
            <p class="text-sm text-muted-foreground">{{ action.description }}</p>
          </div>
        </NuxtLink>
      </div>
    </UiCardContent>
  </UiCard>
</template>
