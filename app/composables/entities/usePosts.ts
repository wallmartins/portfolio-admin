import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Post, CreatePostDTO, UpdatePostDTO, PaginatedResponse } from '~/types/api'
import { toast } from 'vue-sonner'

type Locale = 'pt-BR' | 'en-US'

interface UsePostsOptions {
  locale?: Ref<Locale> | Locale
  page?: Ref<number> | number
  perPage?: Ref<number> | number
}

export const usePosts = (options: UsePostsOptions = {}) => {
  const { api } = useApi()
  const queryClient = useQueryClient()

  const currentLocale = options.locale ? (isRef(options.locale) ? options.locale : ref(options.locale)) : ref<Locale>('pt-BR')
  const currentPage = options.page ? (isRef(options.page) ? options.page : ref(options.page)) : ref(1)
  const currentPerPage = options.perPage ? (isRef(options.perPage) ? options.perPage : ref(options.perPage)) : ref(15)

  // Fetch paginated posts
  const fetchPosts = useQuery({
    queryKey: ['posts', currentLocale, currentPage, currentPerPage],
    queryFn: async () => {
      const response = await api<PaginatedResponse<Post>>(
        `/portfolio/blog?locale=${currentLocale.value}&page=${currentPage.value}&per_page=${currentPerPage.value}`
      )
      return response
    },
    enabled: computed(() => !!currentLocale.value)
  })

  // Fetch single post by ID
  const fetchPost = (id: Ref<number> | number) => {
    const postId = isRef(id) ? id : ref(id)

    return useQuery({
      queryKey: ['post', postId, currentLocale],
      queryFn: async () => {
        const response = await api<Post>(`/portfolio/blog/${postId.value}?locale=${currentLocale.value}`)
        return response
      },
      enabled: computed(() => !!postId.value && !!currentLocale.value)
    })
  }

  // Create post (multipart/form-data)
  const createPost = useMutation({
    mutationFn: async (data: CreatePostDTO) => {
      const formData = new FormData()
      formData.append('slug', data.slug)
      formData.append('tech_ids', JSON.stringify(data.tech_ids))
      formData.append('translations', JSON.stringify(data.translations))
      if (data.image) {
        formData.append('image', data.image)
      }

      return await api<Post>('/admin/posts', {
        method: 'POST',
        body: formData
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      toast.success('Post created successfully')
    },
    onError: (error: any) => {
      toast.error(error.data?.message || 'Failed to create post')
    }
  })

  // Update post (multipart/form-data)
  const updatePost = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdatePostDTO }) => {
      const formData = new FormData()
      if (data.slug) formData.append('slug', data.slug)
      if (data.tech_ids) formData.append('tech_ids', JSON.stringify(data.tech_ids))
      if (data.translations) formData.append('translations', JSON.stringify(data.translations))
      if (data.image) {
        formData.append('image', data.image)
      }

      return await api<Post>(`/admin/posts/${id}`, {
        method: 'PUT',
        body: formData
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['post'] })
      toast.success('Post updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.data?.message || 'Failed to update post')
    }
  })

  // Delete post
  const deletePost = useMutation({
    mutationFn: async (id: number) => {
      return await api<void>(`/admin/posts/${id}`, {
        method: 'DELETE'
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      toast.success('Post deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.data?.message || 'Failed to delete post')
    }
  })

  return {
    // Queries
    posts: computed(() => fetchPosts.data.value?.data || []),
    meta: computed(() => fetchPosts.data.value?.meta),
    isLoading: computed(() => fetchPosts.isLoading.value),
    isError: computed(() => fetchPosts.isError.value),
    error: computed(() => fetchPosts.error.value),

    // Single post query
    fetchPost,

    // Mutations
    createPost,
    updatePost,
    deletePost,

    // Utilities
    refetch: fetchPosts.refetch,
    currentLocale,
    currentPage,
    currentPerPage
  }
}
