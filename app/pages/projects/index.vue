<script setup lang="ts">
import type { Project } from '~/types/api'
import { Checkbox } from '~/components/ui/checkbox'
import { Edit2, Trash2, Plus } from 'lucide-vue-next'

const { projects, isLoading, deleteProject } = useProjects()

const projectToDelete = ref<Project | null>(null)
const isDeleteDialogOpen = ref(false)

// Bulk selection
const {
  selectedCount,
  isAllSelected,
  toggleItem,
  toggleAll,
  clearSelection,
  isSelected,
  getSelectedIds
} = useBulkSelection<Project>()

const handleDelete = (project: Project) => {
  projectToDelete.value = project
  isDeleteDialogOpen.value = true
}

const confirmDelete = async () => {
  if (!projectToDelete.value) return

  await deleteProject.mutateAsync(projectToDelete.value.id)
  isDeleteDialogOpen.value = false
  projectToDelete.value = null
}

const handleBulkDelete = async () => {
  if (!confirm(`Are you sure you want to delete ${selectedCount.value} project(s)? This action cannot be undone.`)) {
    return
  }

  const ids = getSelectedIds()
  try {
    await Promise.all(ids.map(id => deleteProject.mutateAsync(Number(id))))
    clearSelection()
  } catch (error) {
    console.error('Failed to delete projects:', error)
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="space-y-6 min-h-full">
    <!-- Bulk Actions Toolbar -->
    <BulkActionsToolbar
      :selected-count="selectedCount"
      :on-delete="handleBulkDelete"
      :on-clear="clearSelection"
    />

    <PageHeader
      title="Projects"
      description="Manage your portfolio projects"
    />

    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div v-if="projects.length > 0" class="flex items-center gap-2">
          <Checkbox
            :checked="isAllSelected"
            @update:checked="() => toggleAll(projects)"
          />
          <span class="text-sm text-muted-foreground">
            Select all
          </span>
        </div>
        <p v-if="projects.length > 0" class="text-sm text-muted-foreground">
          {{ projects.length }} {{ projects.length === 1 ? 'project' : 'projects' }}
        </p>
      </div>

      <UiButton as-child>
        <NuxtLink to="/projects/create" class="flex items-center gap-2">
          <Plus class="w-4 h-4" />
          Create Project
        </NuxtLink>
      </UiButton>
    </div>

    <LoadingSkeleton v-if="isLoading" />

    <EmptyState
      v-else-if="!isLoading && projects.length === 0"
      title="No projects yet"
      description="Get started by adding your first project to your portfolio."
      action-label="Create Project"
      action-to="/projects/create"
    />

    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <UiCard
        v-for="project in projects"
        :key="project.id"
        class="flex flex-col overflow-hidden relative transition-all"
        :class="{ 'ring-2 ring-primary ring-offset-2': isSelected(project.id) }"
      >
        <!-- Checkbox -->
        <div class="absolute top-3 left-3 z-10">
          <Checkbox
            :checked="isSelected(project.id)"
            @update:checked="() => toggleItem(project.id)"
            class="bg-background shadow-sm"
          />
        </div>
        <div v-if="project.image" class="aspect-video w-full overflow-hidden bg-muted">
          <img :src="project.image" :alt="project.name" class="w-full h-full object-cover" />
        </div>
        <div v-else class="aspect-video w-full bg-muted flex items-center justify-center">
          <span class="text-muted-foreground text-sm">No image</span>
        </div>

        <UiCardHeader>
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1 space-y-1">
              <UiCardTitle class="line-clamp-2">{{ project.name }}</UiCardTitle>
              <p class="text-sm text-muted-foreground line-clamp-1">
                {{ project.title }}
              </p>
            </div>
          </div>
        </UiCardHeader>

        <UiCardContent class="flex-1">
          <div class="space-y-2">
            <div class="flex flex-wrap gap-1">
              <UiBadge
                v-for="tech in project.techs?.slice(0, 3)"
                :key="tech.id"
                variant="secondary"
                class="text-xs"
              >
                {{ tech.name }}
              </UiBadge>
              <UiBadge v-if="(project.techs?.length || 0) > 3" variant="outline" class="text-xs">
                +{{ (project.techs?.length || 0) - 3 }}
              </UiBadge>
            </div>
            <p class="text-xs text-muted-foreground">
              {{ formatDate(project.created_at) }}
            </p>
          </div>
        </UiCardContent>

        <UiCardFooter class="flex gap-3 pt-4">
          <UiButton variant="outline" size="sm" class="flex-1" as-child>
            <NuxtLink :to="`/projects/${project.id}/edit`" class="flex items-center gap-2">
              <Edit2 class="w-4 h-4" />
              Edit
            </NuxtLink>
          </UiButton>
          <UiButton
            variant="destructive"
            size="sm"
            class="flex-1 flex items-center gap-2"
            @click="handleDelete(project)"
          >
            <Trash2 class="w-4 h-4" />
            Delete
          </UiButton>
        </UiCardFooter>
      </UiCard>
    </div>

    <!-- Delete Confirmation Dialog -->
    <UiDialog v-model:open="isDeleteDialogOpen">
      <UiDialogContent>
        <UiDialogHeader>
          <UiDialogTitle>Delete Project</UiDialogTitle>
          <UiDialogDescription>
            Are you sure you want to delete <strong>{{ projectToDelete?.name }}</strong>?
            This action cannot be undone.
          </UiDialogDescription>
        </UiDialogHeader>
        <UiDialogFooter>
          <UiButton
            variant="outline"
            @click="isDeleteDialogOpen = false"
          >
            Cancel
          </UiButton>
          <UiButton
            variant="destructive"
            @click="confirmDelete"
            :disabled="deleteProject.isPending.value"
            class="flex items-center gap-2"
          >
            <Trash2 v-if="!deleteProject.isPending.value" class="w-4 h-4" />
            {{ deleteProject.isPending.value ? 'Deleting...' : 'Delete' }}
          </UiButton>
        </UiDialogFooter>
      </UiDialogContent>
    </UiDialog>
  </div>
</template>
