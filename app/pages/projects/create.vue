<script setup lang="ts">
import type { ProjectFormData } from '~/schemas/project.schema'

const router = useRouter()
const { createProject } = useProjects()

const handleSubmit = async (data: ProjectFormData) => {
  await createProject.mutateAsync(data)
  router.push('/projects')
}

const handleCancel = () => {
  router.push('/projects')
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Create Project"
      description="Add a new project to your portfolio"
    />

    <UiCard>
      <UiCardContent class="pt-6">
        <ProjectForm
          :is-loading="createProject.isPending.value"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </UiCardContent>
    </UiCard>
  </div>
</template>
