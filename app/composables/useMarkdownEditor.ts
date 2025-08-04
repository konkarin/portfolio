import { Extension } from '@tiptap/core'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import FileHandler from '@tiptap/extension-file-handler'

import { useEditor } from '@tiptap/vue-3'
import { renderToMarkdown } from '@tiptap/static-renderer/pm/markdown'
import { v4 } from 'uuid'

/**
 * よくあるキーボード操作を実現する拡張機能
 * StarterKit に含まれるノードを対象として実装する
 * @see https://sogo.dev/posts/2025/05/tiptap-enter-keyboard-shortcuts
 */
const SmartKeyboardShortcuts = Extension.create({
  name: 'smartKeyboardShortcuts',
  priority: 101, // StarterKit より先に実行するようにする
  addKeyboardShortcuts() {
    const { editor } = this
    return {
      Tab() {
        if (editor.isActive('codeBlock')) {
          return editor.commands.insertContent('\t')
        } else {
          return false
        }
      },
      //  Enter押したら書式リセットする
      Enter() {
        const { state } = editor
        const { $from } = state.selection

        const grandParentNodeTypeName = $from.node(-1)?.type.name
        const parentNodeTypeName = $from.parent.type.name
        const isParentContentEmpty = $from.parent.content.size === 0

        // CodeBlock ではデフォルトの挙動を優先
        if ([editor.schema.nodes.codeBlock?.name].includes(parentNodeTypeName)) {
          return false
        }

        // TaskItem を使う場合はこの配列に追加する
        if ([editor.schema.nodes.listItem?.name].includes(grandParentNodeTypeName)) {
          // 親ノードが空の場合はデフォルトの挙動を優先
          if (isParentContentEmpty) return false

          // TipTap 2.12.0 時点ではリストアイテム分割時に
          // `keepMarks: false` を指定することができない
          // `storedMarks` を空にして新カーソルに渡すようにする
          editor
            .chain()
            .splitListItem(grandParentNodeTypeName)
            .unsetAllMarks()
            .command(({ tr }) => {
              tr.setStoredMarks(null)
              return true
            })
            .run()
          return true
        }

        // Blockquote で、親ノードが空の場合はデフォルトの挙動を優先
        if (
          grandParentNodeTypeName === editor.schema.nodes.blockquote?.name &&
          isParentContentEmpty
        ) {
          return false
        }

        editor.chain().splitBlock({ keepMarks: false }).run()
        return true
      },
    }
  },
})

const baseExtensions = [Highlight, Typography, SmartKeyboardShortcuts, Image, StarterKit]

export function useMarkdownEditor(callback: (editorText: string) => void) {
  const { uploadImage } = useImageUpload()
  const { user } = useAuthInject()

  const extensions = [
    ...baseExtensions,
    // FileHandler内でユーザー情報を使いたいので、inject後に定義する
    FileHandler.configure({
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
      async onDrop(currentEditor, files, pos) {
        for await (const file of files) {
          const resizedFile = new File([await resizeImage(file, { maxSize: 1200 })], 'image.webp')
          const url = await uploadImage(resizedFile, `users/${user.value?.uid}/articles/${v4()}`)
          if (url) {
            currentEditor
              .chain()
              .insertContentAt(pos, {
                type: 'image',
                attrs: {
                  src: url,
                },
              })
              .focus()
              .run()
          }
        }
      },
      async onPaste(currentEditor, files) {
        for await (const file of files) {
          if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
            continue
          }

          const resizedImage = new File([await resizeImage(file, { maxSize: 1200 })], 'image.webp')

          const url = await uploadImage(resizedImage, `users/${user.value?.uid}/articles/${v4()}`)
          currentEditor
            .chain()
            .insertContentAt(currentEditor.state.selection.anchor, {
              type: 'image',
              attrs: {
                src: url,
              },
            })
            .focus()
            .run()
        }
      },
    }),
  ]

  const editor = useEditor({
    extensions,
    content: '',
    onUpdate({ editor }) {
      callback(editor.getHTML())
    },
    editorProps: {
      handleKeyDown(view, event) {
        // リストアイテム内にいる場合はTabでエディタからフォーカスを失わないようにする
        if (event.key === 'Tab' && !event.ctrlKey && !event.metaKey) {
          const { $from } = view.state.selection
          const node = $from.node(-1)
          if (node && node.type.name === 'listItem') {
            event.stopPropagation()
          }
        }
      },
    },
  })

  return { editor }
}
