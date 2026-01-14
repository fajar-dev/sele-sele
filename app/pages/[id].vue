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
import { useFullscreen, useDebounceFn } from '@vueuse/core'
import { pageService } from '~/services/pageService'
import type { Member, PageItem } from '~/types/page'

const route = useRoute()
const runtimeConfig = useRuntimeConfig()

const room = computed(() => {
  const r = route.params.id as string
  console.log('Connecting to room:', r)
  return r
})

const auth = useAuth()

const collaborationUser = computed(() => {
    const userData = auth.state.user
    
    return {
        name: userData?.name || 'Anonymous',
        color: getRandomColor(), 
        avatar: userData?.avatar || getRandomAvatar()
    }
})

const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()

const editorRef = useTemplateRef('editorRef')

const { extension: Completion, handlers: aiHandlers, isLoading: aiLoading } = useEditorCompletion(editorRef)

const {
  enabled: collaborationEnabled,
  ready: collaborationReady,
  extensions: collaborationExtensions,
  connectedUsers,
  updateUser
} = useEditorCollaboration({
  room: room.value,
  host: runtimeConfig.public.partykitHost,
  user: {
    name: collaborationUser.value.name,
    color: COLORS[collaborationUser.value.color]!,
    avatar: collaborationUser.value.avatar
  }
})

watch(collaborationUser, (newUser) => {
    if (collaborationReady.value) {
        updateUser({
            name: newUser.name,
            color: COLORS[newUser.color]!,
            avatar: newUser.avatar
        })
    }
}, { deep: true })

const handleExport = async (type: 'pdf' | 'md') => {
    try {
        const id = room.value
        let blob: Blob
        let filename = `${page.value?.title || 'document'}`

        if (type === 'pdf') {
            blob = await pageService.downloadPdf(id)
            filename += '.pdf'
        } else {
            blob = await pageService.downloadMd(id)
            filename += '.md'
        }

        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        toast.add({ title: 'Export successful' })
    } catch (e: any) {
        toast.add({ title: 'Export failed', description: e.message, color: 'error' })
    }
}

const exportItems = ref<DropdownMenuItem[]>([
  {
    label: 'Export As PDF',
    icon: 'i-lucide-file',
    onSelect: () => handleExport('pdf')
  },
  {
    label: 'Export As Markdown',
    icon: 'i-lucide-file',
    onSelect: () => handleExport('md')
  },
])

const breadcrumbItems = ref([
  {
    label: 'Home',
    icon: 'i-lucide-home',
    to: '/'
  },
  {
    label: '...',
    to: '/id'
  },
])

const editOpen = ref(false)

const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this page?')) return
    
    try {
        await pageService.delete(room.value)
        toast.add({ title: 'Page deleted successfully' })
        navigateTo('/')
    } catch (e: any) {
        toast.add({ title: 'Error deleting page', description: e.message, color: 'error' })
    }
}

const pagesItems = ref([
  {
    label: 'Edit',
    icon: 'i-lucide-pencil',
    onSelect: () => editOpen.value = true
  },
  {
    label: 'Delete',
    icon: 'i-lucide-trash',
    onSelect: () => handleDelete()
  },
])

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

const members = ref<Member[]>([])

const mentionableUsers = computed(() => {
  return members.value
    .filter(member => member.isPending === false)
    .map(member => ({
      name: member.name,
      color: getRandomColor(),
      avatar: member.avatar
    }))
})


const { items: emojiItems } = useEditorEmojis()
const { items: mentionItems } = useEditorMentions(mentionableUsers)
const { items: suggestionItems } = useEditorSuggestions(customHandlers)
const { getItems: getDragHandleItems, onNodeChange } = useEditorDragHandle(customHandlers)
const { toolbarItems, bubbleToolbarItems, getImageToolbarItems, getTableToolbarItems } = useEditorToolbar(customHandlers, { aiLoading })

const page = ref<PageItem | null>(null)
const isLoading = ref(true)

const content = ref()

onMounted(async () => {
    try {
        const res = await pageService.show(room.value)
        page.value = res.data

        const contentRes = await pageService.getContent(room.value)
        content.value = contentRes.data.content
        
        try {
            const membersRes = await pageService.getMembers(room.value)
            members.value = membersRes.data
        } catch (e) {
            console.error('Failed to load members for mentions', e)
        }

        breadcrumbItems.value = [
            { label: 'Home', icon: 'i-lucide-home', to: '/' },
            { label: res.data.icon + ' ' + res.data.title, to: `/${res.data.id}` }
        ]
    } catch (e: any) {
        toast.add({ title: 'Error loading page', description: e.message, color: 'error' })
        navigateTo('/')
    } finally {
        isLoading.value = false
    }
})

function onCreate({ editor }: { editor: Editor }) {
  if (!collaborationEnabled) return

  const storageKey = `editor-initialized-${room.value}`

  if (sessionStorage.getItem(storageKey)) return

  setTimeout(() => {
    const text = editor.state.doc.textContent.trim()
    if (!text) {
      editor.commands.setContent(content.value, { contentType: 'markdown' })
    }
    sessionStorage.setItem(storageKey, 'true')
  }, 500)
}

const toast = useToast()
const isSaving = ref(false)
const lastSaved = ref<Date | null>(null)

const saveContent = async (newContent: string) => {
    isSaving.value = true
    try {
        await pageService.updateContent(room.value, newContent)
        lastSaved.value = new Date()
    } catch (e: any) {
        console.error('Failed to save content', e)
        toast.add({ title: 'Error saving content', description: e.message, color: 'error' })
    } finally {
        setTimeout(() => {
            isSaving.value = false
        }, 1000)
    }
}

const debouncedSave = useDebounceFn((newContent: string) => {
    saveContent(newContent)
}, 2000)

function onUpdate(value: string) {
  content.value = value
  debouncedSave(value)
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
const manualSave = () => {
    if (content.value) {
        saveContent(content.value)
    }
}
</script>

<template>
  <div v-if="isLoading || !collaborationReady" class="min-h-screen flex flex-col">
      <AppHeader :toolbar="true">
        <template #toolbar-left>
            <USkeleton class="h-5 w-32 ms-5" />
        </template>
        
        <template #right>
            <div class="flex items-center gap-1">
              <USkeleton class="h-6 w-6 rounded-full" />
              <USkeleton class="h-6 w-6 rounded-full" />
              <USkeleton class="h-6 w-6 rounded-full" />
            </div>
        </template>

        <template #toolbar-right>
            <div class="flex items-center gap-2">
                <div class="flex gap-1">
                    <USkeleton class="h-8 w-8" />
                    <USkeleton class="h-8 w-8" />
                    <USkeleton class="h-8 w-8" />
                </div>

                <USeparator orientation="vertical" class="h-7" />

                <USkeleton class="h-8 w-16" />
          
                <USeparator orientation="vertical" class="h-7" />
                <USkeleton class="h-8 w-20" />

                <USeparator orientation="vertical" class="h-7" />

                <USkeleton class="h-8 w-8" />

                <USeparator orientation="vertical" class="h-7" />

                <USkeleton class="h-8 w-8" />
            </div>
        </template>
      </AppHeader>

      <!-- Editor Content Skeleton -->
      <div class="flex-1 p-4 sm:p-14 max-w-4xl mx-auto w-full space-y-6">
          <USkeleton class="h-[3.5rem] w-3/4 mb-4" /> <!-- Title -->
          
          <div class="space-y-3">
              <USkeleton class="h-4 w-full" />
              <USkeleton class="h-4 w-full" />
              <USkeleton class="h-4 w-2/3" />
          </div>

          <div class="space-y-3 pt-2">
              <USkeleton class="h-4 w-full" />
              <USkeleton class="h-4 w-11/12" />
              <USkeleton class="h-4 w-full" />
              <USkeleton class="h-4 w-4/5" />
          </div>

          <div class="space-y-3 pt-2">
              <USkeleton class="h-4 w-full" />
              <USkeleton class="h-4 w-3/4" />
          </div>
      </div>
  </div>

  <UEditor
    v-else
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
          <EditorCollaborationUsers :users="connectedUsers" :page-id="room" />
          <EditPageModal 
            v-if="page"
            v-model:open="editOpen" 
            :page="page" 
            @success="() => {
                pageService.show(room).then(res => {
                      page = res.data
                      breadcrumbItems = [
                          { label: 'Home', icon: 'i-lucide-home', to: '/' },
                          { label: res.data.icon + ' ' + res.data.title, to: `/${res.data.id}` }
                      ]
                })
            }" 
          />
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

        <UButton 
            size="sm" 
            variant="ghost" 
            color="neutral" 
            :icon="isSaving ? 'i-lucide-loader-2' : 'i-lucide-save'"
            :loading="isSaving"
            :disabled="isSaving"
            @click="manualSave"
        >
            {{ isSaving ? 'Saving...' : 'Save' }}
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
