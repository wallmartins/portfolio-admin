<template>
  <div class="flex min-h-screen items-center justify-center bg-background">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle>{{ title }}</CardTitle>
        <CardDescription>
          {{ description }}
        </CardDescription>
      </CardHeader>
      <CardContent class="flex justify-center py-8">
        <Alert v-if="error" variant="destructive">
          <AlertDescription>
            {{ error }}
          </AlertDescription>
        </Alert>
        <p v-else class="text-muted-foreground">Redirecting to home page...</p>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card'
import { Alert, AlertDescription } from '~/components/ui/alert'

definePageMeta({
  layout: 'auth',
  middleware: [] // Bypass auth middleware for callback page
})

const route = useRoute()
const router = useRouter()

const error = ref('')
const title = ref('OAuth Callback')
const description = ref('This page is not used in the current authentication flow')

onMounted(() => {
  // Check for error in query params (from OAuth provider)
  if (route.query.error) {
    error.value = `Authentication failed: ${route.query.error}`
    title.value = 'Authentication Error'
    description.value = 'There was a problem signing you in'

    setTimeout(() => {
      router.push('/login')
    }, 3000)
    return
  }

  // No error, redirect to home (backend handles auth via session)
  setTimeout(() => {
    router.push('/')
  }, 1000)
})
</script>
