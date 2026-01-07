<script setup lang="ts">
import type { ExperienceFormData } from '~/schemas/experience.schema'
import type { Experience } from '~/types/api'

const route = useRoute()
const router = useRouter()
const { experiences, updateExperience, isLoading } = useExperiences()

const experienceId = computed(() => Number(route.params.id))

const experience = computed(() => {
  return experiences.value.find((e: Experience) => e.id === experienceId.value)
})

const handleSubmit = async (data: ExperienceFormData) => {
  await updateExperience.mutateAsync({
    id: experienceId.value,
    data: {
      locale: data.translations[0]?.locale || 'pt-BR',
      company: data.company,
      role: data.role,
      start_date: data.start_date,
      end_date: data.end_date,
      translations: data.translations
    }
  })
  router.push('/experiences')
}

const handleCancel = () => {
  router.push('/experiences')
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Edit Experience"
      description="Update professional experience information"
    />

    <LoadingSkeleton v-if="isLoading" />

    <UiAlert v-else-if="!experience" variant="destructive">
      <UiAlertTitle>Experience not found</UiAlertTitle>
      <UiAlertDescription>
        The experience you're looking for doesn't exist.
      </UiAlertDescription>
    </UiAlert>

    <UiCard v-else>
      <UiCardContent class="pt-6">
        <ExperienceForm
          :experience="experience"
          :is-loading="updateExperience.isPending.value"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </UiCardContent>
    </UiCard>
  </div>
</template>
