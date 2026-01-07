import { z } from 'zod'

export const techSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  start_date: z.string().min(1, 'Start date is required'),
  category: z.enum(['language', 'framework', 'tool'], {
    required_error: 'Category is required'
  }),
  icon: z.string().optional()
})

export type TechFormData = z.infer<typeof techSchema>
