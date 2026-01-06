import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Social, CreateSocialDTO, UpdateSocialDTO } from '~/types/api'
import { toast } from 'vue-sonner'

export const useSocial = () => {
  const { api } = useApi()
  const queryClient = useQueryClient()

  // Fetch all social media links
  const fetchSocial = useQuery({
    queryKey: ['social'],
    queryFn: async () => {
      const response = await api<{ data: Social[] }>('/portfolio/social')
      return response.data
    }
  })

  // Create social media link
  const createSocial = useMutation({
    mutationFn: async (data: CreateSocialDTO) => {
      return await api<Social>('/admin/social', {
        method: 'POST',
        body: data
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social'] })
      toast.success('Social media link created successfully')
    },
    onError: (error: any) => {
      toast.error(error.data?.message || 'Failed to create social media link')
    }
  })

  // Update social media link
  const updateSocial = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateSocialDTO }) => {
      return await api<Social>(`/admin/social/${id}`, {
        method: 'PUT',
        body: data
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social'] })
      toast.success('Social media link updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.data?.message || 'Failed to update social media link')
    }
  })

  // Delete social media link
  const deleteSocial = useMutation({
    mutationFn: async (id: number) => {
      return await api<void>(`/admin/social/${id}`, {
        method: 'DELETE'
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social'] })
      toast.success('Social media link deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.data?.message || 'Failed to delete social media link')
    }
  })

  return {
    // Queries
    socialLinks: computed(() => fetchSocial.data.value || []),
    isLoading: computed(() => fetchSocial.isLoading.value),
    isError: computed(() => fetchSocial.isError.value),
    error: computed(() => fetchSocial.error.value),

    // Mutations
    createSocial,
    updateSocial,
    deleteSocial,

    // Utilities
    refetch: fetchSocial.refetch
  }
}
