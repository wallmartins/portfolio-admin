<script setup lang="ts">
import { ref, watch } from 'vue'
import { Upload, X } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

interface Props {
  modelValue?: File | string | null
  label?: string
  description?: string
  accept?: string
  maxSizeMB?: number
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'image/*',
  maxSizeMB: 5
})

const emit = defineEmits<{
  'update:modelValue': [value: File | null]
}>()

const previewUrl = ref<string | null>(null)
const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

// Initialize preview if modelValue is a string (URL)
watch(() => props.modelValue, (value) => {
  if (typeof value === 'string') {
    previewUrl.value = value
  } else if (value instanceof File) {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewUrl.value = e.target?.result as string
    }
    reader.readAsDataURL(value)
  } else {
    previewUrl.value = null
  }
}, { immediate: true })

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    processFile(file)
  }
}

function handleDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file) {
    processFile(file)
  }
}

function processFile(file: File) {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    toast.error('Please select an image file')
    return
  }

  // Validate file size
  const sizeMB = file.size / (1024 * 1024)
  if (sizeMB > props.maxSizeMB) {
    toast.error(`Image size must be less than ${props.maxSizeMB}MB`)
    return
  }

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target?.result as string
  }
  reader.readAsDataURL(file)

  // Emit the file
  emit('update:modelValue', file)
}

function removeImage() {
  previewUrl.value = null
  emit('update:modelValue', null)
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function openFileDialog() {
  fileInput.value?.click()
}
</script>

<template>
  <div class="space-y-2">
    <UiLabel v-if="props.label">
      {{ props.label }}
    </UiLabel>

    <div
      v-if="!previewUrl"
      class="relative border-2 border-dashed rounded-lg p-8 transition-colors"
      :class="{
        'border-primary bg-primary/5': isDragging,
        'border-border hover:border-primary/50': !isDragging
      }"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        :accept="props.accept"
        @change="handleFileChange"
      >

      <div class="flex flex-col items-center justify-center gap-2 text-center cursor-pointer" @click="openFileDialog">
        <Upload class="w-10 h-10 text-muted-foreground" />
        <div>
          <p class="text-sm font-medium">
            Drop image here or click to browse
          </p>
          <p class="text-xs text-muted-foreground mt-1">
            {{ props.description || `Maximum size: ${props.maxSizeMB}MB` }}
          </p>
        </div>
      </div>
    </div>

    <div v-else class="relative w-full max-w-md">
      <img
        :src="previewUrl"
        alt="Preview"
        class="w-full h-auto rounded-lg border"
      >
      <UiButton
        type="button"
        variant="destructive"
        size="icon"
        class="absolute top-2 right-2"
        @click="removeImage"
      >
        <X class="w-4 h-4" />
      </UiButton>
    </div>
  </div>
</template>
