import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Tech, CreateTechDTO, UpdateTechDTO } from '~/types/api'
import { toast } from 'vue-sonner'

export const useTechs = () => {
  const { api } = useApi()
  const queryClient = useQueryClient()

  // Fetch all technologies
  const fetchTechs = useQuery({
    queryKey: ['techs'],
    queryFn: async () => {
      const response = await api<{ data: Tech[] }>('/portfolio/techs')
      return response.data
    }
  })

  // Create technology
  const createTech = useMutation({
    mutationFn: async (data: CreateTechDTO) => {
      return await api<Tech>('/admin/techs', {
        method: 'POST',
        body: data
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['techs'] })
      toast.success('Technology created successfully')
    },
    onError: (error: any) => {
      toast.error(error.data?.message || 'Failed to create technology')
    }
  })

  // Update technology
  const updateTech = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateTechDTO }) => {
      return await api<Tech>(`/admin/techs/${id}`, {
        method: 'PUT',
        body: data
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['techs'] })
      toast.success('Technology updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.data?.message || 'Failed to update technology')
    }
  })

  // Delete technology
  const deleteTech = useMutation({
    mutationFn: async (id: number) => {
      return await api<void>(`/admin/techs/${id}`, {
        method: 'DELETE'
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['techs'] })
      toast.success('Technology deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.data?.message || 'Failed to delete technology')
    }
  })

  return {
    // Queries
    techs: computed(() => fetchTechs.data.value || []),
    isLoading: computed(() => fetchTechs.isLoading.value),
    isError: computed(() => fetchTechs.isError.value),
    error: computed(() => fetchTechs.error.value),

    // Mutations
    createTech,
    updateTech,
    deleteTech,

    // Utilities
    refetch: fetchTechs.refetch
  }
}
