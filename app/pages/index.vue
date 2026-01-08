<script setup lang="ts">
import {
  FileText,
  FolderKanban,
  Wrench,
  Link2,
  Briefcase,
  User,
  TrendingUp,
  ArrowRight
} from 'lucide-vue-next'

definePageMeta({
  middleware: ['auth']
})

// Fetch ALL 6 resources
const { meta: postsMeta } = usePosts({ locale: 'pt-BR' })
const { meta: projectsMeta } = useProjects({ locale: 'pt-BR' })
const { techs } = useTechs()
const { socialLinks } = useSocial()
const { experiences } = useExperiences()
const { abouts } = useAbout()

// Inline stats
const stats = computed(() => [
  {
    label: 'Total Posts',
    value: `$${postsMeta.value?.total || 0}`,
    icon: TrendingUp,
    iconColor: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950'
  },
  {
    label: 'Total Projects',
    value: `$${projectsMeta.value?.total || 0}`,
    icon: TrendingUp,
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950'
  },
  {
    label: 'Page Views',
    value: '120 times',
    icon: TrendingUp,
    iconColor: 'text-amber-600',
    bgColor: 'bg-amber-50 dark:bg-amber-950'
  }
])
</script>

<template>
  <div class="min-h-screen space-y-6">
    <!-- Breadcrumbs -->
    <Breadcrumbs :items="[{ label: 'Home' }]" />

    <!-- Page Header -->
    <div class="space-y-1">
      <p class="text-sm text-muted-foreground">
        Account details overview and analytics
      </p>
    </div>

    <!-- Hero Section with CTA -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Large Blue CTA Card -->
      <UiCard
        class="border-0 bg-gradient-to-br from-primary via-primary to-blue-700 p-8 text-primary-foreground shadow-lg lg:col-span-2"
      >
        <div class="space-y-6">
          <div class="space-y-3">
            <h2 class="text-3xl font-bold">
              Let's create content for your amazing portfolio!
            </h2>
            <p class="max-w-md text-sm text-primary-foreground/90">
              Quisque venenatis vitae est ornare molestie elit urna
            </p>
          </div>
          <UiButton variant="secondary" size="lg" class="shadow-md">
            Go for it!
          </UiButton>
        </div>
      </UiCard>

      <!-- Recent Activity -->
      <UiCard class="p-6">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-sm font-semibold">Recent Activity</h3>
          <NuxtLink
            to="/posts/create"
            class="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            Create New
            <ArrowRight class="h-3 w-3" />
          </NuxtLink>
        </div>
        <div class="space-y-3">
          <div
            v-for="i in 3"
            :key="i"
            class="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent/50"
          >
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10"
            >
              <FileText class="h-5 w-5 text-primary" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium">New Post Created</p>
              <p class="text-xs text-muted-foreground">Today, 2:30 PM</p>
            </div>
          </div>
        </div>
      </UiCard>
    </div>

    <!-- Last Transaction Section -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold">Last Transaction</h2>
        <NuxtLink
          to="/posts"
          class="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          See Details
          <ArrowRight class="h-4 w-4" />
        </NuxtLink>
      </div>

      <!-- Stats Inline -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="flex items-center gap-4"
        >
          <div
            :class="[
              'flex h-12 w-12 items-center justify-center rounded-lg',
              stat.bgColor
            ]"
          >
            <component :is="stat.icon" :class="['h-6 w-6', stat.iconColor]" />
          </div>
          <div>
            <p class="text-2xl font-bold">{{ stat.value }}</p>
            <p class="text-xs uppercase tracking-wide text-muted-foreground">
              {{ stat.label }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid of Resources -->
    <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      <NuxtLink to="/posts" class="group">
        <UiCard
          class="cursor-pointer p-6 text-center transition-all hover:border-primary/20"
        >
          <div
            class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950"
          >
            <FileText class="h-6 w-6 text-purple-600" />
          </div>
          <p class="text-2xl font-bold">{{ postsMeta?.total || 0 }}</p>
          <p class="mt-1 text-xs text-muted-foreground">Posts</p>
        </UiCard>
      </NuxtLink>

      <NuxtLink to="/projects" class="group">
        <UiCard
          class="cursor-pointer p-6 text-center transition-all hover:border-primary/20"
        >
          <div
            class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950"
          >
            <FolderKanban class="h-6 w-6 text-blue-600" />
          </div>
          <p class="text-2xl font-bold">{{ projectsMeta?.total || 0 }}</p>
          <p class="mt-1 text-xs text-muted-foreground">Projects</p>
        </UiCard>
      </NuxtLink>

      <NuxtLink to="/techs" class="group">
        <UiCard
          class="cursor-pointer p-6 text-center transition-all hover:border-primary/20"
        >
          <div
            class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950"
          >
            <Wrench class="h-6 w-6 text-amber-600" />
          </div>
          <p class="text-2xl font-bold">{{ techs?.length || 0 }}</p>
          <p class="mt-1 text-xs text-muted-foreground">Technologies</p>
        </UiCard>
      </NuxtLink>

      <NuxtLink to="/experiences" class="group">
        <UiCard
          class="cursor-pointer p-6 text-center transition-all hover:border-primary/20"
        >
          <div
            class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950"
          >
            <Briefcase class="h-6 w-6 text-green-600" />
          </div>
          <p class="text-2xl font-bold">{{ experiences?.length || 0 }}</p>
          <p class="mt-1 text-xs text-muted-foreground">Experiences</p>
        </UiCard>
      </NuxtLink>

      <NuxtLink to="/social" class="group">
        <UiCard
          class="cursor-pointer p-6 text-center transition-all hover:border-primary/20"
        >
          <div
            class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-pink-50 dark:bg-pink-950"
          >
            <Link2 class="h-6 w-6 text-pink-600" />
          </div>
          <p class="text-2xl font-bold">{{ socialLinks?.length || 0 }}</p>
          <p class="mt-1 text-xs text-muted-foreground">Social</p>
        </UiCard>
      </NuxtLink>

      <NuxtLink to="/about" class="group">
        <UiCard
          class="cursor-pointer p-6 text-center transition-all hover:border-primary/20"
        >
          <div
            class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950"
          >
            <User class="h-6 w-6 text-teal-600" />
          </div>
          <p class="text-2xl font-bold">{{ abouts?.length || 0 }}</p>
          <p class="mt-1 text-xs text-muted-foreground">About</p>
        </UiCard>
      </NuxtLink>
    </div>
  </div>
</template>
