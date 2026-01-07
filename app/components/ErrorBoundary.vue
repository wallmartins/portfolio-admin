<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

interface ErrorInfo {
  message: string
  stack?: string
  timestamp: Date
}

const error = ref<ErrorInfo | null>(null)
const hasError = ref(false)

onErrorCaptured((err, _instance, info) => {
  console.error('ErrorBoundary caught error:', err, info)

  error.value = {
    message: err.message || 'An unexpected error occurred',
    stack: err.stack,
    timestamp: new Date()
  }
  hasError.value = true

  // Prevent error from propagating
  return false
})

const resetError = () => {
  error.value = null
  hasError.value = false
}

const reloadPage = () => {
  window.location.reload()
}
</script>

<template>
  <div v-if="hasError" class="min-h-screen flex items-center justify-center p-4 bg-background">
    <UiCard class="max-w-2xl w-full">
      <UiCardHeader>
        <div class="flex items-center gap-3">
          <div class="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <UiCardTitle>Something went wrong</UiCardTitle>
            <UiCardDescription>An error occurred while rendering this component</UiCardDescription>
          </div>
        </div>
      </UiCardHeader>
      <UiCardContent class="space-y-4">
        <div class="rounded-lg bg-muted p-4">
          <p class="font-mono text-sm text-muted-foreground break-words">
            {{ error?.message }}
          </p>
        </div>

        <details v-if="error?.stack" class="group">
          <summary class="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
            Show error details
          </summary>
          <pre class="mt-2 rounded-lg bg-muted p-4 text-xs overflow-x-auto">{{ error.stack }}</pre>
        </details>

        <div class="flex gap-3">
          <UiButton @click="resetError" variant="outline">
            Try Again
          </UiButton>
          <UiButton @click="reloadPage" variant="default">
            Reload Page
          </UiButton>
        </div>
      </UiCardContent>
    </UiCard>
  </div>
  <slot v-else />
</template>
