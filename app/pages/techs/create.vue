<script setup lang="ts">
import type { TechFormData } from '~/schemas/tech.schema'

definePageMeta({
  middleware: 'auth'
})

const router = useRouter()
const { createTech } = useTechs()

const handleSubmit = async (data: TechFormData) => {
  await createTech.mutateAsync(data)
  router.push('/techs')
}

const handleCancel = () => {
  router.push('/techs')
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Add Technology"
      description="Add a new technology to your stack"
    />

    <UiCard>
      <UiCardContent class="pt-6">
        <TechForm
          :is-loading="createTech.isPending.value"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </UiCardContent>
    </UiCard>
  </div>
</template>
