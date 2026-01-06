<script setup lang="ts">
import {
  LayoutDashboard, FileText, FolderKanban,
  Briefcase, User, Link2, Wrench, Sparkles
} from 'lucide-vue-next'

interface NavItem {
  title: string
  href: string
  icon: any
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Posts', href: '/posts', icon: FileText },
  { title: 'Projects', href: '/projects', icon: FolderKanban },
  { title: 'Experiences', href: '/experiences', icon: Briefcase },
  { title: 'About', href: '/about', icon: User },
  { title: 'Social Links', href: '/social', icon: Link2 },
  { title: 'Technologies', href: '/techs', icon: Wrench },
  { title: 'AI Tools', href: '/ai', icon: Sparkles }
]

const route = useRoute()
</script>

<template>
  <aside class="hidden lg:flex flex-col w-64 border-r bg-muted/30 h-screen sticky top-0">
    <!-- Logo -->
    <div class="p-6 border-b">
      <NuxtLink to="/dashboard" class="flex items-center gap-2">
        <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span class="text-primary-foreground font-bold text-lg">P</span>
        </div>
        <span class="font-semibold text-lg">Portfolio Admin</span>
      </NuxtLink>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-4">
      <ul class="space-y-1">
        <li v-for="item in navItems" :key="item.href">
          <NuxtLink
            :to="item.href"
            class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
            :class="{
              'bg-primary text-primary-foreground': route.path.startsWith(item.href),
              'hover:bg-muted': !route.path.startsWith(item.href)
            }"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span>{{ item.title }}</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t text-sm text-muted-foreground">
      <p>Portfolio Admin v1.0.0</p>
    </div>
  </aside>
</template>
