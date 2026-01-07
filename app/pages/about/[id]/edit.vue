<script setup lang="ts">
import type { AboutFormData } from '~/schemas/about.schema'
import type { About } from '~/types/api'

const route = useRoute()
const router = useRouter()
const { abouts, updateAbout, isLoading } = useAbout()

const aboutId = computed(() => Number(route.params.id))

const about = computed(() => {
  return abouts.value.find((a: About) => a.id === aboutId.value)
})

const handleSubmit = async (data: AboutFormData) => {
  await updateAbout.mutateAsync({
    id: aboutId.value,
    data
  })
  router.push('/about')
}

const handleCancel = () => {
  router.push('/about')
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Edit About Entry"
      description="Update about information"
    />

    <LoadingSkeleton v-if="isLoading" />

    <UiAlert v-else-if="!about" variant="destructive">
      <UiAlertTitle>About entry not found</UiAlertTitle>
      <UiAlertDescription>
        The about entry you're looking for doesn't exist.
      </UiAlertDescription>
    </UiAlert>

    <UiCard v-else>
      <UiCardContent class="pt-6">
        <AboutForm
          :about="about"
          :is-loading="updateAbout.isPending.value"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </UiCardContent>
    </UiCard>
  </div>
</template>
