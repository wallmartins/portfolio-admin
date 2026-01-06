/**
 * API Type Definitions
 *
 * TODO: Generate these types from Swagger using openapi-typescript
 * Run: npx openapi-typescript http://localhost:9500/api-json -o app/types/api.d.ts
 */

// Base Entity Types
export interface About {
  id: number
  name: string
  bio: string
  image?: string
  created_at: string
  updated_at: string
  translations: AboutTranslation[]
}

export interface AboutTranslation {
  id?: number
  locale: 'pt-BR' | 'en-US'
  name: string
  bio: string
}

export interface Experience {
  id: number
  company: string
  role: string
  start_date: string
  end_date?: string | null
  created_at: string
  updated_at: string
  translations: ExperienceTranslation[]
}

export interface ExperienceTranslation {
  id?: number
  locale: 'pt-BR' | 'en-US'
  company: string
  role: string
  description?: string
}

export interface Post {
  id: number
  slug: string
  image?: string
  created_at: string
  updated_at: string
  translations: PostTranslation[]
  techs?: Tech[]
  tech_ids?: number[]
}

export interface PostTranslation {
  id?: number
  locale: 'pt-BR' | 'en-US'
  title: string
  content: string
  description?: string
}

export interface Project {
  id: number
  slug: string
  image?: string
  github_url?: string
  demo_url?: string
  created_at: string
  updated_at: string
  translations: ProjectTranslation[]
  techs?: Tech[]
  tech_ids?: number[]
}

export interface ProjectTranslation {
  id?: number
  locale: 'pt-BR' | 'en-US'
  title: string
  description: string
}

export interface Social {
  id: number
  name: string
  url: string
  icon?: string
  created_at: string
  updated_at: string
}

export interface Tech {
  id: number
  name: string
  slug: string
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

export type CreateExperienceDTO = Omit<Experience, 'id' | 'created_at' | 'updated_at'>

export type UpdateExperienceDTO = Partial<CreateExperienceDTO>

export type CreatePostDTO = Omit<Post, 'id' | 'created_at' | 'updated_at' | 'techs'> & {
  image?: File
  tech_ids: number[]
}

export type UpdatePostDTO = Partial<CreatePostDTO>

export type CreateProjectDTO = Omit<Project, 'id' | 'created_at' | 'updated_at' | 'techs'> & {
  image?: File
  tech_ids: number[]
}

export type UpdateProjectDTO = Partial<CreateProjectDTO>

export type CreateSocialDTO = Omit<Social, 'id' | 'created_at' | 'updated_at'>

export type UpdateSocialDTO = Partial<CreateSocialDTO>

export type CreateTechDTO = Omit<Tech, 'id' | 'created_at' | 'updated_at'>

export type UpdateTechDTO = Partial<CreateTechDTO>
