<script setup lang="ts">
import { useForm, FieldArray } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { experienceSchema, type ExperienceFormData } from '~/schemas/experience.schema'
import type { Experience } from '~/types/api'
import { Plus, Trash2, X, Save } from 'lucide-vue-next'

interface Props {
  experience?: Experience
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false
})

const emit = defineEmits<{
  (e: 'submit', data: ExperienceFormData): void
  (e: 'cancel'): void
}>()

const { handleSubmit, resetForm, setValues, values } = useForm({
  validationSchema: toTypedSchema(experienceSchema),
  initialValues: props.experience ? {
    company: props.experience.company,
    role: props.experience.role,
    start_date: props.experience.start_date,
    end_date: props.experience.end_date || undefined,
    is_current: !props.experience.end_date,
    translations: props.experience.translations || []
  } : {
    company: '',
    role: '',
    start_date: '',
    end_date: undefined,
    is_current: false,
    translations: [
      { locale: 'pt-BR' as const, description: '' }
    ]
  }
})

watch(() => props.experience, (newExp) => {
  if (newExp) {
    setValues({
      company: newExp.company,
      role: newExp.role,
      start_date: newExp.start_date,
      end_date: newExp.end_date || undefined,
      is_current: !newExp.end_date,
      translations: newExp.translations || []
    })
  }
}, { immediate: true })

const onSubmit = handleSubmit((formValues) => {
  const data: ExperienceFormData = {
    ...formValues,
    end_date: formValues.is_current ? null : formValues.end_date
  }
  emit('submit', data)
})

const onCancel = () => {
  resetForm()
  emit('cancel')
}

const localeOptions = [
  { label: 'Português (BR)', value: 'pt-BR' },
  { label: 'English (US)', value: 'en-US' }
]
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-6">
    <FormField
      name="company"
      label="Company"
      placeholder="e.g. Google, Microsoft, Startup Inc."
      required
    />

    <FormField
      name="role"
      label="Role/Position"
      placeholder="e.g. Senior Software Engineer"
      required
    />

    <div class="grid grid-cols-2 gap-4">
      <FormField
        name="start_date"
        label="Start Date"
        type="date"
        required
      />

      <div class="space-y-2">
        <FormField
          name="end_date"
          label="End Date"
          type="date"
          :disabled="values.is_current"
        />

        <Field v-slot="{ field }" name="is_current" type="checkbox">
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              :id="'is_current'"
              v-bind="field"
              :checked="field.value"
              class="h-4 w-4 rounded border-gray-300"
            />
            <label
              :for="'is_current'"
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Currently working here
            </label>
          </div>
        </Field>
      </div>
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

              <FormField
                :name="`translations.${index}.description`"
                label="Description"
                as="textarea"
                placeholder="Describe your role and responsibilities..."
                required
              />
            </div>
          </UiCard>

          <UiButton
            type="button"
            variant="outline"
            class="w-full"
            @click="push({ locale: 'en-US', description: '' })"
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
        {{ props.isLoading ? 'Saving...' : (props.experience ? 'Update' : 'Create') }}
      </UiButton>
    </div>
  </form>
</template>
