<script setup lang="ts">
import { User, LogOut } from 'lucide-vue-next'
import ThemeToggle from '~/components/ui/ThemeToggle.vue'

const { user, logout } = useAuth()

async function handleLogout() {
  await logout()
  navigateTo('/login')
}
</script>

<template>
  <header
    class="h-16 flex-shrink-0 border-b border-border/50 bg-card/50 backdrop-blur-sm"
  >
    <div class="flex h-full items-center justify-between px-6">
      <!-- Left: User Info -->
      <div class="flex items-center gap-3">
        <img
          v-if="user?.avatar_url"
          :src="user.avatar_url"
          :alt="user.name"
          class="h-9 w-9 rounded-full object-cover"
        />
        <div
          v-else
          class="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10"
        >
          <User class="h-5 w-5 text-primary" />
        </div>
        <div>
          <p class="text-sm font-semibold">{{ user?.name || 'User' }}</p>
          <p class="text-xs text-muted-foreground">
            {{ user?.email || 'user@example.com' }}
          </p>
        </div>
      </div>

      <!-- Right: Theme Toggle + Logout Button -->
      <div class="flex items-center gap-2">
        <!-- Theme Toggle -->
        <ThemeToggle />

        <!-- Logout Button (Icon Only) -->
        <UiButton
          variant="ghost"
          size="icon"
          @click="handleLogout"
          title="Logout"
        >
          <LogOut class="h-4 w-4" />
        </UiButton>
      </div>
    </div>
  </header>
</template>
