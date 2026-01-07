<script setup lang="ts">
import { FileText, FolderKanban, Wrench, Link2, User, Calendar } from 'lucide-vue-next'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Activity {
  id: string
  type: 'post' | 'project' | 'tech' | 'social' | 'experience' | 'about'
  action: 'created' | 'updated' | 'deleted'
  title: string
  timestamp: Date
}

interface Props {
  activities?: Activity[]
  maxItems?: number
}

const props = withDefaults(defineProps<Props>(), {
  activities: () => [],
  maxItems: 10
})

const iconMap = {
  post: FileText,
  project: FolderKanban,
  tech: Wrench,
  social: Link2,
  experience: Calendar,
  about: User
}

const colorMap = {
  created: 'text-green-500',
  updated: 'text-blue-500',
  deleted: 'text-red-500'
}

const getRelativeTime = (date: Date) => {
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: ptBR
  })
}

const displayedActivities = computed(() =>
  props.activities.slice(0, props.maxItems)
)
</script>

<template>
  <UiCard>
    <UiCardHeader>
      <UiCardTitle>Recent Activity</UiCardTitle>
      <UiCardDescription>Latest changes to your portfolio</UiCardDescription>
    </UiCardHeader>
    <UiCardContent>
      <div v-if="displayedActivities.length === 0" class="text-center py-8 text-muted-foreground">
        <p>No recent activity</p>
        <p class="text-sm mt-1">Start by creating content</p>
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="activity in displayedActivities"
          :key="activity.id"
          class="flex items-start gap-4 pb-4 last:pb-0 border-b last:border-0"
        >
          <div class="rounded-lg bg-muted p-2">
            <component :is="iconMap[activity.type]" class="h-4 w-4" />
          </div>
          <div class="flex-1 space-y-1">
            <p class="text-sm">
              <span :class="colorMap[activity.action]" class="font-medium capitalize">
                {{ activity.action }}
              </span>
              <span class="text-muted-foreground"> {{ activity.type }}: </span>
              <span class="font-medium">{{ activity.title }}</span>
            </p>
            <p class="text-xs text-muted-foreground">
              {{ getRelativeTime(activity.timestamp) }}
            </p>
          </div>
        </div>
      </div>
    </UiCardContent>
  </UiCard>
</template>
