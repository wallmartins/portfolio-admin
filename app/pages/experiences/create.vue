<script setup lang="ts">
import type { ExperienceFormData } from '~/schemas/experience.schema'

const router = useRouter()
const { createExperience } = useExperiences()

const handleSubmit = async (data: ExperienceFormData) => {
  await createExperience.mutateAsync(data)
  router.push('/experiences')
}

const handleCancel = () => {
  router.push('/experiences')
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Add Experience"
      description="Create a new professional experience entry"
    />

    <UiCard>
      <UiCardContent class="pt-6">
        <ExperienceForm
          :is-loading="createExperience.isPending.value"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </UiCardContent>
    </UiCard>
  </div>
</template>
