import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Experience, CreateExperienceDTO, UpdateExperienceDTO } from '~/types/api'
import { toast } from 'vue-sonner'

type Locale = 'pt-BR' | 'en-US'

export const useExperiences = (locale: Ref<Locale> | Locale = 'pt-BR') => {
  const { api } = useApi()
  const queryClient = useQueryClient()
  const currentLocale = isRef(locale) ? locale : ref(locale)

  // Fetch all experiences by locale
  const fetchExperiences = useQuery({
    queryKey: ['experiences', currentLocale],
    queryFn: async () => {
      const response = await api<{ data: Experience[] }>(`/portfolio/experiences?locale=${currentLocale.value}`)
      return response.data
    },
    enabled: computed(() => !!currentLocale.value)
  })

  // Create experience
  const createExperience = useMutation({
    mutationFn: async (data: CreateExperienceDTO) => {
      return await api<Experience>('/admin/experiences', {
        method: 'POST',
        body: data
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] })
      toast.success('Experience created successfully')
    },
    onError: (error: any) => {
      toast.error(error.data?.message || 'Failed to create experience')
    }
  })

  // Update experience
  const updateExperience = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateExperienceDTO }) => {
      return await api<Experience>(`/admin/experiences/${id}`, {
        method: 'PUT',
        body: data
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] })
      toast.success('Experience updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.data?.message || 'Failed to update experience')
    }
  })

  // Delete experience
  const deleteExperience = useMutation({
    mutationFn: async (id: number) => {
      return await api<void>(`/admin/experiences/${id}`, {
        method: 'DELETE'
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] })
      toast.success('Experience deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.data?.message || 'Failed to delete experience')
    }
  })

  return {
    // Queries
    experiences: computed(() => fetchExperiences.data.value || []),
    isLoading: computed(() => fetchExperiences.isLoading.value),
    isError: computed(() => fetchExperiences.isError.value),
    error: computed(() => fetchExperiences.error.value),

    // Mutations
    createExperience,
    updateExperience,
    deleteExperience,

    // Utilities
    refetch: fetchExperiences.refetch,
    currentLocale
  }
}
