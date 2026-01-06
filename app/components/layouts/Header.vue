<script setup lang="ts">
import { User, LogOut, Settings } from 'lucide-vue-next'

const { user, logout } = useAuth()

async function handleLogout() {
  await logout()
  navigateTo('/login')
}
</script>

<template>
  <header class="border-b bg-background sticky top-0 z-10">
    <div class="flex items-center justify-between h-16 px-6">
      <div class="flex items-center gap-4">
        <h1 class="text-xl font-semibold">
          <slot name="title">Dashboard</slot>
        </h1>
      </div>

      <div class="flex items-center gap-4">
        <!-- User Menu -->
        <UiDropdownMenu>
          <UiDropdownMenuTrigger as-child>
            <UiButton variant="ghost" size="icon" class="rounded-full">
              <img
                v-if="user?.avatar_url"
                :src="user.avatar_url"
                :alt="user.name"
                class="w-8 h-8 rounded-full"
              >
              <User v-else class="w-5 h-5" />
            </UiButton>
          </UiDropdownMenuTrigger>

          <UiDropdownMenuContent align="end" class="w-56">
            <div class="flex items-center gap-2 p-2">
              <div class="flex flex-col space-y-1">
                <p class="text-sm font-medium">{{ user?.name || 'User' }}</p>
                <p class="text-xs text-muted-foreground">{{ user?.email || '' }}</p>
              </div>
            </div>

            <UiDropdownMenuSeparator />

            <UiDropdownMenuItem as-child>
              <NuxtLink to="/settings" class="flex items-center gap-2 cursor-pointer">
                <Settings class="w-4 h-4" />
                <span>Settings</span>
              </NuxtLink>
            </UiDropdownMenuItem>

            <UiDropdownMenuSeparator />

            <UiDropdownMenuItem
              class="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
              @click="handleLogout"
            >
              <LogOut class="w-4 h-4" />
              <span>Logout</span>
            </UiDropdownMenuItem>
          </UiDropdownMenuContent>
        </UiDropdownMenu>
      </div>
    </div>
  </header>
</template>
