<script setup lang="ts">
import type { ContentType, Tone } from '~/types/ai'
import { Sparkles, Check, X, RotateCw } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

interface Props {
  type: ContentType
  prompt?: string
  context?: {
    techs?: string[]
    currentContent?: string
    tone?: Tone
  }
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const emit = defineEmits<{
  (e: 'generated', content: string): void
}>()

const { generateContent, isAIAvailable } = useAI()

const isGenerating = ref(false)
const generatedContent = ref('')
const showPreview = ref(false)

async function generate() {
  if (!props.prompt) {
    toast.error('Please provide a prompt or topic')
    return
  }

  isGenerating.value = true
  generatedContent.value = ''
  showPreview.value = true

  try {
    const stream = await generateContent({
      type: props.type,
      prompt: props.prompt,
      context: props.context
    })

    for await (const data of stream) {
      if (data.chunk) {
        generatedContent.value += data.chunk
      }
      if (data.done || data.error) {
        if (data.error) {
          toast.error(data.error)
        }
        break
      }
    }
  } catch (error: any) {
    console.error('AI generation error:', error)
    toast.error('Failed to generate content')
  } finally {
    isGenerating.value = false
  }
}

function acceptContent() {
  emit('generated', generatedContent.value)
  generatedContent.value = ''
  showPreview.value = false
}

function regenerate() {
  generate()
}

function cancel() {
  generatedContent.value = ''
  showPreview.value = false
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
      <Sparkles class="w-4 h-4 mr-2" />
      {{ isGenerating ? 'Generating...' : 'Generate with AI' }}
    </UiButton>

    <div v-if="showPreview" class="space-y-4">
      <StreamingText :text="generatedContent" :is-streaming="isGenerating" />

      <div v-if="!isGenerating && generatedContent" class="flex gap-2">
        <UiButton
          type="button"
          size="sm"
          @click="acceptContent"
        >
          <Check class="w-4 h-4 mr-2" />
          Accept
        </UiButton>
        <UiButton
          type="button"
          variant="outline"
          size="sm"
          @click="regenerate"
        >
          <RotateCw class="w-4 h-4 mr-2" />
          Regenerate
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
