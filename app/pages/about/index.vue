<script setup lang="ts">
import type { About } from '~/types/api'
import { Edit2, Trash2, Plus } from 'lucide-vue-next'

const { abouts, isLoading, deleteAbout } = useAbout()

const aboutToDelete = ref<About | null>(null)
const isDeleteDialogOpen = ref(false)

const handleDelete = (about: About) => {
  aboutToDelete.value = about
  isDeleteDialogOpen.value = true
}

const confirmDelete = async () => {
  if (!aboutToDelete.value) return

  await deleteAbout.mutateAsync(aboutToDelete.value.id)
  isDeleteDialogOpen.value = false
  aboutToDelete.value = null
}

const getLocaleBadgeVariant = (locale: string) => {
  return locale === 'pt-BR' ? 'default' : 'secondary'
}
</script>

<template>
  <div class="space-y-6 min-h-full">
    <PageHeader
      title="About"
      description="Manage your personal information"
    />

    <div class="flex items-center justify-between">
      <p v-if="abouts.length > 0" class="text-sm text-muted-foreground">
        {{ abouts.length }} {{ abouts.length === 1 ? 'entry' : 'entries' }}
      </p>

      <UiButton as-child>
        <NuxtLink to="/about/create" class="flex items-center gap-2">
          <Plus class="w-4 h-4" />
          Add About Entry
        </NuxtLink>
      </UiButton>
    </div>

    <LoadingSkeleton v-if="isLoading" />

    <EmptyState
      v-else-if="!isLoading && abouts.length === 0"
      title="No about entries yet"
      description="Get started by adding information about yourself."
      action-label="Add About Entry"
      action-to="/about/create"
    />

    <UiCard v-else>
      <UiTable>
        <UiTableHeader>
          <UiTableRow>
            <UiTableHead>Language</UiTableHead>
            <UiTableHead>Title</UiTableHead>
            <UiTableHead>Description</UiTableHead>
            <UiTableHead>Image</UiTableHead>
            <UiTableHead class="text-right">Actions</UiTableHead>
          </UiTableRow>
        </UiTableHeader>
        <UiTableBody>
          <UiTableRow v-for="about in abouts" :key="about.id">
            <UiTableCell>
              <UiBadge :variant="getLocaleBadgeVariant(about.locale)">
                {{ about.locale }}
              </UiBadge>
            </UiTableCell>
            <UiTableCell class="font-medium">{{ about.title }}</UiTableCell>
            <UiTableCell class="max-w-md truncate">{{ about.description }}</UiTableCell>
            <UiTableCell>
              <div v-if="about.image" class="w-10 h-10 rounded-full overflow-hidden bg-muted">
                <img :src="about.image" :alt="about.title" class="w-full h-full object-cover" />
              </div>
              <span v-else class="text-xs text-muted-foreground">No image</span>
            </UiTableCell>
            <UiTableCell class="text-right">
              <div class="flex justify-end gap-2">
                <UiButton
                  variant="outline"
                  size="sm"
                  as-child
                >
                  <NuxtLink :to="`/about/${about.id}/edit`" class="flex items-center gap-2">
                    <Edit2 class="w-4 h-4" />
                    Edit
                  </NuxtLink>
                </UiButton>
                <UiButton
                  variant="destructive"
                  size="sm"
                  @click="handleDelete(about)"
                  class="flex items-center gap-2"
                >
                  <Trash2 class="w-4 h-4" />
                  Delete
                </UiButton>
              </div>
            </UiTableCell>
          </UiTableRow>
        </UiTableBody>
      </UiTable>
    </UiCard>

    <!-- Delete Confirmation Dialog -->
    <UiDialog v-model:open="isDeleteDialogOpen">
      <UiDialogContent>
        <UiDialogHeader>
          <UiDialogTitle>Delete About Entry</UiDialogTitle>
          <UiDialogDescription>
            Are you sure you want to delete <strong>{{ aboutToDelete?.title }}</strong> ({{ aboutToDelete?.locale }})?
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
            :disabled="deleteAbout.isPending.value"
            class="flex items-center gap-2"
          >
            <Trash2 v-if="!deleteAbout.isPending.value" class="w-4 h-4" />
            {{ deleteAbout.isPending.value ? 'Deleting...' : 'Delete' }}
          </UiButton>
        </UiDialogFooter>
      </UiDialogContent>
    </UiDialog>
  </div>
</template>
