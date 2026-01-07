<script setup lang="ts">
import type { Social } from '~/types/api'

definePageMeta({
  middleware: 'auth'
})

const { socialLinks, isLoading, deleteSocial } = useSocial()

const socialToDelete = ref<Social | null>(null)
const isDeleteDialogOpen = ref(false)

const handleDelete = (social: Social) => {
  socialToDelete.value = social
  isDeleteDialogOpen.value = true
}

const confirmDelete = async () => {
  if (!socialToDelete.value) return

  await deleteSocial.mutateAsync(socialToDelete.value.id)
  isDeleteDialogOpen.value = false
  socialToDelete.value = null
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Social Media Links"
      description="Manage your social media profiles"
    />

    <div class="flex items-center justify-between">
      <p v-if="socialLinks.length > 0" class="text-sm text-muted-foreground">
        {{ socialLinks.length }} {{ socialLinks.length === 1 ? 'link' : 'links' }}
      </p>

      <UiButton as-child>
        <NuxtLink to="/social/create">
          Add Social Link
        </NuxtLink>
      </UiButton>
    </div>

    <LoadingSkeleton v-if="isLoading" />

    <EmptyState
      v-else-if="!isLoading && socialLinks.length === 0"
      title="No social links yet"
      description="Get started by adding your first social media link."
      action-label="Add Social Link"
      action-to="/social/create"
    />

    <UiCard v-else>
      <UiTable>
        <UiTableHeader>
          <UiTableRow>
            <UiTableHead>Name</UiTableHead>
            <UiTableHead>URL</UiTableHead>
            <UiTableHead>Icon</UiTableHead>
            <UiTableHead class="text-right">Actions</UiTableHead>
          </UiTableRow>
        </UiTableHeader>
        <UiTableBody>
          <UiTableRow v-for="social in socialLinks" :key="social.id">
            <UiTableCell class="font-medium">{{ social.social_name }}</UiTableCell>
            <UiTableCell>
              <a
                :href="social.social_url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary hover:underline"
              >
                {{ social.social_url }}
              </a>
            </UiTableCell>
            <UiTableCell>
              <span v-if="social.icon" class="text-xs text-muted-foreground">{{ social.icon }}</span>
              <span v-else class="text-xs text-muted-foreground">-</span>
            </UiTableCell>
            <UiTableCell class="text-right">
              <div class="flex justify-end gap-2">
                <UiButton
                  variant="outline"
                  size="sm"
                  as-child
                >
                  <NuxtLink :to="`/social/${social.id}/edit`">
                    Edit
                  </NuxtLink>
                </UiButton>
                <UiButton
                  variant="destructive"
                  size="sm"
                  @click="handleDelete(social)"
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
          <UiDialogTitle>Delete Social Link</UiDialogTitle>
          <UiDialogDescription>
            Are you sure you want to delete <strong>{{ socialToDelete?.social_name }}</strong>?
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
            :disabled="deleteSocial.isPending.value"
          >
            {{ deleteSocial.isPending.value ? 'Deleting...' : 'Delete' }}
          </UiButton>
        </UiDialogFooter>
      </UiDialogContent>
    </UiDialog>
  </div>
</template>
