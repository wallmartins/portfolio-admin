<script setup lang="ts">
import type { Locale } from '~/types/ai'
import { Languages, Loader2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

interface Props {
  text: string
  fromLocale: Locale
  toLocale: Locale
  type: 'post' | 'project' | 'experience' | 'about'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const emit = defineEmits<{
  (e: 'translated', text: string): void
}>()

const { translate, isAIAvailable } = useAI()
const isTranslating = ref(false)

async function handleTranslate() {
  if (!props.text) {
    toast.error('No text to translate')
    return
  }

  isTranslating.value = true

  try {
    const result = await translate({
      text: props.text,
      fromLocale: props.fromLocale,
      toLocale: props.toLocale,
      type: props.type
    })

    if (result) {
      emit('translated', result.translatedText)
      toast.success(`Translated to ${props.toLocale}`)
    }
  } catch (error: any) {
    console.error('Translation error:', error)
    toast.error('Failed to translate')
  } finally {
    isTranslating.value = false
  }
}

const localeLabel = computed(() => {
  return props.toLocale === 'pt-BR' ? 'Português' : 'English'
})
</script>

<template>
  <UiButton
    type="button"
    variant="outline"
    size="sm"
    @click="handleTranslate"
    :disabled="disabled || isTranslating || !text || !isAIAvailable"
  >
    <Loader2 v-if="isTranslating" class="w-4 h-4 mr-2 animate-spin" />
    <Languages v-else class="w-4 h-4 mr-2" />
    {{ isTranslating ? 'Translating...' : `Translate to ${localeLabel}` }}
  </UiButton>
</template>
