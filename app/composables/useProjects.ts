import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Project, CreateProjectDTO, UpdateProjectDTO, PaginatedResponse } from '~/types/api'
import { toast } from 'vue-sonner'

type Locale = 'pt-BR' | 'en-US'

interface UseProjectsOptions {
  locale?: Ref<Locale> | Locale
  page?: Ref<number> | number
  perPage?: Ref<number> | number
}

export const useProjects = (options: UseProjectsOptions = {}) => {
  const { api } = useApi()
  const queryClient = useQueryClient()

  const currentLocale = options.locale ? (isRef(options.locale) ? options.locale : ref(options.locale)) : ref<Locale>('pt-BR')
  const currentPage = options.page ? (isRef(options.page) ? options.page : ref(options.page)) : ref(1)
  const currentPerPage = options.perPage ? (isRef(options.perPage) ? options.perPage : ref(options.perPage)) : ref(10)

  // Fetch paginated projects
  const fetchProjects = useQuery({
    queryKey: ['projects', currentLocale, currentPage, currentPerPage],
    queryFn: async () => {
      const response = await api<PaginatedResponse<Project>>(
        `/portfolio/projects?locale=${currentLocale.value}&page=${currentPage.value}&per_page=${currentPerPage.value}`
      )
      return response
    },
    enabled: computed(() => !!currentLocale.value)
  })

  // Fetch single project by ID
  const fetchProject = (id: Ref<number> | number) => {
    const projectId = isRef(id) ? id : ref(id)

    return useQuery({
      queryKey: ['project', projectId, currentLocale],
      queryFn: async () => {
        const response = await api<Project>(`/portfolio/projects/${projectId.value}?locale=${currentLocale.value}`)
        return response
      },
      enabled: computed(() => !!projectId.value && !!currentLocale.value)
    })
  }

  // Create project (multipart/form-data)
  const createProject = useMutation({
    mutationFn: async (data: CreateProjectDTO) => {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('slug', data.slug)
      formData.append('techs', JSON.stringify({ ids: data.tech_ids }))
      formData.append('translations', JSON.stringify(data.translations))
      if (data.image) {
        formData.append('image', data.image)
      }

      return await api<Project>('/admin/projects', {
        method: 'POST',
        body: formData
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project created successfully')
    },
    onError: (error: any) => {
      toast.error(error.data?.message || 'Failed to create project')
    }
  })

  // Update project (multipart/form-data)
  const updateProject = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateProjectDTO }) => {
      const formData = new FormData()
      if (data.name) formData.append('name', data.name)
      if (data.slug) formData.append('slug', data.slug)
      if (data.tech_ids) formData.append('techs', JSON.stringify({ ids: data.tech_ids }))
      if (data.translations) formData.append('translations', JSON.stringify(data.translations))
      if (data.image) {
        formData.append('image', data.image)
      }

      return await api<Project>(`/admin/projects/${id}`, {
        method: 'PUT',
        body: formData
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['project'] })
      toast.success('Project updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.data?.message || 'Failed to update project')
    }
  })

  // Delete project
  const deleteProject = useMutation({
    mutationFn: async (id: number) => {
      return await api<void>(`/admin/projects/${id}`, {
        method: 'DELETE'
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.data?.message || 'Failed to delete project')
    }
  })

  return {
    // Queries
    projects: computed(() => fetchProjects.data.value?.data || []),
    meta: computed(() => fetchProjects.data.value?.meta),
    isLoading: computed(() => fetchProjects.isLoading.value),
    isError: computed(() => fetchProjects.isError.value),
    error: computed(() => fetchProjects.error.value),

    // Single project query
    fetchProject,

    // Mutations
    createProject,
    updateProject,
    deleteProject,

    // Utilities
    refetch: fetchProjects.refetch,
    currentLocale,
    currentPage,
    currentPerPage
  }
}
