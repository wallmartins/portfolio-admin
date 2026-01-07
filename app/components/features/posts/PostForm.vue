<script setup lang="ts">
import { useForm, FieldArray } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { postSchema, type PostFormData } from '~/schemas/post.schema'
import type { Post } from '~/types/api'
import { Plus, Trash2 } from 'lucide-vue-next'

interface Props {
  post?: Post
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false
})

const emit = defineEmits<{
  (e: 'submit', data: PostFormData): void
  (e: 'cancel'): void
}>()

const { techs } = useTechs()
const imageFile = ref<File | null>(null)

const { handleSubmit, resetForm, setValues, values } = useForm({
  validationSchema: toTypedSchema(postSchema),
  initialValues: props.post ? {
    slug: props.post.slug,
    image: props.post.image || undefined,
    tech_ids: props.post.techs?.map(t => t.id) || [],
    translations: [
      {
        locale: 'pt-BR' as const,
        title: '',
        subtitle: '',
        content: ''
      }
    ]
  } : {
    slug: '',
    image: undefined,
    tech_ids: [],
    translations: [
      {
        locale: 'pt-BR' as const,
        title: '',
        subtitle: '',
        content: ''
      }
    ]
  }
})

watch(() => props.post, (newPost) => {
  if (newPost) {
    setValues({
      slug: newPost.slug,
      image: newPost.image || undefined,
      tech_ids: newPost.techs?.map(t => t.id) || [],
      translations: [
        {
          locale: 'pt-BR' as const,
          title: newPost.title || '',
          subtitle: newPost.subtitle || '',
          content: newPost.content || ''
        }
      ]
    })
  }
}, { immediate: true })

const onSubmit = handleSubmit((formValues) => {
  const data: PostFormData = {
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

// Auto-generate slug from first translation title
const handleTitleInput = (event: Event, index: number) => {
  if (index === 0 && !props.post) {
    const target = event.target as HTMLInputElement
    const title = target.value
    const slug = title
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
  return techs.value.map(tech => ({
    label: tech.name,
    value: tech.id
  }))
})
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-6">
    <FormField
      name="slug"
      label="Slug"
      placeholder="e.g. my-awesome-post"
      description="Auto-generated from title, or customize it"
      required
    />

    <div class="space-y-2">
      <UiLabel>Featured Image</UiLabel>
      <ImageUpload
        :model-value="imageFile || values.image"
        @update:model-value="handleImageChange"
        label="Upload featured image"
        description="Recommended: 16:9 ratio, max 5MB"
      />
    </div>

    <div class="space-y-2">
      <UiLabel>Technologies</UiLabel>
      <MultiSelect
        v-model="values.tech_ids"
        :options="techOptions"
        placeholder="Select technologies used in this post"
      />
      <p class="text-sm text-muted-foreground">
        Select the technologies related to this post
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
                    placeholder="Post title"
                    :class="{ 'border-destructive': errors.length > 0 }"
                    @input="handleTitleInput($event, index)"
                  />
                  <ErrorMessage :name="`translations.${index}.title`" class="text-sm text-destructive" />
                </div>
              </Field>

              <FormField
                :name="`translations.${index}.subtitle`"
                label="Subtitle"
                placeholder="Optional subtitle"
              />

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
                      placeholder="Write your post content..."
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
            @click="push({ locale: 'en-US', title: '', subtitle: '', content: '' })"
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
      >
        Cancel
      </UiButton>
      <UiButton
        type="submit"
        :disabled="props.isLoading"
      >
        {{ props.isLoading ? 'Saving...' : (props.post ? 'Update' : 'Create') }}
      </UiButton>
    </div>
  </form>
</template>
