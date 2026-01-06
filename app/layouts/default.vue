<template>
  <div class="min-h-screen bg-background">
    <div class="flex h-screen">
      <!-- Sidebar placeholder -->
      <aside class="w-64 border-r bg-card">
        <div class="p-4">
          <h2 class="text-lg font-semibold">Portfolio Admin</h2>
        </div>
        <nav class="space-y-1 p-2">
          <!-- Navigation will be added in later phases -->
        </nav>
      </aside>

      <!-- Main content -->
      <main class="flex-1 overflow-y-auto">
        <div class="container mx-auto p-6">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
