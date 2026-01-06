<template>
  <div class="flex min-h-screen items-center justify-center bg-background">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle>Authenticating...</CardTitle>
        <CardDescription>
          Please wait while we complete your sign in
        </CardDescription>
      </CardHeader>
      <CardContent class="flex justify-center py-8">
        <div
          class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"
        ></div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '~/components/ui/card'

definePageMeta({
  layout: 'auth'
})

const route = useRoute()
const router = useRouter()
const { handleCallback } = useAuth()

onMounted(async () => {
  const code = route.query.code as string
  const state = route.query.state as string
  const error = route.query.error as string

  if (error) {
    console.error('OAuth error:', error)
    await router.push('/login?error=' + error)
    return
  }

  if (!code || !state) {
    console.error('Missing code or state')
    await router.push('/login?error=invalid_callback')
    return
  }

  try {
    await handleCallback(code, state)
    // handleCallback will redirect to home
  } catch (err) {
    console.error('Callback error:', err)
    await router.push('/login?error=auth_failed')
  }
})
</script>
