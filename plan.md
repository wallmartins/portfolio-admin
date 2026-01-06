 Portfolio Admin - Technology Stack & Implementation Plan

## API Analysis Summary

**Entities:**
- **About** - Personal info (multipart/form-data, image upload, translations)
- **Experiences** - Professional experiences (JSON, translations array)
- **Posts** - Blog posts (multipart/form-data, image, translations, tech relationships)
- **Projects** - Portfolio projects (multipart/form-data, image, translations, tech relationships)
- **Social** - Social media links (simple JSON)
- **Tech** - Technologies/skills (JSON, categories: language/framework/tool)

**Key Characteristics:**
- GitHub OAuth authentication (JWT Bearer)
- Multi-language support (pt-BR, en-US)
- Image uploads (About, Posts, Projects)
- Entity relationships (Posts/Projects ↔ Techs)
- Pagination (public routes)

## Recommended Technology Stack

### Core Framework: **Nuxt 3 + TypeScript**

**Why Nuxt 3 over alternatives:**

✅ **vs Vue 3 (Vite):**
- Built-in server API routes (perfect for AI proxying without exposing API keys)
- Auto-imports (better DX, less boilerplate)
- File-based routing
- Better deployment options via Nitro

✅ **vs Astro:**
- Admin panels need rich interactivity (forms, real-time validation, drag-drop)
- Better ecosystem for complex forms and file uploads
- Astro excels at content-heavy sites, not admin dashboards

✅ **Best fit because:**
- Admin panel is private (no SEO needs)
- Multiple AI features benefit from server routes
- Complex forms with validation
- Image upload handling
- Type-safety end-to-end with auto-generated API types

### Complete Stack

#### Frontend Layer
```
- Framework: Nuxt 3 (v3.15+)
- Language: TypeScript (strict mode)
- UI: Tailwind CSS + shadcn-vue (headless, accessible components)
- Icons: unplugin-icons (on-demand icon imports)
```

#### Forms & Validation
```
- Form handling: VeeValidate 4
- Schema validation: Zod
- WYSIWYG editor: TipTap (for blog/project content)
- File upload: Custom component + Nuxt Image
```

#### State & Data Fetching
```
- HTTP client: ofetch (built-in) + useFetch composable
- API state: TanStack Query (formerly React Query) - @tanstack/vue-query
- Global state: Pinia (if needed, minimize usage)
```

#### Authentication
```
- Auth handling: Custom composable with GitHub OAuth flow
- Token storage: httpOnly cookies (server-side) or localStorage
- Route protection: Nuxt middleware
```

#### AI Integration
```
- External API client: HTTP calls to separate AI backend
- Streaming support: Server-Sent Events (SSE) parsing
- Use cases:
  * Content generation (blog posts, project descriptions)
  * Translation automation (pt-BR ↔ en-US)
  * SEO metadata generation
- Note: AI logic, prompts, and SDK integrations are in separate backend project
```

#### Developer Experience
```
- Package manager: pnpm
- Code quality: ESLint + Prettier
- Git hooks: husky + lint-staged
- Type generation: openapi-typescript (from Swagger)
```

#### Testing & Quality
```
- Unit tests: Vitest
- Component tests: @testing-library/vue
- E2E tests: Playwright
- API mocking: MSW (Mock Service Worker)
```

#### Deployment & Monitoring
```
- Deployment: Vercel / Netlify / Docker
- Error tracking: Sentry
- Analytics: Plausible / Umami (privacy-friendly)
```

## Project Structure

```
portfolio-admin/
├── .github/              # CI/CD workflows
├── app/
│   ├── assets/           # Styles, fonts
│   ├── components/       # Vue components
│   │   ├── ui/           # shadcn-vue components
│   │   ├── forms/        # Form components
│   │   ├── layouts/      # Layout components
│   │   └── features/     # Feature-specific components
│   ├── composables/      # Vue composables
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   └── useAI.ts
│   ├── layouts/          # Nuxt layouts
│   ├── middleware/       # Route middleware
│   ├── pages/            # File-based routing
│   │   ├── index.vue
│   │   ├── login.vue
│   │   ├── about/
│   │   ├── experiences/
│   │   ├── posts/
│   │   ├── projects/
│   │   ├── social/
│   │   └── techs/
│   ├── plugins/          # Nuxt plugins
│   ├── stores/           # Pinia stores
│   ├── types/            # TypeScript types
│   │   └── api.d.ts      # Generated from Swagger
│   └── utils/            # Utility functions
├── server/
│   ├── api/              # API routes (minimal usage)
│   │   └── auth/         # Auth callback handling (if needed)
│   ├── middleware/       # Server middleware
│   └── utils/            # Server utilities
├── public/               # Static assets
├── tests/                # Test files
├── nuxt.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Implementation Phases

### Phase 1: Project Setup & Foundation
**Goal:** Initialize project with all dependencies and tooling

**Tasks:**
1. Initialize Nuxt 3 project with TypeScript
2. Install and configure dependencies:
   - Tailwind CSS
   - shadcn-vue
   - VeeValidate + Zod
   - TanStack Query
   - Pinia
3. Generate TypeScript types from Swagger (openapi-typescript)
4. Setup ESLint, Prettier, husky
5. Configure environment variables
6. Create base layout structure

**Files to create:**
- `nuxt.config.ts` - Main config
- `tailwind.config.ts` - Tailwind setup
- `.env.example` - Environment template
- `app/layouts/default.vue` - Main layout
- `app/layouts/auth.vue` - Auth layout (login page)

### Phase 2: Authentication System
**Goal:** Implement GitHub OAuth flow

**Tasks:**
1. Create GitHub OAuth redirect handler (`/auth/github/redirect`)
2. Create OAuth callback handler (`/auth/github/callback`)
3. Implement auth composable (`useAuth`)
4. Create auth middleware for protected routes
5. Design and build login page
6. Implement token refresh logic
7. Add logout functionality

**Files to create:**
- `server/api/auth/github-redirect.get.ts`
- `server/api/auth/github-callback.get.ts`
- `composables/useAuth.ts`
- `middleware/auth.global.ts`
- `pages/login.vue`

### Phase 3: Core API Integration
**Goal:** Setup API client and data fetching patterns

**Tasks:**
1. Create API client composable with auth headers
2. Setup TanStack Query configuration
3. Create CRUD composables for each entity:
   - `useAbout`
   - `useExperiences`
   - `usePosts`
   - `useProjects`
   - `useSocial`
   - `useTechs`
4. Implement error handling and toast notifications
5. Add loading states and skeletons

**Files to create:**
- `composables/useApi.ts`
- `composables/entities/useAbout.ts`
- `composables/entities/useExperiences.ts`
- `composables/entities/usePosts.ts`
- `composables/entities/useProjects.ts`
- `composables/entities/useSocial.ts`
- `composables/entities/useTechs.ts`
- `plugins/vue-query.ts`

### Phase 4: UI Components Library
**Goal:** Build reusable component system

**Tasks:**
1. Setup shadcn-vue base components:
   - Button, Input, Select, Textarea
   - Dialog, Sheet, Dropdown
   - Table, Card, Badge
   - Alert, Toast
2. Create form components:
   - FormField (VeeValidate wrapper)
   - ImageUpload
   - MultiSelect (for tech IDs)
   - LocaleSelector
   - RichTextEditor (TipTap)
3. Create layout components:
   - Sidebar navigation
   - Header with user menu
   - Empty states
   - Loading skeletons

**Files to create:**
- `components/ui/*` - shadcn-vue components
- `components/forms/ImageUpload.vue`
- `components/forms/MultiSelect.vue`
- `components/forms/RichTextEditor.vue`
- `components/layouts/Sidebar.vue`
- `components/layouts/Header.vue`

### Phase 5: CRUD Pages - Technologies & Social
**Goal:** Implement simplest entities first (no translations, no images)

**Tasks:**
1. **Technologies (Tech):**
   - List page with table
   - Create form with validation
   - Edit form
   - Delete confirmation
   - Category filtering

2. **Social Media Links:**
   - List page with table
   - Create form
   - Edit form
   - Delete confirmation

**Files to create:**
- `pages/techs/index.vue`
- `pages/techs/create.vue`
- `pages/techs/[id]/edit.vue`
- `pages/social/index.vue`
- `pages/social/create.vue`
- `pages/social/[id]/edit.vue`
- `components/features/techs/TechForm.vue`
- `components/features/social/SocialForm.vue`

### Phase 6: CRUD Pages - About & Experiences
**Goal:** Add entities with translations (no image for Experiences, with image for About)

**Tasks:**
1. **About:**
   - Form with image upload
   - Translation fields (pt-BR, en-US)
   - Preview component
   - Edit/delete

2. **Experiences:**
   - List with timeline view
   - Create form with translations array
   - Date range picker
   - Current job toggle (no end_date)

**Files to create:**
- `pages/about/index.vue`
- `pages/about/create.vue`
- `pages/about/[id]/edit.vue`
- `pages/experiences/index.vue`
- `pages/experiences/create.vue`
- `pages/experiences/[id]/edit.vue`
- `components/features/about/AboutForm.vue`
- `components/features/experiences/ExperienceForm.vue`
- `components/features/experiences/TimelineView.vue`

### Phase 7: CRUD Pages - Posts & Projects
**Goal:** Complex entities with images, translations, and tech relationships

**Tasks:**
1. **Blog Posts:**
   - List with pagination
   - Rich text editor for content
   - Image upload with preview
   - Multi-select for techs
   - Slug auto-generation from title
   - Duplicate post feature (for translations)

2. **Projects:**
   - Similar to Posts
   - Image upload
   - Tech selection
   - Slug handling

**Files to create:**
- `pages/posts/index.vue`
- `pages/posts/create.vue`
- `pages/posts/[id]/edit.vue`
- `pages/projects/index.vue`
- `pages/projects/create.vue`
- `pages/projects/[id]/edit.vue`
- `components/features/posts/PostForm.vue`
- `components/features/posts/PostCard.vue`
- `components/features/projects/ProjectForm.vue`
- `components/features/projects/ProjectCard.vue`

### Phase 8: AI Features Integration (FRONTEND ONLY - PRIORITY FEATURES)
**Goal:** Integrate frontend with external AI API (backend service)

> **IMPORTANT:** The AI logic (prompts, OpenAI/Anthropic connection, etc.) will be implemented in a **separate backend project**. This frontend will only consume the AI API endpoints via HTTP, handle streaming responses, and render the UI.

**Architecture:**
```
┌─────────────────┐      HTTP/SSE      ┌──────────────────┐      AI SDKs      ┌─────────────┐
│  Nuxt Frontend  │ ─────────────────> │   AI Backend     │ ───────────────> │  OpenAI/    │
│  (This project) │ <───────────────── │  (Separate API)  │ <─────────────── │  Anthropic  │
└─────────────────┘    Streaming       └──────────────────┘                   └─────────────┘
```

**Priority AI Features (v1):**

#### 1. Content Generation (HIGH PRIORITY)
**UI Features:**
- "✨ Generate with AI" button in post/project forms
- Inline "Expand this section" buttons in rich text editor
- Streaming responses with typewriter effect
- Option to accept/reject/regenerate
- Loading states and error handling

**API Contract (to be consumed):**
```typescript
// POST /ai/generate-content
// Request:
{
  type: 'post' | 'project' | 'expand' | 'improve',
  prompt: string,              // User input or topic
  context?: {
    techs?: string[],          // For project descriptions
    currentContent?: string,   // For expand/improve
    tone?: 'professional' | 'casual' | 'technical'
  }
}

// Response: SSE Stream
data: {"chunk": "Generated text fragment..."}
data: {"chunk": "more text..."}
data: {"done": true}
```

#### 2. Translation Automation (HIGH PRIORITY)
**UI Features:**
- "🌍 Auto-translate to [locale]" button when editing translations
- Visual diff showing what was translated
- Edit translated text before saving
- Batch translate all fields at once

**API Contract:**
```typescript
// POST /ai/translate
// Request:
{
  text: string,
  fromLocale: 'pt-BR' | 'en-US',
  toLocale: 'pt-BR' | 'en-US',
  type: 'post' | 'project' | 'experience' | 'about'
}

// Response: JSON (non-streaming for translations)
{
  translatedText: string,
  detectedLanguage?: string
}
```

#### 3. SEO & Meta Descriptions (HIGH PRIORITY)
**UI Features:**
- "🎯 Generate SEO" button in forms
- Preview how it appears in Google search results
- SEO score indicator (title length, keyword usage, etc.)
- Editable before applying

**API Contract:**
```typescript
// POST /ai/generate-seo
// Request:
{
  title: string,
  content: string,
  type: 'post' | 'project'
}

// Response: JSON
{
  metaDescription: string,  // 150-160 chars
  keywords: string[],       // 5 relevant keywords
  suggestedSlug: string,    // SEO-friendly slug
  seoScore?: number         // Optional score 0-100
}
```

**Frontend Implementation:**

```typescript
// composables/useAI.ts
export function useAI() {
  const config = useRuntimeConfig()
  const aiApiUrl = config.public.aiApiUrl // External AI backend URL

  // Generic streaming handler
  async function* streamFromAI(endpoint: string, payload: any) {
    const response = await fetch(`${aiApiUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader!.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6))
          yield data
        }
      }
    }
  }

  // Content generation with streaming
  const generateContent = async (
    type: 'post' | 'project' | 'expand' | 'improve',
    prompt: string,
    context?: any
  ) => {
    return streamFromAI('/ai/generate-content', { type, prompt, context })
  }

  // Translation (non-streaming)
  const translate = async (
    text: string,
    fromLocale: string,
    toLocale: string,
    type: string
  ) => {
    const response = await $fetch(`${aiApiUrl}/ai/translate`, {
      method: 'POST',
      body: { text, fromLocale, toLocale, type }
    })
    return response
  }

  // SEO generation (non-streaming)
  const generateSEO = async (
    title: string,
    content: string,
    type: 'post' | 'project'
  ) => {
    const response = await $fetch(`${aiApiUrl}/ai/generate-seo`, {
      method: 'POST',
      body: { title, content, type }
    })
    return response
  }

  return {
    generateContent,
    translate,
    generateSEO
  }
}
```

```vue
<!-- components/features/ai/ContentGeneratorButton.vue -->
<template>
  <div>
    <Button @click="generate" :disabled="isGenerating">
      <span v-if="!isGenerating">✨ Generate with AI</span>
      <span v-else>Generating...</span>
    </Button>

    <div v-if="generatedContent" class="mt-4">
      <div class="streaming-text">{{ generatedContent }}</div>
      <div class="actions">
        <Button @click="acceptContent">Accept</Button>
        <Button @click="regenerate">Regenerate</Button>
        <Button @click="cancel">Cancel</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  type: 'post' | 'project'
  prompt: string
  context?: any
}>()

const emit = defineEmits<{
  (e: 'generated', content: string): void
}>()

const { generateContent } = useAI()
const isGenerating = ref(false)
const generatedContent = ref('')

async function generate() {
  isGenerating.value = true
  generatedContent.value = ''

  try {
    const stream = await generateContent(props.type, props.prompt, props.context)

    for await (const data of stream) {
      if (data.chunk) {
        generatedContent.value += data.chunk
      }
      if (data.done) {
        break
      }
    }
  } catch (error) {
    console.error('AI generation error:', error)
    // Show error toast
  } finally {
    isGenerating.value = false
  }
}

function acceptContent() {
  emit('generated', generatedContent.value)
  generatedContent.value = ''
}

function regenerate() {
  generate()
}

function cancel() {
  generatedContent.value = ''
}
</script>
```

**Files to create:**
- `composables/useAI.ts` - AI API client with streaming support
- `components/features/ai/ContentGeneratorButton.vue` - Generate content UI
- `components/features/ai/TranslateButton.vue` - Translation UI
- `components/features/ai/SEOGenerator.vue` - SEO generation UI
- `components/features/ai/StreamingText.vue` - Reusable streaming text component
- `types/ai.d.ts` - TypeScript interfaces for AI API contracts
- `utils/streamParser.ts` - SSE stream parsing utilities

**NO server routes needed** - Direct calls to external AI backend API

### Phase 9: Dashboard & Analytics
**Goal:** Create overview dashboard

**Tasks:**
1. Stats cards (total posts, projects, techs)
2. Recent activity feed
3. Quick actions
4. Content calendar view
5. Tech usage chart

**Files to create:**
- `pages/index.vue` (dashboard)
- `components/features/dashboard/StatsCard.vue`
- `components/features/dashboard/ActivityFeed.vue`
- `components/features/dashboard/ContentCalendar.vue`

### Phase 10: Testing & Quality
**Goal:** Comprehensive test coverage

**Tasks:**
1. Unit tests for composables
2. Component tests for forms
3. E2E tests for critical flows:
   - Login flow
   - Create/edit/delete post
   - Image upload
4. Setup CI/CD pipeline
5. Error boundary components
6. Sentry integration

**Files to create:**
- `tests/unit/composables/*.test.ts`
- `tests/unit/components/*.test.ts`
- `tests/e2e/auth.spec.ts`
- `tests/e2e/posts.spec.ts`
- `.github/workflows/ci.yml`

### Phase 11: Polish & Deployment to Vercel
**Goal:** Production-ready application

**Tasks:**
1. Performance optimization:
   - Code splitting
   - Image optimization (Nuxt Image module)
   - Lazy loading for heavy components
2. Accessibility audit (ARIA labels, keyboard navigation)
3. Mobile responsiveness testing
4. Dark mode support (optional - can be added later)
5. Documentation:
   - README with setup instructions
   - Environment variables documentation
   - AI features usage guide
6. **Vercel deployment setup:**
   - Install Vercel CLI
   - Configure `vercel.json` if needed
   - Set environment variables in Vercel dashboard
   - Enable Edge Functions for AI routes (optional)
   - Configure custom domain (if applicable)
7. Production testing:
   - Test GitHub OAuth callback with production URL
   - Verify AI features work on Vercel
   - Check image uploads
   - Monitor Vercel logs

**Vercel Configuration:**
```json
// vercel.json (if needed for custom config)
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "framework": "nuxtjs",
  "regions": ["gru1"]  // São Paulo region for lower latency
}
```

**Deployment commands:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Key Technical Decisions

### Type Safety Strategy
```typescript
// Generate types from Swagger
// types/api.d.ts (auto-generated)
export interface Post {
  id: number
  slug: string
  title: string
  // ... all fields from Swagger
}

// Form schemas with Zod
// schemas/post.schema.ts
export const createPostSchema = z.object({
  slug: z.string().min(1),
  translations: z.array(z.object({
    locale: z.enum(['pt-BR', 'en-US']),
    title: z.string().min(1),
    content: z.string().min(1)
  })),
  tech_ids: z.array(z.number())
})
```

### API Client Pattern
```typescript
// composables/useApi.ts
export function useApi() {
  const auth = useAuth()

  const api = $fetch.create({
    baseURL: 'http://localhost:9500',
    headers: {
      Authorization: `Bearer ${auth.token.value}`
    }
  })

  return { api }
}

// composables/entities/usePosts.ts
export function usePosts() {
  const { api } = useApi()

  const fetchPosts = useQuery({
    queryKey: ['posts'],
    queryFn: () => api<{ data: Post[] }>('/portfolio/blog')
  })

  const createPost = useMutation({
    mutationFn: (data: CreatePostDTO) =>
      api('/admin/posts', { method: 'POST', body: data })
  })

  return { fetchPosts, createPost }
}
```

### AI Integration Pattern
```typescript
// server/api/ai/generate-content.post.ts
export default defineEventHandler(async (event) => {
  const { prompt, type } = await readBody(event)
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const stream = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: prompt }],
    stream: true
  })

  return stream // Stream to client
})
```

## Environment Variables

```env
# Portfolio API (main backend)
NUXT_PUBLIC_API_URL=http://localhost:9500

# AI API (separate backend service)
NUXT_PUBLIC_AI_API_URL=http://localhost:PORT_DO_BACKEND_IA

# Auth
NUXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_secret

# Monitoring (Optional - can add later)
SENTRY_DSN=https://...

# Vercel Deployment
VERCEL_URL=auto-set-by-vercel
```

**Note:** No AI API keys needed in frontend - they stay in the separate AI backend service.

## Success Criteria

✅ All CRUD operations working for all entities
✅ GitHub OAuth authentication functional
✅ Type-safe API integration (no `any` types)
✅ Image upload working correctly
✅ Multi-language support (pt-BR, en-US)
✅ **3 priority AI features fully integrated:**
   - Content generation for posts/projects
   - Auto-translation pt-BR ↔ en-US
   - SEO meta descriptions generator
✅ Responsive design (mobile + desktop)
✅ Error handling with user-friendly messages
✅ Test coverage >70%
✅ Production deployment on Vercel working
✅ shadcn-vue UI components implemented

## Estimated Complexity

- **Setup & Foundation:** Low complexity
- **Authentication:** Medium complexity (OAuth flow)
- **CRUD Pages:** Medium complexity (forms + validation)
- **AI Integration:** High complexity (multiple providers, streaming, cost management)
- **Testing:** Medium complexity

This is a comprehensive, production-ready admin panel with modern best practices and AI-powered features.
