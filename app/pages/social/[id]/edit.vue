<script setup lang="ts">
import type { SocialFormData } from '~/schemas/social.schema'
import type { Social } from '~/types/api'

const route = useRoute()
const router = useRouter()
const { socialLinks, updateSocial, isLoading } = useSocial()

const socialId = computed(() => Number(route.params.id))

const social = computed(() => {
  return socialLinks.value.find((s: Social) => s.id === socialId.value)
})

const handleSubmit = async (data: SocialFormData) => {
  await updateSocial.mutateAsync({
    id: socialId.value,
    data
  })
  router.push('/social')
}

const handleCancel = () => {
  router.push('/social')
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Edit Social Link"
      description="Update social media link information"
    />

    <LoadingSkeleton v-if="isLoading" />

    <UiAlert v-else-if="!social" variant="destructive">
      <UiAlertTitle>Social link not found</UiAlertTitle>
      <UiAlertDescription>
        The social media link you're looking for doesn't exist.
      </UiAlertDescription>
    </UiAlert>

    <UiCard v-else>
      <UiCardContent class="pt-6">
        <SocialForm
          :social="social"
          :is-loading="updateSocial.isPending.value"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </UiCardContent>
    </UiCard>
  </div>
</template>
