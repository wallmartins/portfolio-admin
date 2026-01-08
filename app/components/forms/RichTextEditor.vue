<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
// import Image from '@tiptap/extension-image' // Temporarily disabled due to version conflict
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight, common } from 'lowlight'
import {
  Bold, Italic, Strikethrough, Code,
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote,
  Undo, Redo, Link as LinkIcon
  // ImageIcon // Removed - image functionality temporarily disabled
} from 'lucide-vue-next'
import { watch } from 'vue'

const lowlight = createLowlight(common)

interface Props {
  modelValue: string
  label?: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Start typing...'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      codeBlock: false
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-primary underline'
      }
    }),
    // Image.configure({ // Temporarily disabled
    //   HTMLAttributes: {
    //     class: 'max-w-full h-auto rounded-lg'
    //   }
    // }),
    CodeBlockLowlight.configure({
      lowlight,
      HTMLAttributes: {
        class: 'bg-muted p-4 rounded-lg'
      }
    })
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4'
    }
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  }
})

watch(() => props.modelValue, (value) => {
  const isSame = editor.value?.getHTML() === value
  if (!isSame && editor.value) {
    editor.value.commands.setContent(value, false)
  }
})

function addLink() {
  const url = window.prompt('Enter URL:')
  if (url && editor.value) {
    editor.value.chain().focus().setLink({ href: url }).run()
  }
}

// Temporarily disabled due to TipTap Image extension conflict
// function addImage() {
//   const url = window.prompt('Enter image URL:')
//   if (url && editor.value) {
//     editor.value.chain().focus().setImage({ src: url }).run()
//   }
// }

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<template>
  <div class="space-y-2">
    <UiLabel v-if="props.label">
      {{ props.label }}
    </UiLabel>

    <div v-if="editor" class="border rounded-lg overflow-hidden">
      <!-- Toolbar -->
      <div class="flex flex-wrap gap-1 p-2 border-b bg-muted/30">
        <UiButton
          type="button"
          variant="ghost"
          size="sm"
          @click="editor.chain().focus().toggleBold().run()"
          :class="{ 'bg-muted': editor.isActive('bold') }"
        >
          <Bold class="w-4 h-4" />
        </UiButton>

        <UiButton
          type="button"
          variant="ghost"
          size="sm"
          @click="editor.chain().focus().toggleItalic().run()"
          :class="{ 'bg-muted': editor.isActive('italic') }"
        >
          <Italic class="w-4 h-4" />
        </UiButton>

        <UiButton
          type="button"
          variant="ghost"
          size="sm"
          @click="editor.chain().focus().toggleStrike().run()"
          :class="{ 'bg-muted': editor.isActive('strike') }"
        >
          <Strikethrough class="w-4 h-4" />
        </UiButton>

        <UiButton
          type="button"
          variant="ghost"
          size="sm"
          @click="editor.chain().focus().toggleCode().run()"
          :class="{ 'bg-muted': editor.isActive('code') }"
        >
          <Code class="w-4 h-4" />
        </UiButton>

        <div class="w-px h-6 bg-border mx-1" />

        <UiButton
          type="button"
          variant="ghost"
          size="sm"
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{ 'bg-muted': editor.isActive('heading', { level: 1 }) }"
        >
          <Heading1 class="w-4 h-4" />
        </UiButton>

        <UiButton
          type="button"
          variant="ghost"
          size="sm"
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ 'bg-muted': editor.isActive('heading', { level: 2 }) }"
        >
          <Heading2 class="w-4 h-4" />
        </UiButton>

        <UiButton
          type="button"
          variant="ghost"
          size="sm"
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="{ 'bg-muted': editor.isActive('heading', { level: 3 }) }"
        >
          <Heading3 class="w-4 h-4" />
        </UiButton>

        <div class="w-px h-6 bg-border mx-1" />

        <UiButton
          type="button"
          variant="ghost"
          size="sm"
          @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'bg-muted': editor.isActive('bulletList') }"
        >
          <List class="w-4 h-4" />
        </UiButton>

        <UiButton
          type="button"
          variant="ghost"
          size="sm"
          @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'bg-muted': editor.isActive('orderedList') }"
        >
          <ListOrdered class="w-4 h-4" />
        </UiButton>

        <UiButton
          type="button"
          variant="ghost"
          size="sm"
          @click="editor.chain().focus().toggleBlockquote().run()"
          :class="{ 'bg-muted': editor.isActive('blockquote') }"
        >
          <Quote class="w-4 h-4" />
        </UiButton>

        <div class="w-px h-6 bg-border mx-1" />

        <UiButton
          type="button"
          variant="ghost"
          size="sm"
          @click="addLink"
          :class="{ 'bg-muted': editor.isActive('link') }"
        >
          <LinkIcon class="w-4 h-4" />
        </UiButton>

        <!-- Image button temporarily disabled -->
        <!-- <UiButton
          type="button"
          variant="ghost"
          size="sm"
          @click="addImage"
        >
          <ImageIcon class="w-4 h-4" />
        </UiButton> -->

        <div class="w-px h-6 bg-border mx-1" />

        <UiButton
          type="button"
          variant="ghost"
          size="sm"
          @click="editor.chain().focus().undo().run()"
          :disabled="!editor.can().undo()"
        >
          <Undo class="w-4 h-4" />
        </UiButton>

        <UiButton
          type="button"
          variant="ghost"
          size="sm"
          @click="editor.chain().focus().redo().run()"
          :disabled="!editor.can().redo()"
        >
          <Redo class="w-4 h-4" />
        </UiButton>
      </div>

      <!-- Editor -->
      <EditorContent :editor="editor" />
    </div>
  </div>
</template>

<style>
.ProseMirror {
  outline: none;
}

.ProseMirror p.is-editor-empty:first-child::before {
  color: var(--muted-foreground);
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
