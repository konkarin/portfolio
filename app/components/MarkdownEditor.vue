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
      />
    </div>
    <div class="markdownEdit__container">
      <MarkdownPreview class="markdownEdit__content" :html-text="htmlText" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { convertMarkdownTextToHTML } from '@/utils/markdown'

type Props = { plainText: string }
const props = defineProps<Props>()
const emit = defineEmits(['input', 'save'])

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
  { immediate: true }
)
watch(
  () => props.plainText,
  () => {
    localValue.value = props.plainText
  },
  { immediate: true }
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
