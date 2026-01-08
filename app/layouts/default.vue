<script setup lang="ts">
// Import components explicitly to ensure they load
import Sidebar from '~/components/layouts/Sidebar.vue'
import Header from '~/components/layouts/Header.vue'
</script>

<template>
  <div class="fixed inset-0 flex min-h-screen w-screen flex-1 bg-background">
    <!-- Sidebar -->
    <Sidebar />

    <div class="h-screen w-full">
      <Header />
      <main class="flex-1 overflow-y-auto overflow-x-hidden">
        <div class="mx-auto max-w-[1400px] px-8 py-8">
          <slot />
        </div>
      </main>
    </div>
    <!-- Main content -->
  </div>
</template>
