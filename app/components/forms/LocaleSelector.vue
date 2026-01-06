<script setup lang="ts">
type Locale = 'pt-BR' | 'en-US'

interface Props {
  modelValue: Locale
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Language'
})

const emit = defineEmits<{
  'update:modelValue': [value: Locale]
}>()

const locales: { value: Locale; label: string; flag: string }[] = [
  { value: 'pt-BR', label: 'Portuguese (BR)', flag: '🇧🇷' },
  { value: 'en-US', label: 'English (US)', flag: '🇺🇸' }
]

function handleChange(value: any) {
  if (typeof value === 'string') {
    emit('update:modelValue', value as Locale)
  }
}
</script>

<template>
  <div class="space-y-2">
    <UiLabel v-if="props.label">
      {{ props.label }}
    </UiLabel>

    <UiSelect :model-value="props.modelValue" @update:model-value="handleChange">
      <UiSelectTrigger>
        <UiSelectValue :placeholder="'Select language'" />
      </UiSelectTrigger>
      <UiSelectContent>
        <UiSelectItem v-for="locale in locales" :key="locale.value" :value="locale.value">
          <span class="flex items-center gap-2">
            <span>{{ locale.flag }}</span>
            <span>{{ locale.label }}</span>
          </span>
        </UiSelectItem>
      </UiSelectContent>
    </UiSelect>
  </div>
</template>
