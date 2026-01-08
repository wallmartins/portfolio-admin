<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'

const { colorMode, toggleColorMode } = useColorMode()
</script>

<template>
  <UiButton
    variant="ghost"
    size="icon"
    @click="toggleColorMode"
    class="relative overflow-hidden"
    aria-label="Toggle theme"
  >
    <Transition name="rotate-fade" mode="out-in">
      <Sun v-if="colorMode === 'light'" :key="'sun'" class="h-5 w-5" />
      <Moon v-else :key="'moon'" class="h-5 w-5" />
    </Transition>
  </UiButton>
</template>

<style scoped>
.rotate-fade-enter-active,
.rotate-fade-leave-active {
  transition: all 0.3s ease;
}

.rotate-fade-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.8);
}

.rotate-fade-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.8);
}
</style>
