<script setup lang="ts">
import { Field, ErrorMessage } from 'vee-validate'
import type { Component } from 'vue'

interface Props {
  name: string
  label?: string
  as?: string | Component
  type?: string
  placeholder?: string
  description?: string
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  as: 'input',
  type: 'text'
})
</script>

<template>
  <Field v-slot="{ field, errors }" :name="props.name">
    <div class="space-y-2">
      <UiLabel v-if="props.label" :for="props.name">
        {{ props.label }}
        <span v-if="props.required" class="text-destructive">*</span>
      </UiLabel>

      <UiInput
        v-if="props.as === 'input'"
        :id="props.name"
        v-bind="field"
        :type="props.type"
        :placeholder="props.placeholder"
        :class="{ 'border-destructive': errors.length > 0 }"
      />

      <UiTextarea
        v-else-if="props.as === 'textarea'"
        :id="props.name"
        v-bind="field"
        :placeholder="props.placeholder"
        :class="{ 'border-destructive': errors.length > 0 }"
      />

      <component
        v-else
        :is="props.as"
        :id="props.name"
        v-bind="field"
        :type="props.type"
        :placeholder="props.placeholder"
        :class="{ 'border-destructive': errors.length > 0 }"
      />

      <p v-if="props.description && !errors.length" class="text-sm text-muted-foreground">
        {{ props.description }}
      </p>

      <ErrorMessage :name="props.name" class="text-sm text-destructive" />
    </div>
  </Field>
</template>
