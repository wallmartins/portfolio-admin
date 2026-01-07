<script setup lang="ts">
import type { PostFormData } from '~/schemas/post.schema'
import type { Post } from '~/types/api'

const route = useRoute()
const router = useRouter()
const { posts, updatePost, isLoading } = usePosts()

const postId = computed(() => Number(route.params.id))

const post = computed(() => {
  return posts.value.find((p: Post) => p.id === postId.value)
})

const handleSubmit = async (data: PostFormData) => {
  await updatePost.mutateAsync({
    id: postId.value,
    data: {
      slug: data.slug,
      image: data.image,
      tech_ids: data.tech_ids,
      translations: data.translations
    }
  })
  router.push('/posts')
}

const handleCancel = () => {
  router.push('/posts')
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Edit Post"
      description="Update blog post information"
    />

    <LoadingSkeleton v-if="isLoading" />

    <UiAlert v-else-if="!post" variant="destructive">
      <UiAlertTitle>Post not found</UiAlertTitle>
      <UiAlertDescription>
        The post you're looking for doesn't exist.
      </UiAlertDescription>
    </UiAlert>

    <UiCard v-else>
      <UiCardContent class="pt-6">
        <PostForm
          :post="post"
          :is-loading="updatePost.isPending.value"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </UiCardContent>
    </UiCard>
  </div>
</template>
