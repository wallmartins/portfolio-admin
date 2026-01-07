/**
 * AI API Type Definitions
 *
 * These types define the contracts for the external AI backend API
 * The actual AI logic (prompts, LLM calls) lives in a separate backend service
 */

export type ContentType = 'post' | 'project' | 'expand' | 'improve'
export type Tone = 'professional' | 'casual' | 'technical'
export type Locale = 'pt-BR' | 'en-US'

// Content Generation
export interface GenerateContentRequest {
  type: ContentType
  prompt: string
  context?: {
    techs?: string[]
    currentContent?: string
    tone?: Tone
  }
}

export interface GenerateContentChunk {
  chunk?: string
  done?: boolean
  error?: string
}

// Translation
export interface TranslateRequest {
  text: string
  fromLocale: Locale
  toLocale: Locale
  type: 'post' | 'project' | 'experience' | 'about'
}

export interface TranslateResponse {
  translatedText: string
  detectedLanguage?: string
}

// SEO Generation
export interface GenerateSEORequest {
  title: string
  content: string
  type: 'post' | 'project'
}

export interface GenerateSEOResponse {
  metaDescription: string
  keywords: string[]
  suggestedSlug: string
  seoScore?: number
}

// Stream Parser
export interface StreamData {
  chunk?: string
  done?: boolean
  error?: string
}
