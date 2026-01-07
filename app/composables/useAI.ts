import type {
  GenerateContentRequest,
  GenerateContentChunk,
  TranslateRequest,
  TranslateResponse,
  GenerateSEORequest,
  GenerateSEOResponse,
  StreamData
} from '~/types/ai'
import { toast } from 'vue-sonner'

/**
 * AI Composable
 *
 * Handles communication with external AI backend API
 * The AI backend is a separate service that contains all AI logic,
 * prompts, and LLM integrations (OpenAI, Anthropic, etc.)
 *
 * This composable only handles:
 * - HTTP requests to AI API
 * - SSE stream parsing
 * - Error handling
 */
export const useAI = () => {
  const config = useRuntimeConfig()
  const aiApiUrl = config.public.aiApiUrl

  /**
   * Generic SSE stream parser
   * Parses Server-Sent Events from AI API
   */
  async function* streamFromAI(endpoint: string, payload: any): AsyncGenerator<StreamData> {
    try {
      const response = await fetch(`${aiApiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`AI API error: ${response.statusText}`)
      }

      if (!response.body) {
        throw new Error('No response body')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          yield { done: true }
          break
        }

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              yield data
            } catch (e) {
              console.error('Failed to parse SSE data:', e)
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Stream error:', error)
      yield { error: error.message, done: true }
    }
  }

  /**
   * Content Generation with Streaming
   * Generates content for posts/projects with real-time streaming
   */
  const generateContent = async (
    request: GenerateContentRequest
  ): Promise<AsyncGenerator<GenerateContentChunk>> => {
    return streamFromAI('/ai/generate-content', request)
  }

  /**
   * Translation (non-streaming)
   * Translates text between pt-BR and en-US
   */
  const translate = async (
    request: TranslateRequest
  ): Promise<TranslateResponse | null> => {
    try {
      const response = await $fetch<TranslateResponse>(`${aiApiUrl}/ai/translate`, {
        method: 'POST',
        body: request
      })
      return response
    } catch (error: any) {
      console.error('Translation error:', error)
      toast.error(error.message || 'Failed to translate')
      return null
    }
  }

  /**
   * SEO Generation (non-streaming)
   * Generates SEO metadata for posts/projects
   */
  const generateSEO = async (
    request: GenerateSEORequest
  ): Promise<GenerateSEOResponse | null> => {
    try {
      const response = await $fetch<GenerateSEOResponse>(`${aiApiUrl}/ai/generate-seo`, {
        method: 'POST',
        body: request
      })
      return response
    } catch (error: any) {
      console.error('SEO generation error:', error)
      toast.error(error.message || 'Failed to generate SEO')
      return null
    }
  }

  /**
   * Check if AI API is available
   */
  const isAIAvailable = computed(() => {
    return !!aiApiUrl && aiApiUrl !== 'http://localhost:3001'
  })

  return {
    generateContent,
    translate,
    generateSEO,
    isAIAvailable
  }
}
