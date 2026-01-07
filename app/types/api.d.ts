/**
 * API Type Definitions
 *
 * TODO: Generate these types from Swagger using openapi-typescript
 * Run: npx openapi-typescript http://localhost:9500/api-json -o app/types/api.d.ts
 */

// Base Entity Types
export interface About {
  id: number
  title: string
  description: string
  image?: string | null
  locale: 'pt-BR' | 'en-US'
  created_at: string
  updated_at: string
}

export interface Experience {
  id: number
  company: string
  role: string
  start_date: string
  end_date?: string | null
  translations: ExperienceTranslation[]
  created_at: string
  updated_at: string
}

export interface ExperienceTranslation {
  locale: 'pt-BR' | 'en-US'
  description: string
}

export interface Post {
  id: number
  slug: string
  image?: string | null
  title: string
  subtitle?: string | null
  content: string
  locale: 'pt-BR' | 'en-US'
  created_at: string
  updated_at: string
  techs?: Tech[]
}

export interface PostTranslation {
  locale: 'pt-BR' | 'en-US'
  title: string
  subtitle?: string | null
  content: string
}

export interface Project {
  id: number
  name: string
  slug: string
  image?: string | null
  title: string
  content: string
  locale: 'pt-BR' | 'en-US'
  created_at: string
  updated_at: string
  techs?: Tech[]
}

export interface ProjectTranslation {
  locale: 'pt-BR' | 'en-US'
  title: string
  content: string
}

export interface Social {
  id: number
  social_name: string
  social_url: string
  icon?: string
  created_at: string
  updated_at: string
}

export interface Tech {
  id: number
  name: string
  slug: string
  start_date: string
  category: 'language' | 'framework' | 'tool'
  icon?: string
  created_at: string
  updated_at: string
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[]
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface ApiResponse<T> {
  data: T
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

// Auth Types
export interface AuthResponse {
  token: string
  user: User
}

export interface User {
  id: number
  email: string
  name: string
  github_id?: string
  avatar_url?: string
}

// Form DTO Types
export type CreateAboutDTO = Omit<About, 'id' | 'created_at' | 'updated_at'> & {
  image?: File
}

export type UpdateAboutDTO = Partial<CreateAboutDTO>

export type CreateExperienceDTO = {
  company: string
  role: string
  start_date: string
  end_date?: string | null
  translations: ExperienceTranslation[]
}

export type UpdateExperienceDTO = {
  locale: string
  company?: string
  role?: string
  start_date?: string
  end_date?: string | null
  translations?: ExperienceTranslation[]
}

export type CreatePostDTO = {
  slug: string
  image?: File
  tech_ids: number[]
  translations: PostTranslation[]
}

export type UpdatePostDTO = Partial<CreatePostDTO>

export type CreateProjectDTO = {
  name: string
  slug: string
  image?: File
  tech_ids: number[]
  translations: ProjectTranslation[]
}

export type UpdateProjectDTO = Partial<CreateProjectDTO>

export type CreateSocialDTO = Omit<Social, 'id' | 'created_at' | 'updated_at'>

export type UpdateSocialDTO = Partial<CreateSocialDTO>

export type CreateTechDTO = Omit<Tech, 'id' | 'created_at' | 'updated_at'>

export type UpdateTechDTO = Partial<CreateTechDTO>
