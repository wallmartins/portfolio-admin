<script setup lang="ts">
import type { TechFormData } from '~/schemas/tech.schema'
import type { Tech } from '~/types/api'

const route = useRoute()
const router = useRouter()
const { techs, updateTech, isLoading } = useTechs()

const techId = computed(() => Number(route.params.id))

const tech = computed(() => {
  return techs.value.find((t: Tech) => t.id === techId.value)
})

const handleSubmit = async (data: TechFormData) => {
  await updateTech.mutateAsync({
    id: techId.value,
    data
  })
  router.push('/techs')
}

const handleCancel = () => {
  router.push('/techs')
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Edit Technology"
      description="Update technology information"
    />

    <LoadingSkeleton v-if="isLoading" />

    <UiAlert v-else-if="!tech" variant="destructive">
      <UiAlertTitle>Technology not found</UiAlertTitle>
      <UiAlertDescription>
        The technology you're looking for doesn't exist.
      </UiAlertDescription>
    </UiAlert>

    <UiCard v-else>
      <UiCardContent class="pt-6">
        <TechForm
          :tech="tech"
          :is-loading="updateTech.isPending.value"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </UiCardContent>
    </UiCard>
  </div>
</template>
