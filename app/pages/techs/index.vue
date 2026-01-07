<script setup lang="ts">
import type { Tech } from '~/types/api'

definePageMeta({
  middleware: 'auth'
})

const { techs, isLoading, deleteTech } = useTechs()

const selectedCategory = ref<'all' | 'language' | 'framework' | 'tool'>('all')

const filteredTechs = computed(() => {
  if (selectedCategory.value === 'all') {
    return techs.value
  }
  return techs.value.filter((tech: Tech) => tech.category === selectedCategory.value)
})

const categoryOptions = [
  { label: 'All Categories', value: 'all' },
  { label: 'Languages', value: 'language' },
  { label: 'Frameworks', value: 'framework' },
  { label: 'Tools', value: 'tool' }
]

const techToDelete = ref<Tech | null>(null)
const isDeleteDialogOpen = ref(false)

const handleDelete = (tech: Tech) => {
  techToDelete.value = tech
  isDeleteDialogOpen.value = true
}

const confirmDelete = async () => {
  if (!techToDelete.value) return

  await deleteTech.mutateAsync(techToDelete.value.id)
  isDeleteDialogOpen.value = false
  techToDelete.value = null
}

const getCategoryBadgeVariant = (category: string) => {
  switch (category) {
    case 'language':
      return 'default'
    case 'framework':
      return 'secondary'
    case 'tool':
      return 'outline'
    default:
      return 'default'
  }
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Technologies"
      description="Manage your technology stack and skills"
    />

    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <UiSelect v-model="selectedCategory">
          <UiSelectTrigger class="w-[200px]">
            <UiSelectValue placeholder="Filter by category" />
          </UiSelectTrigger>
          <UiSelectContent>
            <UiSelectItem
              v-for="option in categoryOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </UiSelectItem>
          </UiSelectContent>
        </UiSelect>

        <p v-if="filteredTechs.length > 0" class="text-sm text-muted-foreground">
          {{ filteredTechs.length }} {{ filteredTechs.length === 1 ? 'technology' : 'technologies' }}
        </p>
      </div>

      <UiButton as-child>
        <NuxtLink to="/techs/create">
          Add Technology
        </NuxtLink>
      </UiButton>
    </div>

    <LoadingSkeleton v-if="isLoading" />

    <EmptyState
      v-else-if="!isLoading && techs.length === 0"
      title="No technologies yet"
      description="Get started by adding your first technology to your stack."
      action-label="Add Technology"
      action-to="/techs/create"
    />

    <EmptyState
      v-else-if="!isLoading && filteredTechs.length === 0"
      title="No technologies found"
      description="No technologies match the selected category."
    />

    <UiCard v-else>
      <UiTable>
        <UiTableHeader>
          <UiTableRow>
            <UiTableHead>Name</UiTableHead>
            <UiTableHead>Slug</UiTableHead>
            <UiTableHead>Category</UiTableHead>
            <UiTableHead>Icon</UiTableHead>
            <UiTableHead class="text-right">Actions</UiTableHead>
          </UiTableRow>
        </UiTableHeader>
        <UiTableBody>
          <UiTableRow v-for="tech in filteredTechs" :key="tech.id">
            <UiTableCell class="font-medium">{{ tech.name }}</UiTableCell>
            <UiTableCell>
              <code class="text-xs bg-muted px-2 py-1 rounded">{{ tech.slug }}</code>
            </UiTableCell>
            <UiTableCell>
              <UiBadge :variant="getCategoryBadgeVariant(tech.category)">
                {{ tech.category }}
              </UiBadge>
            </UiTableCell>
            <UiTableCell>
              <span v-if="tech.icon" class="text-xs text-muted-foreground">{{ tech.icon }}</span>
              <span v-else class="text-xs text-muted-foreground">-</span>
            </UiTableCell>
            <UiTableCell class="text-right">
              <div class="flex justify-end gap-2">
                <UiButton
                  variant="outline"
                  size="sm"
                  as-child
                >
                  <NuxtLink :to="`/techs/${tech.id}/edit`">
                    Edit
                  </NuxtLink>
                </UiButton>
                <UiButton
                  variant="destructive"
                  size="sm"
                  @click="handleDelete(tech)"
                >
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
          <UiDialogTitle>Delete Technology</UiDialogTitle>
          <UiDialogDescription>
            Are you sure you want to delete <strong>{{ techToDelete?.name }}</strong>?
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
            :disabled="deleteTech.isPending.value"
          >
            {{ deleteTech.isPending.value ? 'Deleting...' : 'Delete' }}
          </UiButton>
        </UiDialogFooter>
      </UiDialogContent>
    </UiDialog>
  </div>
</template>
