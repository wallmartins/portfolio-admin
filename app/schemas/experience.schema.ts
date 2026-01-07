import { z } from 'zod'

const translationSchema = z.object({
  locale: z.enum(['pt-BR', 'en-US'], {
    required_error: 'Locale is required'
  }),
  description: z.string().min(1, 'Description is required')
})

export const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional().nullable(),
  is_current: z.boolean().default(false),
  translations: z.array(translationSchema).min(1, 'At least one translation is required')
})

export type ExperienceFormData = z.infer<typeof experienceSchema>
export type TranslationFormData = z.infer<typeof translationSchema>
