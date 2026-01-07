import { z } from 'zod'

export const aboutSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.any().optional(),
  locale: z.enum(['pt-BR', 'en-US'], {
    required_error: 'Locale is required'
  })
})

export type AboutFormData = z.infer<typeof aboutSchema>
