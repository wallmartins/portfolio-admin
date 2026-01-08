<script setup lang="ts">
import Toaster from '~/components/ui/sonner/Sonner.vue'

// Initialize color mode on app mount
const { colorMode } = useColorMode()

// Apply theme class on mount
onMounted(() => {
  if (process.client) {
    const root = document.documentElement
    if (colorMode.value === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }
})
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toaster />
  </div>
</template>
