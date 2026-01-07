<script setup lang="ts">
import type { Experience } from '~/types/api'
import { LayoutList, Clock } from 'lucide-vue-next'

const { experiences, isLoading, deleteExperience } = useExperiences()

const viewMode = ref<'timeline' | 'table'>('timeline')
const experienceToDelete = ref<Experience | null>(null)
const isDeleteDialogOpen = ref(false)

const sortedExperiences = computed(() => {
  return [...experiences.value].sort((a, b) => {
    const dateA = new Date(a.start_date)
    const dateB = new Date(b.start_date)
    return dateB.getTime() - dateA.getTime()
  })
})

const handleDelete = (experience: Experience) => {
  experienceToDelete.value = experience
  isDeleteDialogOpen.value = true
}

const confirmDelete = async () => {
  if (!experienceToDelete.value) return

  await deleteExperience.mutateAsync(experienceToDelete.value.id)
  isDeleteDialogOpen.value = false
  experienceToDelete.value = null
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short'
  })
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Experiences"
      description="Manage your professional experience history"
    />

    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <p v-if="experiences.length > 0" class="text-sm text-muted-foreground">
          {{ experiences.length }} {{ experiences.length === 1 ? 'experience' : 'experiences' }}
        </p>

        <div class="flex items-center gap-2">
          <UiButton
            variant="outline"
            size="sm"
            @click="viewMode = 'timeline'"
            :class="{ 'bg-muted': viewMode === 'timeline' }"
          >
            <Clock class="w-4 h-4" />
          </UiButton>
          <UiButton
            variant="outline"
            size="sm"
            @click="viewMode = 'table'"
            :class="{ 'bg-muted': viewMode === 'table' }"
          >
            <LayoutList class="w-4 h-4" />
          </UiButton>
        </div>
      </div>

      <UiButton as-child>
        <NuxtLink to="/experiences/create">
          Add Experience
        </NuxtLink>
      </UiButton>
    </div>

    <LoadingSkeleton v-if="isLoading" />

    <EmptyState
      v-else-if="!isLoading && experiences.length === 0"
      title="No experiences yet"
      description="Get started by adding your first professional experience."
      action-label="Add Experience"
      action-to="/experiences/create"
    />

    <template v-else>
      <!-- Timeline View -->
      <TimelineView v-if="viewMode === 'timeline'" :experiences="sortedExperiences" />

      <!-- Table View -->
      <UiCard v-else>
        <UiTable>
          <UiTableHeader>
            <UiTableRow>
              <UiTableHead>Company</UiTableHead>
              <UiTableHead>Role</UiTableHead>
              <UiTableHead>Period</UiTableHead>
              <UiTableHead>Translations</UiTableHead>
              <UiTableHead class="text-right">Actions</UiTableHead>
            </UiTableRow>
          </UiTableHeader>
          <UiTableBody>
            <UiTableRow v-for="experience in sortedExperiences" :key="experience.id">
              <UiTableCell class="font-medium">{{ experience.company }}</UiTableCell>
              <UiTableCell>{{ experience.role }}</UiTableCell>
              <UiTableCell>
                <div class="text-sm">
                  {{ formatDate(experience.start_date) }} -
                  {{ experience.end_date ? formatDate(experience.end_date) : 'Present' }}
                </div>
              </UiTableCell>
              <UiTableCell>
                <div class="flex gap-1">
                  <UiBadge
                    v-for="(translation, index) in experience.translations"
                    :key="index"
                    variant="outline"
                    class="text-xs"
                  >
                    {{ translation.locale }}
                  </UiBadge>
                </div>
              </UiTableCell>
              <UiTableCell class="text-right">
                <div class="flex justify-end gap-2">
                  <UiButton
                    variant="outline"
                    size="sm"
                    as-child
                  >
                    <NuxtLink :to="`/experiences/${experience.id}/edit`">
                      Edit
                    </NuxtLink>
                  </UiButton>
                  <UiButton
                    variant="destructive"
                    size="sm"
                    @click="handleDelete(experience)"
                  >
                    Delete
                  </UiButton>
                </div>
              </UiTableCell>
            </UiTableRow>
          </UiTableBody>
        </UiTable>
      </UiCard>
    </template>

    <!-- Delete Confirmation Dialog -->
    <UiDialog v-model:open="isDeleteDialogOpen">
      <UiDialogContent>
        <UiDialogHeader>
          <UiDialogTitle>Delete Experience</UiDialogTitle>
          <UiDialogDescription>
            Are you sure you want to delete <strong>{{ experienceToDelete?.role }}</strong> at <strong>{{ experienceToDelete?.company }}</strong>?
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
            :disabled="deleteExperience.isPending.value"
          >
            {{ deleteExperience.isPending.value ? 'Deleting...' : 'Delete' }}
          </UiButton>
        </UiDialogFooter>
      </UiDialogContent>
    </UiDialog>
  </div>
</template>
