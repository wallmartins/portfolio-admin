<script setup lang="ts">
import {
  FileText,
  FolderKanban,
  Wrench,
  Link2,
  Briefcase,
  User,
  Plus
} from 'lucide-vue-next'

const quickActions = [
  {
    title: 'New Post',
    description: 'Write a blog article',
    icon: FileText,
    href: '/posts/create'
  },
  {
    title: 'New Project',
    description: 'Add portfolio project',
    icon: FolderKanban,
    href: '/projects/create'
  },
  {
    title: 'Add Technology',
    description: 'Expand tech stack',
    icon: Wrench,
    href: '/techs/create'
  },
  {
    title: 'Add Experience',
    description: 'Record work history',
    icon: Briefcase,
    href: '/experiences/create'
  },
  {
    title: 'Add Social Link',
    description: 'Connect platform',
    icon: Link2,
    href: '/social/create'
  },
  {
    title: 'Update About',
    description: 'Edit profile section',
    icon: User,
    href: '/about/create'
  }
]
</script>

<template>
  <UiCard class="p-6">
    <h3 class="text-lg font-semibold mb-5 tracking-tight">Quick Actions</h3>
    <div class="grid gap-2.5 grid-cols-1 md:grid-cols-2">
      <NuxtLink
        v-for="action in quickActions"
        :key="action.href"
        :to="action.href"
        class="flex items-start gap-3 p-3.5 rounded-lg border border-border hover:border-primary/20 hover:bg-accent/50 transition-all group"
      >
        <div
          class="w-9 h-9 rounded-lg flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 shrink-0 transition-colors"
        >
          <component :is="action.icon" class="w-4 h-4 text-primary" />
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="font-medium text-sm group-hover:text-primary transition-colors">
            {{ action.title }}
          </h4>
          <p class="text-xs text-muted-foreground truncate mt-0.5">
            {{ action.description }}
          </p>
        </div>
        <Plus class="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      </NuxtLink>
    </div>
  </UiCard>
</template>
