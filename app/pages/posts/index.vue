<script setup lang="ts">
import type { Post } from '~/types/api'

const { posts, isLoading, deletePost } = usePosts()

const postToDelete = ref<Post | null>(null)
const isDeleteDialogOpen = ref(false)

const handleDelete = (post: Post) => {
  postToDelete.value = post
  isDeleteDialogOpen.value = true
}

const confirmDelete = async () => {
  if (!postToDelete.value) return

  await deletePost.mutateAsync(postToDelete.value.id)
  isDeleteDialogOpen.value = false
  postToDelete.value = null
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
  <div class="space-y-6">
    <PageHeader
      title="Blog Posts"
      description="Manage your blog posts and articles"
    />

    <div class="flex items-center justify-between">
      <p v-if="posts.length > 0" class="text-sm text-muted-foreground">
        {{ posts.length }} {{ posts.length === 1 ? 'post' : 'posts' }}
      </p>

      <UiButton as-child>
        <NuxtLink to="/posts/create">
          Create Post
        </NuxtLink>
      </UiButton>
    </div>

    <LoadingSkeleton v-if="isLoading" />

    <EmptyState
      v-else-if="!isLoading && posts.length === 0"
      title="No posts yet"
      description="Get started by creating your first blog post."
      action-label="Create Post"
      action-to="/posts/create"
    />

    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <UiCard v-for="post in posts" :key="post.id" class="flex flex-col overflow-hidden">
        <div v-if="post.image" class="aspect-video w-full overflow-hidden bg-muted">
          <img :src="post.image" :alt="post.title" class="w-full h-full object-cover" />
        </div>
        <div v-else class="aspect-video w-full bg-muted flex items-center justify-center">
          <span class="text-muted-foreground text-sm">No image</span>
        </div>

        <UiCardHeader>
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1 space-y-1">
              <UiCardTitle class="line-clamp-2">{{ post.title }}</UiCardTitle>
              <p v-if="post.subtitle" class="text-sm text-muted-foreground line-clamp-1">
                {{ post.subtitle }}
              </p>
            </div>
          </div>
        </UiCardHeader>

        <UiCardContent class="flex-1">
          <div class="space-y-2">
            <div class="flex flex-wrap gap-1">
              <UiBadge
                v-for="tech in post.techs?.slice(0, 3)"
                :key="tech.id"
                variant="secondary"
                class="text-xs"
              >
                {{ tech.name }}
              </UiBadge>
              <UiBadge v-if="(post.techs?.length || 0) > 3" variant="outline" class="text-xs">
                +{{ (post.techs?.length || 0) - 3 }}
              </UiBadge>
            </div>
            <p class="text-xs text-muted-foreground">
              {{ formatDate(post.created_at) }}
            </p>
          </div>
        </UiCardContent>

        <UiCardFooter class="flex gap-2">
          <UiButton variant="outline" size="sm" class="flex-1" as-child>
            <NuxtLink :to="`/posts/${post.id}/edit`">
              Edit
            </NuxtLink>
          </UiButton>
          <UiButton
            variant="destructive"
            size="sm"
            class="flex-1"
            @click="handleDelete(post)"
          >
            Delete
          </UiButton>
        </UiCardFooter>
      </UiCard>
    </div>

    <!-- Delete Confirmation Dialog -->
    <UiDialog v-model:open="isDeleteDialogOpen">
      <UiDialogContent>
        <UiDialogHeader>
          <UiDialogTitle>Delete Post</UiDialogTitle>
          <UiDialogDescription>
            Are you sure you want to delete <strong>{{ postToDelete?.title }}</strong>?
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
            :disabled="deletePost.isPending.value"
          >
            {{ deletePost.isPending.value ? 'Deleting...' : 'Delete' }}
          </UiButton>
        </UiDialogFooter>
      </UiDialogContent>
    </UiDialog>
  </div>
</template>
