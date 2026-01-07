<script setup lang="ts">
import type { ProjectFormData } from '~/schemas/project.schema'
import type { Project } from '~/types/api'

const route = useRoute()
const router = useRouter()
const { projects, updateProject, isLoading } = useProjects()

const projectId = computed(() => Number(route.params.id))

const project = computed(() => {
  return projects.value.find((p: Project) => p.id === projectId.value)
})

const handleSubmit = async (data: ProjectFormData) => {
  await updateProject.mutateAsync({
    id: projectId.value,
    data: {
      name: data.name,
      slug: data.slug,
      image: data.image,
      tech_ids: data.tech_ids,
      translations: data.translations
    }
  })
  router.push('/projects')
}

const handleCancel = () => {
  router.push('/projects')
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Edit Project"
      description="Update project information"
    />

    <LoadingSkeleton v-if="isLoading" />

    <UiAlert v-else-if="!project" variant="destructive">
      <UiAlertTitle>Project not found</UiAlertTitle>
      <UiAlertDescription>
        The project you're looking for doesn't exist.
      </UiAlertDescription>
    </UiAlert>

    <UiCard v-else>
      <UiCardContent class="pt-6">
        <ProjectForm
          :project="project"
          :is-loading="updateProject.isPending.value"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </UiCardContent>
    </UiCard>
  </div>
</template>
