import { z } from 'zod'

export const socialSchema = z.object({
  social_name: z.string().min(1, 'Name is required'),
  social_url: z.string().url('Must be a valid URL'),
  icon: z.string().optional()
})

export type SocialFormData = z.infer<typeof socialSchema>
