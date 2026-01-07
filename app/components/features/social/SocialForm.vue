<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { socialSchema, type SocialFormData } from '~/schemas/social.schema'
import type { Social } from '~/types/api'

interface Props {
  social?: Social
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false
})

const emit = defineEmits<{
  (e: 'submit', data: SocialFormData): void
  (e: 'cancel'): void
}>()

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: toTypedSchema(socialSchema),
  initialValues: props.social ? {
    social_name: props.social.social_name,
    social_url: props.social.social_url,
    icon: props.social.icon || ''
  } : {
    social_name: '',
    social_url: '',
    icon: ''
  }
})

watch(() => props.social, (newSocial) => {
  if (newSocial) {
    setValues({
      social_name: newSocial.social_name,
      social_url: newSocial.social_url,
      icon: newSocial.icon || ''
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
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-6">
    <FormField
      name="social_name"
      label="Name"
      placeholder="e.g. GitHub, LinkedIn, Twitter"
      required
    />

    <FormField
      name="social_url"
      label="URL"
      type="url"
      placeholder="https://github.com/username"
      description="Full URL to your social media profile"
      required
    />

    <FormField
      name="icon"
      label="Icon"
      placeholder="e.g. mdi:github, mdi:linkedin"
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
        {{ props.isLoading ? 'Saving...' : (props.social ? 'Update' : 'Create') }}
      </UiButton>
    </div>
  </form>
</template>
