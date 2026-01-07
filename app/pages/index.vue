<script setup lang="ts">
import { FileText, FolderKanban, Wrench, Link2 } from 'lucide-vue-next'

definePageMeta({
  middleware: ['auth']
})

// Fetch data from composables
const { posts, meta: postsMeta, isLoading: postsLoading } = usePosts({ locale: 'pt-BR' })
const { projects, meta: projectsMeta, isLoading: projectsLoading } = useProjects({ locale: 'pt-BR' })
const { techs, isLoading: techsLoading } = useTechs()
const { socialLinks, isLoading: socialsLoading } = useSocial()

// Calculate stats
const stats = computed(() => [
  {
    title: 'Total Posts',
    value: postsMeta.value?.total || 0,
    icon: FileText,
    description: 'Published blog posts',
    trend: {
      value: 12,
      isPositive: true
    }
  },
  {
    title: 'Total Projects',
    value: projectsMeta.value?.total || 0,
    icon: FolderKanban,
    description: 'Portfolio projects',
    trend: {
      value: 8,
      isPositive: true
    }
  },
  {
    title: 'Technologies',
    value: techs.value?.length || 0,
    icon: Wrench,
    description: 'Tech stack items'
  },
  {
    title: 'Social Links',
    value: socialLinks.value?.length || 0,
    icon: Link2,
    description: 'Connected platforms'
  }
])

// Mock activity data (since we don't have a real activity endpoint)
const recentActivities = computed(() => {
  const activities: any[] = []

  // Add recent posts
  posts.value?.slice(0, 3).forEach((post: any) => {
    activities.push({
      id: `post-${post.id}`,
      type: 'post',
      action: 'created',
      title: post.title || 'Untitled Post',
      timestamp: new Date(post.created_at || Date.now())
    })
  })

  // Add recent projects
  projects.value?.slice(0, 2).forEach((project: any) => {
    activities.push({
      id: `project-${project.id}`,
      type: 'project',
      action: 'created',
      title: project.name || 'Untitled Project',
      timestamp: new Date(project.created_at || Date.now())
    })
  })

  // Sort by timestamp descending
  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
})

const isLoading = computed(() =>
  postsLoading.value || projectsLoading.value || techsLoading.value || socialsLoading.value
)
</script>

<template>
  <div class="container mx-auto py-8 px-4 space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p class="text-muted-foreground mt-2">
        Welcome back! Here's an overview of your portfolio.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <UiCard v-for="i in 4" :key="i" class="animate-pulse">
        <UiCardHeader class="space-y-0 pb-2">
          <div class="h-4 w-24 bg-muted rounded"></div>
        </UiCardHeader>
        <UiCardContent>
          <div class="h-8 w-16 bg-muted rounded"></div>
        </UiCardContent>
      </UiCard>
    </div>

    <!-- Stats Cards -->
    <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        v-for="stat in stats"
        :key="stat.title"
        :title="stat.title"
        :value="stat.value"
        :icon="stat.icon"
        :description="stat.description"
        :trend="stat.trend"
      />
    </div>

    <!-- Main Content Grid -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Quick Actions -->
      <QuickActions />

      <!-- Recent Activity -->
      <ActivityFeed :activities="recentActivities" :max-items="5" />
    </div>

    <!-- Recent Posts Preview -->
    <div v-if="posts.length > 0" class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold tracking-tight">Recent Posts</h2>
        <NuxtLink to="/posts" class="text-sm text-primary hover:underline">
          View all
        </NuxtLink>
      </div>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="post in posts.slice(0, 3)"
          :key="post.id"
          :to="`/posts/${post.id}/edit`"
          class="group"
        >
          <UiCard class="hover:shadow-md transition-shadow">
            <UiCardHeader>
              <UiCardTitle class="line-clamp-2 group-hover:text-primary transition-colors">
                {{ post.title || 'Untitled Post' }}
              </UiCardTitle>
              <UiCardDescription class="line-clamp-2">
                {{ post.subtitle || 'No subtitle' }}
              </UiCardDescription>
            </UiCardHeader>
            <UiCardContent>
              <div class="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText class="h-4 w-4" />
                <span>{{ post.slug }}</span>
              </div>
            </UiCardContent>
          </UiCard>
        </NuxtLink>
      </div>
    </div>

    <!-- Recent Projects Preview -->
    <div v-if="projects.length > 0" class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold tracking-tight">Recent Projects</h2>
        <NuxtLink to="/projects" class="text-sm text-primary hover:underline">
          View all
        </NuxtLink>
      </div>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="project in projects.slice(0, 3)"
          :key="project.id"
          :to="`/projects/${project.id}/edit`"
          class="group"
        >
          <UiCard class="hover:shadow-md transition-shadow">
            <UiCardHeader>
              <UiCardTitle class="line-clamp-2 group-hover:text-primary transition-colors">
                {{ project.name || 'Untitled Project' }}
              </UiCardTitle>
              <UiCardDescription class="line-clamp-2">
                {{ project.title || 'No description' }}
              </UiCardDescription>
            </UiCardHeader>
            <UiCardContent>
              <div class="flex items-center gap-2 text-sm text-muted-foreground">
                <FolderKanban class="h-4 w-4" />
                <span>{{ project.slug }}</span>
              </div>
            </UiCardContent>
          </UiCard>
        </NuxtLink>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="!isLoading && posts.length === 0 && projects.length === 0"
      class="text-center py-12 space-y-4"
    >
      <div class="text-6xl">📝</div>
      <h3 class="text-xl font-semibold">Start creating content</h3>
      <p class="text-muted-foreground max-w-md mx-auto">
        Your portfolio is empty. Create your first post or project to get started.
      </p>
      <div class="flex items-center justify-center gap-4 pt-4">
        <NuxtLink to="/posts/create">
          <UiButton>
            <FileText class="mr-2 h-4 w-4" />
            Create Post
          </UiButton>
        </NuxtLink>
        <NuxtLink to="/projects/create">
          <UiButton variant="outline">
            <FolderKanban class="mr-2 h-4 w-4" />
            Create Project
          </UiButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
