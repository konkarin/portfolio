<template>
  <div class="markdownEdit">
    <div class="markdownEdit__textEditContainer">
      <textarea
        class="textEdit"
        :value="localValue"
        placeholder="markdown記法で入力"
        @input="inputText"
        @keydown.tab.prevent="handlePressTab"
        @keydown.esc.prevent="handlePressEsc"
        @paste="onPaste"
        @drop.prevent="onDrop"
      />
    </div>
    <div class="markdownEdit__container">
      <MarkdownPreview class="markdownEdit__content" :html-text="htmlText" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { convertMarkdownTextToHTML } from '@/utils/markdown'
import { v4 } from 'uuid'
import { useAuthInject } from '@/composables/useAuth'

type Props = { plainText: string }
const props = defineProps<Props>()
const emit = defineEmits(['input', 'save'])

const { user } = useAuthInject()

const htmlText = ref('')
const localValue = ref('')
const setMarkdown = async () => {
  htmlText.value = await convertMarkdownTextToHTML(props.plainText)
}
const inputText = (e: Event) => {
  if (e.target instanceof HTMLTextAreaElement) {
    localValue.value = e.target.value
    emit('input', localValue.value)
  }
}

const { uploadImage } = useImageUpload()

const onPaste = async (e: ClipboardEvent) => {
  const blob = await loadClipboardImage()
  // 画像がクリップボードにない場合はデフォルトの処理を行う
  if (!blob) return

  e.preventDefault()

  const textarea = e.target
  if (!(textarea instanceof HTMLTextAreaElement)) return

  // アップロード前にキャレットの位置を取得しておく
  const start = textarea.selectionStart
  const end = textarea.selectionEnd

  const file = new File([await resizeImage(blob, { maxSize: 1200 })], 'image.webp')

  const url = await uploadImage(file, `users/${user.value?.uid}/articles/${v4()}`)
  if (url) {
    const markdownUrl = `![](${url})`
    insertTextAtCaret(markdownUrl, start, end, textarea)
  }
}

const onDrop = async (e: DragEvent) => {
  const textarea = e.target
  if (!(textarea instanceof HTMLTextAreaElement)) return

  const file = e.dataTransfer?.files[0]
  if (!file) return

  // アップロード前にキャレットの位置を取得しておく
  const start = textarea.selectionStart
  const end = textarea.selectionEnd

  const resizedFile = new File([await resizeImage(file, { maxSize: 1200 })], 'image.webp')

  const url = await uploadImage(resizedFile, `users/${user.value?.uid}/articles/${v4()}`)
  if (url) {
    const markdownUrl = `![](${url})`
    if (textarea instanceof HTMLTextAreaElement) {
      insertTextAtCaret(markdownUrl, start, end, textarea)
    } else {
      localValue.value = markdownUrl + localValue.value
    }

    emit('input', localValue.value)
  }
}

const insertTextAtCaret = (
  text: string,
  start: number,
  end: number,
  target: HTMLTextAreaElement,
) => {
  const before = localValue.value.substring(0, start)
  const after = localValue.value.substring(end)
  localValue.value = `${before}${text}${after}`
  emit('input', localValue.value)

  // キャレット位置を更新.value
  const newCaretPosition = start + text.length
  target.setSelectionRange(newCaretPosition, newCaretPosition)
}

const handlePressTab = (e: KeyboardEvent) => {
  const index = (e.target as HTMLTextAreaElement).selectionEnd
  if (index === null) return

  if (e.shiftKey) {
    const firstHalf = localValue.value.slice(0, index)
    const arraySplittedByEnter = firstHalf.split('\n')
    const target = arraySplittedByEnter.pop()
    if (target === undefined || target.search('  ') === -1) return

    arraySplittedByEnter.push(target.replace('  ', ''))

    localValue.value = arraySplittedByEnter.join('\n') + localValue.value.slice(index)

    setTimeout(() => {
      ;(e.target as HTMLTextAreaElement).setSelectionRange(index - 2, index - 2)
    }, 0)
  } else {
    localValue.value = localValue.value.slice(0, index) + '  ' + localValue.value.slice(index)
    emit('input', localValue.value)

    setTimeout(() => {
      ;(e.target as HTMLTextAreaElement).setSelectionRange(index + 2, index + 2)
    }, 0)
  }
}
const handlePressEsc = (e: KeyboardEvent) => {
  ;(e.target as HTMLTextAreaElement).blur()
}
const handleKeydownCmdS = (e: KeyboardEvent) => {
  if (((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) && e.key === 's') {
    e.preventDefault()
    emit('save')
  }
}
watch(
  localValue,
  () => {
    setMarkdown()
  },
  { immediate: true },
)
watch(
  () => props.plainText,
  () => {
    localValue.value = props.plainText
  },
  { immediate: true },
)

onMounted(() => {
  document.addEventListener('keydown', handleKeydownCmdS)
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydownCmdS)
})
</script>

<style lang="scss" scoped>
.markdownEdit {
  display: flex;
  text-align: center;
  width: 100%;
  min-height: 300px;
  background-color: #fbfcff;
  border: 1px solid #cbcbcb;
  border-radius: 8px;
  margin-top: 1rem;

  &__textEditContainer {
    padding: 10px;
    width: 50%;
  }
  &__container {
    padding: 10px;
    text-align: left;
    width: 50%;
    border-left: 1px solid #cbcbcb;
  }
  &__content {
    padding: 0 0.5rem;
  }
}
.textEdit {
  padding: 0 0.5rem;
}

textarea {
  width: 100%;
  height: 100%;
  border: 0;
  padding: 0;
  outline: 0;
  resize: none;
  font-size: 16px;
  line-height: 1.9;
  background-color: #fbfcff;
}
</style>
