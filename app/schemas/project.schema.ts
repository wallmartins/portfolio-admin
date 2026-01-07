import { z } from 'zod'

const translationSchema = z.object({
  locale: z.enum(['pt-BR', 'en-US'], {
    required_error: 'Locale is required'
  }),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required')
})

export const projectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  image: z.any().optional(),
  tech_ids: z.array(z.number()).default([]),
  translations: z.array(translationSchema).min(1, 'At least one translation is required')
})

export type ProjectFormData = z.infer<typeof projectSchema>
export type ProjectTranslationFormData = z.infer<typeof translationSchema>
