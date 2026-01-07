<script setup lang="ts">
import type { SocialFormData } from '~/schemas/social.schema'

const router = useRouter()
const { createSocial } = useSocial()

const handleSubmit = async (data: SocialFormData) => {
  await createSocial.mutateAsync(data)
  router.push('/social')
}

const handleCancel = () => {
  router.push('/social')
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Add Social Link"
      description="Add a new social media link"
    />

    <UiCard>
      <UiCardContent class="pt-6">
        <SocialForm
          :is-loading="createSocial.isPending.value"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </UiCardContent>
    </UiCard>
  </div>
</template>
