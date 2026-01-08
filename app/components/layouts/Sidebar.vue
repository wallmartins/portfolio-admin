<script setup lang="ts">
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  Briefcase,
  User,
  Link2,
  Wrench,
  Sparkles,
  ChevronDown,
  Settings,
  UserCircle
} from 'lucide-vue-next'

interface NavItem {
  title: string
  href: string
  icon: any
  iconColor?: string
  children?: NavItem[]
}

const route = useRoute()
const expandedSections = ref<string[]>(['content', 'settings'])

const toggleSection = (section: string) => {
  const index = expandedSections.value.indexOf(section)
  if (index > -1) {
    expandedSections.value.splice(index, 1)
  } else {
    expandedSections.value.push(section)
  }
}

const navItems: NavItem[] = [
  {
    title: 'Home',
    href: '/',
    icon: LayoutDashboard,
    iconColor: 'text-blue-600'
  },
  {
    title: 'Content',
    href: '',
    icon: FileText,
    iconColor: 'text-purple-600',
    children: [
      {
        title: 'Posts',
        href: '/posts',
        icon: FileText,
        iconColor: 'text-purple-600'
      },
      {
        title: 'Projects',
        href: '/projects',
        icon: FolderKanban,
        iconColor: 'text-purple-600'
      }
    ]
  },
  {
    title: 'Profile',
    href: '',
    icon: UserCircle,
    iconColor: 'text-teal-600',
    children: [
      {
        title: 'About',
        href: '/about',
        icon: User,
        iconColor: 'text-teal-600'
      },
      {
        title: 'Experiences',
        href: '/experiences',
        icon: Briefcase,
        iconColor: 'text-teal-600'
      }
    ]
  },
  {
    title: 'Settings',
    href: '',
    icon: Settings,
    iconColor: 'text-amber-600',
    children: [
      {
        title: 'Technologies',
        href: '/techs',
        icon: Wrench,
        iconColor: 'text-amber-600'
      },
      {
        title: 'Social Links',
        href: '/social',
        icon: Link2,
        iconColor: 'text-amber-600'
      }
    ]
  },
  {
    title: 'AI Tools',
    href: '/ai',
    icon: Sparkles,
    iconColor: 'text-pink-600'
  }
]
</script>

<template>
  <aside
    class="flex min-h-screen w-64 flex-shrink-0 flex-col overflow-y-auto border-r border-border/50 bg-card/50"
  >
    <!-- Brand Header -->
    <div class="flex h-16 items-center border-b border-border px-4">
      <div
        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-sm"
      >
        <span class="text-lg font-bold text-primary-foreground">P</span>
      </div>
      <span class="ml-3 font-bold text-foreground">Portfolio Admin</span>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 space-y-1 overflow-y-auto p-3">
      <template v-for="item in navItems" :key="item.title">
        <!-- Parent with children -->
        <div v-if="item.children">
          <button
            @click="toggleSection(item.title.toLowerCase())"
            class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent"
          >
            <component :is="item.icon" :class="['h-5 w-5', item.iconColor]" />
            <span class="flex-1 font-medium">{{ item.title }}</span>
            <ChevronDown
              :class="[
                'h-4 w-4 text-muted-foreground transition-transform',
                expandedSections.includes(item.title.toLowerCase())
                  ? 'rotate-180'
                  : ''
              ]"
            />
          </button>

          <!-- Children -->
          <div
            v-show="expandedSections.includes(item.title.toLowerCase())"
            class="ml-8 mt-1 space-y-0.5"
          >
            <NuxtLink
              v-for="child in item.children"
              :key="child.href"
              :to="child.href"
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
              :class="{
                'bg-primary font-medium text-primary-foreground':
                  route.path === child.href ||
                  (child.href !== '/' && route.path.startsWith(child.href)),
                'text-muted-foreground hover:bg-accent hover:text-foreground':
                  !(
                    route.path === child.href ||
                    (child.href !== '/' && route.path.startsWith(child.href))
                  )
              }"
            >
              <component
                :is="child.icon"
                :class="['h-4 w-4', child.iconColor]"
              />
              <span>{{ child.title }}</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Single item without children -->
        <NuxtLink
          v-else
          :to="item.href"
          class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors"
          :class="{
            'bg-primary font-medium text-primary-foreground shadow-sm':
              route.path === item.href,
            'text-muted-foreground hover:bg-accent hover:text-foreground':
              route.path !== item.href
          }"
        >
          <component :is="item.icon" :class="['h-5 w-5', item.iconColor]" />
          <span class="font-medium">{{ item.title }}</span>
        </NuxtLink>
      </template>
    </nav>

    <!-- Footer -->
    <div class="border-t border-border p-4">
      <p class="text-center text-xs text-muted-foreground">
        Running by
        <span class="font-semibold text-foreground">Portfolio Admin</span>
      </p>
    </div>
  </aside>
</template>
