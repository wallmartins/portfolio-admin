<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { techSchema, type TechFormData } from '~/schemas/tech.schema'
import type { Tech } from '~/types/api'

interface Props {
  tech?: Tech
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false
})

const emit = defineEmits<{
  (e: 'submit', data: TechFormData): void
  (e: 'cancel'): void
}>()

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: toTypedSchema(techSchema),
  initialValues: props.tech ? {
    name: props.tech.name,
    slug: props.tech.slug,
    start_date: props.tech.start_date,
    category: props.tech.category,
    icon: props.tech.icon || ''
  } : {
    name: '',
    slug: '',
    start_date: '',
    category: undefined,
    icon: ''
  }
})

// Auto-generate slug from name
watch(() => props.tech, (newTech) => {
  if (newTech) {
    setValues({
      name: newTech.name,
      slug: newTech.slug,
      start_date: newTech.start_date,
      category: newTech.category,
      icon: newTech.icon || ''
    })
  }
}, { immediate: true })

const onSubmit = handleSubmit((values) => {
  emit('submit', values)
})

const onCancel = () => {
  resetForm()
  emit('cancel')
}

// Auto-generate slug from name
const handleNameInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const name = target.value
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

  setValues({ slug })
}

const categoryOptions = [
  { label: 'Language', value: 'language' },
  { label: 'Framework', value: 'framework' },
  { label: 'Tool', value: 'tool' }
]
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-6">
    <FormField
      name="name"
      label="Name"
      placeholder="e.g. TypeScript, React, Docker"
      required
      @input="handleNameInput"
    />

    <FormField
      name="slug"
      label="Slug"
      placeholder="e.g. typescript, react, docker"
      description="Auto-generated from name, or customize it"
      required
    />

    <FormField
      name="start_date"
      label="Start Date"
      type="date"
      description="When you started using this technology"
      required
    />

    <div class="space-y-2">
      <UiLabel for="category">
        Category
        <span class="text-destructive">*</span>
      </UiLabel>
      <Field v-slot="{ field, errors }" name="category">
        <UiSelect v-bind="field" @update:model-value="field.onChange">
          <UiSelectTrigger :class="{ 'border-destructive': errors.length > 0 }">
            <UiSelectValue placeholder="Select a category" />
          </UiSelectTrigger>
          <UiSelectContent>
            <UiSelectItem
              v-for="option in categoryOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </UiSelectItem>
          </UiSelectContent>
        </UiSelect>
        <ErrorMessage name="category" class="text-sm text-destructive" />
      </Field>
    </div>

    <FormField
      name="icon"
      label="Icon"
      placeholder="e.g. mdi:language-typescript"
      description="Optional icon identifier (e.g. iconify icon name)"
    />

    <div class="flex justify-end gap-4">
      <UiButton
        type="button"
        variant="outline"
        @click="onCancel"
        :disabled="props.isLoading"
      >
        Cancel
      </UiButton>
      <UiButton
        type="submit"
        :disabled="props.isLoading"
      >
        {{ props.isLoading ? 'Saving...' : (props.tech ? 'Update' : 'Create') }}
      </UiButton>
    </div>
  </form>
</template>
