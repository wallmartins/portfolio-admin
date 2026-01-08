<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { aboutSchema, type AboutFormData } from '~/schemas/about.schema'
import type { About } from '~/types/api'
import { X, Save } from 'lucide-vue-next'

interface Props {
  about?: About
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false
})

const emit = defineEmits<{
  (e: 'submit', data: AboutFormData): void
  (e: 'cancel'): void
}>()

const imageFile = ref<File | null>(null)

const { handleSubmit, resetForm, setValues, values } = useForm({
  validationSchema: toTypedSchema(aboutSchema),
  initialValues: props.about ? {
    title: props.about.title,
    description: props.about.description,
    image: props.about.image || undefined,
    locale: props.about.locale
  } : {
    title: '',
    description: '',
    image: undefined,
    locale: 'pt-BR' as const
  }
})

watch(() => props.about, (newAbout) => {
  if (newAbout) {
    setValues({
      title: newAbout.title,
      description: newAbout.description,
      image: newAbout.image || undefined,
      locale: newAbout.locale
    })
  }
}, { immediate: true })

const onSubmit = handleSubmit((formValues) => {
  const data: AboutFormData = {
    ...formValues,
    image: imageFile.value || formValues.image
  }
  emit('submit', data)
})

const onCancel = () => {
  resetForm()
  imageFile.value = null
  emit('cancel')
}

const handleImageChange = (file: File | null) => {
  imageFile.value = file
}

const localeOptions = [
  { label: 'Português (BR)', value: 'pt-BR' },
  { label: 'English (US)', value: 'en-US' }
]
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-6">
    <div class="space-y-2">
      <UiLabel for="locale">
        Language
        <span class="text-destructive">*</span>
      </UiLabel>
      <Field v-slot="{ field, errors }" name="locale">
        <UiSelect v-bind="field" @update:model-value="field.onChange">
          <UiSelectTrigger :class="{ 'border-destructive': errors.length > 0 }">
            <UiSelectValue placeholder="Select a language" />
          </UiSelectTrigger>
          <UiSelectContent>
            <UiSelectItem
              v-for="option in localeOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </UiSelectItem>
          </UiSelectContent>
        </UiSelect>
        <ErrorMessage name="locale" class="text-sm text-destructive" />
      </Field>
    </div>

    <FormField
      name="title"
      label="Title"
      placeholder="e.g. Full Stack Developer"
      required
    />

    <FormField
      name="description"
      label="Description"
      as="textarea"
      placeholder="Write a brief description about yourself..."
      required
    />

    <div class="space-y-2">
      <UiLabel>Profile Image</UiLabel>
      <ImageUpload
        :model-value="imageFile || values.image"
        @update:model-value="handleImageChange"
        label="Upload profile image"
        description="Recommended: Square image, max 5MB"
      />
    </div>

    <div class="flex justify-end gap-4">
      <UiButton
        type="button"
        variant="outline"
        @click="onCancel"
        :disabled="props.isLoading"
        class="flex items-center gap-2"
      >
        <X class="w-4 h-4" />
        Cancel
      </UiButton>
      <UiButton
        type="submit"
        :disabled="props.isLoading"
        class="flex items-center gap-2"
      >
        <Save v-if="!props.isLoading" class="w-4 h-4" />
        {{ props.isLoading ? 'Saving...' : (props.about ? 'Update' : 'Create') }}
      </UiButton>
    </div>
  </form>
</template>
