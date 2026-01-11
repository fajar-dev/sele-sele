<script setup lang="ts">
import type { EditorCustomHandlers, DropdownMenuItem } from '@nuxt/ui'
import type { Editor } from '@tiptap/core'
import { Emoji } from '@tiptap/extension-emoji'
import { TaskList, TaskItem } from '@tiptap/extension-list'
import { TableKit } from '@tiptap/extension-table'
import { CellSelection } from 'prosemirror-tables'
import { CodeBlockShiki } from 'tiptap-extension-code-block-shiki'
import { Markdown } from 'tiptap-markdown'
import { ImageUpload } from '~/components/editor/ImageUploadExtension'
import { useFullscreen } from '@vueuse/core'

const route = useRoute()
const runtimeConfig = useRuntimeConfig()

const room = computed(() => {
  const r = route.params.id as string
  console.log('Connecting to room:', r)
  return r
})

const user = useState('user', () => ({
  name: getRandomName(),
  color: getRandomColor()
}))

const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()

const appConfig = useAppConfig()

const editorRef = useTemplateRef('editorRef')

const { extension: Completion, handlers: aiHandlers, isLoading: aiLoading } = useEditorCompletion(editorRef)

const {
  enabled: collaborationEnabled,
  ready: collaborationReady,
  extensions: collaborationExtensions,
  connectedUsers
} = useEditorCollaboration({
  room: room.value,
  host: runtimeConfig.public.partykitHost,
  user: {
    name: user.value.name,
    color: COLORS[user.value.color]!,
    avatar: getRandomAvatar()
  }
})

const exportItems = ref<DropdownMenuItem[]>([
  {
    label: 'Export As PDF',
    icon: 'i-lucide-file'
  },
  {
    label: 'Export As Markdown',
    icon: 'i-lucide-file'
  },
])

const breadcrumbItems = ref([
  {
    label: 'Home',
    icon: 'i-lucide-home',
    to: '/'
  },
  {
    label: '😄 Tailwind CSS',
    to: '/id'
  },
])

const pagesItems = ref([
  {
    label: 'Edit',
    icon: 'i-lucide-pencil'
  },
  {
    label: 'Delete',
    icon: 'i-lucide-trash'
  },
])

// Custom handlers for editor (merged with AI handlers)
const customHandlers = {
  imageUpload: {
    canExecute: (editor: Editor) => editor.can().insertContent({ type: 'imageUpload' }),
    execute: (editor: Editor) => editor.chain().focus().insertContent({ type: 'imageUpload' }),
    isActive: (editor: Editor) => editor.isActive('imageUpload'),
    isDisabled: undefined
  },
  table: {
    canExecute: (editor: Editor) => editor.can().insertTable({ rows: 3, cols: 3, withHeaderRow: true }),
    execute: (editor: Editor) => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }),
    isActive: (editor: Editor) => editor.isActive('table'),
    isDisabled: undefined
  },
  ...aiHandlers
} satisfies EditorCustomHandlers

const { items: emojiItems } = useEditorEmojis()
const { items: mentionItems } = useEditorMentions(connectedUsers)
const { items: suggestionItems } = useEditorSuggestions(customHandlers)
const { getItems: getDragHandleItems, onNodeChange } = useEditorDragHandle(customHandlers)
const { toolbarItems, bubbleToolbarItems, getImageToolbarItems, getTableToolbarItems } = useEditorToolbar(customHandlers, { aiLoading })

// Default content - only used when Y.js document is empty
const content = ref()

// Set initial content for collaborative documents (only if empty)
function onCreate({ editor }: { editor: Editor }) {
  if (!collaborationEnabled) return

  const storageKey = `editor-initialized-${room.value}`

  // Skip if already initialized this session (handles HMR)
  if (sessionStorage.getItem(storageKey)) return

  // Wait for Y.js to sync existing content from server before checking if empty
  setTimeout(() => {
    const text = editor.state.doc.textContent.trim()
    if (!text) {
      editor.commands.setContent(content.value, { contentType: 'markdown' })
    }
    sessionStorage.setItem(storageKey, 'true')
  }, 500)
}

function onUpdate(value: string) {
  if (!collaborationEnabled) {
    content.value = value
  }
}

const extensions = computed(() => [
  CodeBlockShiki.configure({
    defaultTheme: 'material-theme',
    themes: {
      light: 'material-theme-lighter',
      dark: 'material-theme-palenight'
    }
  }),
  Completion,
  Emoji,
  ImageUpload,
  Markdown,
  TableKit,
  TaskList,
  TaskItem,
  ...collaborationExtensions.value
])
</script>

<template>
  <UEditor
    v-if="collaborationReady"
    ref="editorRef"
    v-slot="{ editor, handlers }"
    :model-value="collaborationEnabled ? undefined : content"
    content-type="markdown"
    :extensions="extensions"
    :starter-kit="collaborationEnabled ? { undoRedo: false } : undefined"
    :handlers="customHandlers"
    autofocus
    placeholder="Write, type '/' for commands..."
    class="min-h-screen"
    :ui="{
      base: 'p-4 sm:p-14',
      content: 'max-w-4xl mx-auto'
    }"
    @update:model-value="onUpdate"
    @create="onCreate"
  >
    <AppHeader :toolbar="true">
      <template #right>
          <EditorCollaborationUsers :users="connectedUsers" />
      </template>

      <template #toolbar-left>
        <UBreadcrumb class="ms-5" size="sm" :items="breadcrumbItems" />
      </template>
      
      <template #toolbar-right>
        <UEditorToolbar
          :editor="editor"
          :items="toolbarItems"
        />

        <USeparator
          orientation="vertical"
          class="h-7"
        />

        <UButton size="sm" variant="ghost" color="neutral" icon="i-lucide-cloud-upload">
            Saving
        </UButton>
  
        <USeparator
          orientation="vertical"
          class="h-7"
        />
        <UDropdownMenu
          :items="exportItems"
          size="sm"
          :content="{
            align: 'start',
            side: 'bottom',
            sideOffset: 8
          }"
          :ui="{
            content: 'w-48'
          }"
        >
        <UButton size="sm" variant="ghost" color="neutral" icon="i-lucide-download">
            Export
        </UButton>
      </UDropdownMenu>

        <USeparator
          orientation="vertical"
          class="h-7"
        />

        <UButton
          size="sm"
          variant="ghost"
          color="neutral"
          :icon="isFullscreen ? 'i-lucide-minimize' : 'i-lucide-fullscreen'"
          @click="toggleFullscreen"
        />

        <USeparator
          orientation="vertical"
          class="h-7"
        />

        <UDropdownMenu
          :items="pagesItems"
          size="sm"
          :content="{
            align: 'start',
            side: 'bottom',
            sideOffset: 8
          }"
          :ui="{
            content: 'w-48'
          }"
        >
        <UButton size="sm" variant="ghost" color="neutral" icon="i-lucide-ellipsis-vertical" />
      </UDropdownMenu>
      </template>
    </AppHeader>

    <UEditorToolbar
      :editor="editor"
      :items="bubbleToolbarItems"
      layout="bubble"
      :should-show="({ editor, view, state }: any) => {
        if (editor.isActive('imageUpload') || editor.isActive('image') || state.selection instanceof CellSelection) {
          return false
        }
        const { selection } = state
        return view.hasFocus() && !selection.empty
      }"
    >
      <template #link>
        <EditorLinkPopover :editor="editor" />
      </template>
    </UEditorToolbar>

    <UEditorToolbar
      :editor="editor"
      :items="getImageToolbarItems(editor)"
      layout="bubble"
      :should-show="({ editor, view }: any) => {
        return editor.isActive('image') && view.hasFocus()
      }"
    />

    <UEditorToolbar
      :editor="editor"
      :items="getTableToolbarItems(editor)"
      layout="bubble"
      :should-show="({ editor, view }: any) => {
        return editor.state.selection instanceof CellSelection && view.hasFocus()
      }"
    />

    <UEditorDragHandle
      v-slot="{ ui, onClick }"
      :editor="editor"
      @node-change="onNodeChange"
    >
      <UButton
        icon="i-lucide-plus"
        color="neutral"
        variant="ghost"
        size="sm"
        :class="ui.handle()"
        @click="(e: MouseEvent) => {
          e.stopPropagation()
          const node = onClick()

          handlers.suggestion?.execute(editor, { pos: node?.pos }).run()
        }"
      />

      <UDropdownMenu
        v-slot="{ open }"
        :modal="false"
        :items="getDragHandleItems(editor)"
        :content="{ side: 'left' }"
        :ui="{ content: 'w-48', label: 'text-xs' }"
        @update:open="editor.chain().setMeta('lockDragHandle', $event).run()"
      >
        <UButton
          color="neutral"
          variant="ghost"
          active-variant="soft"
          size="sm"
          icon="i-lucide-grip-vertical"
          :active="open"
          :class="ui.handle()"
        />
      </UDropdownMenu>
    </UEditorDragHandle>

    <UEditorEmojiMenu
      :editor="editor"
      :items="emojiItems"
    />
    <UEditorMentionMenu
      :editor="editor"
      :items="mentionItems"
    />
    <UEditorSuggestionMenu
      :editor="editor"
      :items="suggestionItems"
    />
  </UEditor>
</template>
