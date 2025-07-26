import { Extension } from '@tiptap/core'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import StarterKit from '@tiptap/starter-kit'
import { useEditor } from '@tiptap/vue-3'
import { renderToMarkdown } from '@tiptap/static-renderer/pm/markdown'

/* よくあるキーボード操作を実現する拡張機能
 * StarterKit に含まれるノードを対象として実装する
 */
const SmartKeyboardShortcuts = Extension.create({
  name: 'smartKeyboardShortcuts',
  priority: 101, // StarterKit より先に実行するようにする

  addKeyboardShortcuts() {
    return {
      Enter: () => {
        const { editor } = this
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

const extensions = [
  StarterKit.extend({
    addKeyboardShortcuts() {
      return {
        Tab: () => {
          if (this.editor.isActive('codeBlock')) {
            return this.editor.commands.insertContent('\t')
          }
        },
      }
    },
  }),
  Highlight,
  Typography,
  SmartKeyboardShortcuts,
]

export function useMarkdownEditor(callback: (editorText: string) => void) {
  const editor = useEditor({
    extensions,
    content: '',
    onUpdate({ editor }) {
      callback(editor.getHTML())
    },
    editorProps: {
      handleKeyDown: (view, event) => {
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

  function markdownText() {
    return renderToMarkdown({
      content: editor.value?.getJSON() || {},
      extensions,
    })
  }

  return { editor, markdownText }
}
