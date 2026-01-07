import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { About, CreateAboutDTO, UpdateAboutDTO } from '~/types/api'
import { toast } from 'vue-sonner'

type Locale = 'pt-BR' | 'en-US'

export const useAbout = (locale?: Ref<Locale> | Locale) => {
  const { api } = useApi()
  const queryClient = useQueryClient()
  const currentLocale = locale ? (isRef(locale) ? locale : ref(locale)) : ref<Locale | undefined>(undefined)

  // Fetch all about entries (admin)
  const fetchAllAbout = useQuery({
    queryKey: ['about', 'all'],
    queryFn: async () => {
      const response = await api<{ data: About[] }>('/admin/about')
      return response.data || []
    },
    enabled: computed(() => !currentLocale.value)
  })

  // Fetch about information by locale (public)
  const fetchAbout = useQuery({
    queryKey: ['about', currentLocale],
    queryFn: async () => {
      const response = await api<About>(`/portfolio/about?locale=${currentLocale.value}`)
      return response
    },
    enabled: computed(() => !!currentLocale.value)
  })

  // Create about information (multipart/form-data)
  const createAbout = useMutation({
    mutationFn: async (data: CreateAboutDTO) => {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('locale', data.locale)
      if (data.image) {
        formData.append('image', data.image)
      }

      return await api<About>('/admin/about', {
        method: 'POST',
        body: formData
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about'] })
      toast.success('About information created successfully')
    },
    onError: (error: any) => {
      toast.error(error.data?.message || 'Failed to create about information')
    }
  })

  // Update about information (multipart/form-data)
  const updateAbout = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateAboutDTO }) => {
      const formData = new FormData()
      if (data.title) formData.append('title', data.title)
      if (data.description) formData.append('description', data.description)
      if (data.locale) formData.append('locale', data.locale)
      if (data.image) {
        formData.append('image', data.image)
      }

      return await api<About>(`/admin/about/${id}`, {
        method: 'PUT',
        body: formData
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about'] })
      toast.success('About information updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.data?.message || 'Failed to update about information')
    }
  })

  // Delete about information
  const deleteAbout = useMutation({
    mutationFn: async (id: number) => {
      return await api<void>(`/admin/about/${id}`, {
        method: 'DELETE'
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about'] })
      toast.success('About information deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.data?.message || 'Failed to delete about information')
    }
  })

  return {
    // Queries
    about: computed(() => fetchAbout.data.value),
    abouts: computed(() => fetchAllAbout.data.value || []),
    isLoading: computed(() => currentLocale.value ? fetchAbout.isLoading.value : fetchAllAbout.isLoading.value),
    isError: computed(() => currentLocale.value ? fetchAbout.isError.value : fetchAllAbout.isError.value),
    error: computed(() => currentLocale.value ? fetchAbout.error.value : fetchAllAbout.error.value),

    // Mutations
    createAbout,
    updateAbout,
    deleteAbout,

    // Utilities
    refetch: currentLocale.value ? fetchAbout.refetch : fetchAllAbout.refetch,
    currentLocale
  }
}
