<template>
  <div class="flex min-h-screen items-center justify-center bg-background">
    <UiCard class="w-full max-w-md">
      <UiCardHeader>
        <UiCardTitle>{{ title }}</UiCardTitle>
        <UiCardDescription>
          {{ description }}
        </UiCardDescription>
      </UiCardHeader>
      <UiCardContent class="flex justify-center py-8">
        <div v-if="isProcessing" class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <UiAlert v-else-if="error" variant="destructive">
          <UiAlertDescription>
            {{ error }}
          </UiAlertDescription>
        </UiAlert>
      </UiCardContent>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: [] // Bypass auth middleware for callback page
})

const route = useRoute()
const router = useRouter()
const { handleCallback } = useAuth()

const isProcessing = ref(true)
const error = ref('')
const title = ref('Authenticating...')
const description = ref('Please wait while we complete your sign in')

onMounted(async () => {
  // Check for error in query params
  if (route.query.error) {
    error.value = `Authentication failed: ${route.query.error}`
    isProcessing.value = false
    title.value = 'Authentication Error'
    description.value = 'There was a problem signing you in'

    setTimeout(() => {
      router.push('/login')
    }, 3000)
    return
  }

  try {
    // Pass URLSearchParams to handleCallback
    const queryParams = new URLSearchParams(window.location.search)
    await handleCallback(queryParams)
    // handleCallback will redirect to home or return URL
  } catch (err: any) {
    console.error('Callback error:', err)
    error.value = err.message || 'Failed to complete authentication'
    isProcessing.value = false
    title.value = 'Authentication Error'
    description.value = 'There was a problem signing you in'

    setTimeout(() => {
      router.push('/login')
    }, 3000)
  }
})
</script>
