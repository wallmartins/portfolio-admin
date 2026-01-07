<script setup lang="ts">
import type { PostFormData } from '~/schemas/post.schema'

const router = useRouter()
const { createPost } = usePosts()

const handleSubmit = async (data: PostFormData) => {
  await createPost.mutateAsync(data)
  router.push('/posts')
}

const handleCancel = () => {
  router.push('/posts')
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Create Post"
      description="Write a new blog post"
    />

    <UiCard>
      <UiCardContent class="pt-6">
        <PostForm
          :is-loading="createPost.isPending.value"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </UiCardContent>
    </UiCard>
  </div>
</template>
