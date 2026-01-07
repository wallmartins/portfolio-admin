<script setup lang="ts">
import type { AboutFormData } from '~/schemas/about.schema'

const router = useRouter()
const { createAbout } = useAbout()

const handleSubmit = async (data: AboutFormData) => {
  await createAbout.mutateAsync(data)
  router.push('/about')
}

const handleCancel = () => {
  router.push('/about')
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Add About Entry"
      description="Create a new about entry"
    />

    <UiCard>
      <UiCardContent class="pt-6">
        <AboutForm
          :is-loading="createAbout.isPending.value"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </UiCardContent>
    </UiCard>
  </div>
</template>
