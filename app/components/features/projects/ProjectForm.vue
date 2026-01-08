<script setup lang="ts">
import { useForm, FieldArray } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { projectSchema, type ProjectFormData } from '~/schemas/project.schema'
import type { Project } from '~/types/api'
import { Plus, Trash2, X, Save } from 'lucide-vue-next'

interface Props {
  project?: Project
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false
})

const emit = defineEmits<{
  (e: 'submit', data: ProjectFormData): void
  (e: 'cancel'): void
}>()

const { techs } = useTechs()
const imageFile = ref<File | null>(null)

const { handleSubmit, resetForm, setValues, values } = useForm({
  validationSchema: toTypedSchema(projectSchema),
  initialValues: {
    name: props.project?.name || '',
    slug: props.project?.slug || '',
    image: props.project?.image || undefined,
    tech_ids: props.project?.techs?.map(t => t.id) || [],
    translations: props.project ? [
      {
        locale: 'pt-BR' as const,
        title: props.project.title || '',
        content: props.project.content || ''
      }
    ] : [
      {
        locale: 'pt-BR' as const,
        title: '',
        content: ''
      }
    ]
  }
})

watch(() => props.project, (newProject) => {
  if (newProject) {
    setValues({
      name: newProject.name,
      slug: newProject.slug,
      image: newProject.image || undefined,
      tech_ids: newProject.techs?.map(t => t.id) || [],
      translations: [
        {
          locale: 'pt-BR' as const,
          title: newProject.title || '',
          content: newProject.content || ''
        }
      ]
    })
  }
}, { immediate: true })

const onSubmit = handleSubmit((formValues) => {
  const data: ProjectFormData = {
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

// Auto-generate slug from name
const handleNameInput = (event: Event) => {
  if (!props.project) {
    const target = event.target as HTMLInputElement
    const name = target.value
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

    setValues({ slug })
  }
}

const localeOptions = [
  { label: 'Português (BR)', value: 'pt-BR' },
  { label: 'English (US)', value: 'en-US' }
]

const techOptions = computed(() => {
  return techs.value?.map(tech => ({
    id: tech.id,
    name: tech.name
  })) || []
})

const techIds = computed({
  get: () => values.tech_ids || [],
  set: (value) => {
    setValues({ tech_ids: value })
  }
})
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-6">
    <FormField
      name="name"
      label="Project Name"
      placeholder="e.g. Portfolio Website, E-commerce Platform"
      required
      @input="handleNameInput"
    />

    <FormField
      name="slug"
      label="Slug"
      placeholder="e.g. portfolio-website"
      description="Auto-generated from name, or customize it"
      required
    />

    <div class="space-y-2">
      <UiLabel>Project Image</UiLabel>
      <ImageUpload
        :model-value="imageFile || values.image"
        @update:model-value="handleImageChange"
        label="Upload project image"
        description="Recommended: 16:9 ratio, max 5MB"
      />
    </div>

    <div class="space-y-2">
      <UiLabel>Technologies</UiLabel>
      <MultiSelect
        v-model="techIds"
        :options="techOptions"
        placeholder="Select technologies used in this project"
      />
      <p class="text-sm text-muted-foreground">
        Select the technologies used to build this project
      </p>
    </div>

    <!-- Translations Array -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <UiLabel>
          Translations
          <span class="text-destructive">*</span>
        </UiLabel>
      </div>

      <FieldArray v-slot="{ fields, push, remove }" name="translations">
        <div class="space-y-4">
          <UiCard v-for="(field, index) in fields" :key="field.key" class="p-4">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <h4 class="text-sm font-semibold">Translation {{ index + 1 }}</h4>
                <UiButton
                  v-if="fields.length > 1"
                  type="button"
                  variant="ghost"
                  size="sm"
                  @click="remove(index)"
                >
                  <Trash2 class="w-4 h-4" />
                </UiButton>
              </div>

              <div class="space-y-2">
                <UiLabel :for="`translations.${index}.locale`">
                  Language
                  <span class="text-destructive">*</span>
                </UiLabel>
                <Field v-slot="{ field: localeField, errors }" :name="`translations.${index}.locale`">
                  <UiSelect v-bind="localeField" @update:model-value="localeField.onChange">
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
                  <ErrorMessage :name="`translations.${index}.locale`" class="text-sm text-destructive" />
                </Field>
              </div>

              <Field v-slot="{ field, errors }" :name="`translations.${index}.title`">
                <div class="space-y-2">
                  <UiLabel :for="`translations.${index}.title`">
                    Title
                    <span class="text-destructive">*</span>
                  </UiLabel>
                  <UiInput
                    v-bind="field"
                    :id="`translations.${index}.title`"
                    placeholder="Project title"
                    :class="{ 'border-destructive': errors.length > 0 }"
                  />
                  <ErrorMessage :name="`translations.${index}.title`" class="text-sm text-destructive" />
                </div>
              </Field>

              <div class="space-y-2">
                <UiLabel :for="`translations.${index}.content`">
                  Content
                  <span class="text-destructive">*</span>
                </UiLabel>
                <Field v-slot="{ field }" :name="`translations.${index}.content`">
                  <div>
                    <RichTextEditor
                      :model-value="field.value"
                      @update:model-value="field.onChange"
                      placeholder="Write your project description..."
                    />
                    <ErrorMessage :name="`translations.${index}.content`" class="text-sm text-destructive" />
                  </div>
                </Field>
              </div>
            </div>
          </UiCard>

          <UiButton
            type="button"
            variant="outline"
            class="w-full"
            @click="push({ locale: 'en-US', title: '', content: '' })"
          >
            <Plus class="w-4 h-4 mr-2" />
            Add Translation
          </UiButton>
        </div>

        <ErrorMessage name="translations" class="text-sm text-destructive" />
      </FieldArray>
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
        {{ props.isLoading ? 'Saving...' : (props.project ? 'Update' : 'Create') }}
      </UiButton>
    </div>
  </form>
</template>
