// This file will be auto-generated from Swagger in the future
// For now, we'll add types manually as needed

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
  }
}

export type Locale = 'pt-BR' | 'en-US'

export interface Translation {
  locale: Locale
  title?: string
  content?: string
  description?: string
}

// Entity types will be added in future phases
export interface Tech {
  id: number
  name: string
  slug: string
  category: 'language' | 'framework' | 'tool'
  created_at: string
  updated_at: string
}

export interface Social {
  id: number
  name: string
  url: string
  icon?: string
  created_at: string
  updated_at: string
}

export interface About {
  id: number
  image: string
  translations: Translation[]
  created_at: string
  updated_at: string
}

export interface Experience {
  id: number
  company: string
  start_date: string
  end_date?: string | null
  translations: Translation[]
  created_at: string
  updated_at: string
}

export interface Post {
  id: number
  slug: string
  image: string
  translations: Translation[]
  techs: Tech[]
  created_at: string
  updated_at: string
}

export interface Project {
  id: number
  slug: string
  image: string
  url?: string
  github_url?: string
  translations: Translation[]
  techs: Tech[]
  created_at: string
  updated_at: string
}
