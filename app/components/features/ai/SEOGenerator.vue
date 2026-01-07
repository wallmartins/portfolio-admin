<script setup lang="ts">
import { Target, Check, X } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

interface Props {
  title: string
  content: string
  type: 'post' | 'project'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const emit = defineEmits<{
  (e: 'generated', data: { metaDescription: string; keywords: string[]; suggestedSlug: string }): void
}>()

const { generateSEO, isAIAvailable } = useAI()

const isGenerating = ref(false)
const showPreview = ref(false)
const seoData = ref<{
  metaDescription: string
  keywords: string[]
  suggestedSlug: string
  seoScore?: number
} | null>(null)

async function generate() {
  if (!props.title || !props.content) {
    toast.error('Please provide title and content first')
    return
  }

  isGenerating.value = true

  try {
    const result = await generateSEO({
      title: props.title,
      content: props.content,
      type: props.type
    })

    if (result) {
      seoData.value = result
      showPreview.value = true
      toast.success('SEO generated successfully')
    }
  } catch (error: any) {
    console.error('SEO generation error:', error)
    toast.error('Failed to generate SEO')
  } finally {
    isGenerating.value = false
  }
}

function acceptSEO() {
  if (!seoData.value) return

  emit('generated', {
    metaDescription: seoData.value.metaDescription,
    keywords: seoData.value.keywords,
    suggestedSlug: seoData.value.suggestedSlug
  })

  showPreview.value = false
  seoData.value = null
}

function cancel() {
  showPreview.value = false
  seoData.value = null
}
</script>

<template>
  <div class="space-y-4">
    <UiButton
      type="button"
      variant="outline"
      @click="generate"
      :disabled="disabled || isGenerating || !isAIAvailable"
    >
      <Target class="w-4 h-4 mr-2" />
      {{ isGenerating ? 'Generating SEO...' : 'Generate SEO' }}
    </UiButton>

    <div v-if="showPreview && seoData" class="space-y-4 p-4 bg-muted/50 rounded-lg border">
      <div>
        <h4 class="text-sm font-semibold mb-2">Meta Description</h4>
        <p class="text-sm">{{ seoData.metaDescription }}</p>
        <p class="text-xs text-muted-foreground mt-1">
          {{ seoData.metaDescription.length }} characters
        </p>
      </div>

      <div>
        <h4 class="text-sm font-semibold mb-2">Keywords</h4>
        <div class="flex flex-wrap gap-1">
          <UiBadge v-for="keyword in seoData.keywords" :key="keyword" variant="secondary">
            {{ keyword }}
          </UiBadge>
        </div>
      </div>

      <div>
        <h4 class="text-sm font-semibold mb-2">Suggested Slug</h4>
        <code class="text-sm bg-background px-2 py-1 rounded">{{ seoData.suggestedSlug }}</code>
      </div>

      <div v-if="seoData.seoScore !== undefined">
        <h4 class="text-sm font-semibold mb-2">SEO Score</h4>
        <div class="flex items-center gap-2">
          <div class="flex-1 bg-muted rounded-full h-2">
            <div
              class="bg-primary h-2 rounded-full transition-all"
              :style="{ width: `${seoData.seoScore}%` }"
            />
          </div>
          <span class="text-sm font-medium">{{ seoData.seoScore }}/100</span>
        </div>
      </div>

      <div class="flex gap-2 pt-2">
        <UiButton
          type="button"
          size="sm"
          @click="acceptSEO"
        >
          <Check class="w-4 h-4 mr-2" />
          Apply SEO
        </UiButton>
        <UiButton
          type="button"
          variant="ghost"
          size="sm"
          @click="cancel"
        >
          <X class="w-4 h-4 mr-2" />
          Cancel
        </UiButton>
      </div>
    </div>

    <p v-if="!isAIAvailable" class="text-sm text-muted-foreground">
      AI features are currently unavailable. Configure NUXT_PUBLIC_AI_API_URL in your .env file.
    </p>
  </div>
</template>
