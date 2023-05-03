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
      <!-- eslint-disable-next-line vue/no-v-html -->
      <MarkdownPreview class="markdownEdit__content" v-html="htmlText" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { convertMarkdownTextToHTML } from '@/utils/markdown'

type Data = {
  htmlText: string
  localValue: string
}

export default defineComponent({
  props: {
    plainText: {
      type: String,
      required: true,
    },
  },
  data(): Data {
    return {
      htmlText: '',
      localValue: '',
    }
  },
  watch: {
    // NOTE: inputText内でplainTextの変更が完了しないためwatchで対応
    localValue: {
      handler() {
        this.setMarkdown()
      },
      immediate: true,
    },
    plainText: {
      handler() {
        this.localValue = this.plainText
      },
      immediate: true,
    },
  },
  mounted() {
    document.addEventListener('keydown', this.handleKeydownCmdS)
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeydownCmdS)
  },
  methods: {
    async setMarkdown() {
      this.htmlText = await convertMarkdownTextToHTML(this.plainText)
    },
    inputText(e: HTMLInputEvent<HTMLTextAreaElement>) {
      this.localValue = e.target.value
      this.$emit('input', this.localValue)
    },
    handlePressTab(e: HTMLKeyboardEvent<HTMLTextAreaElement>) {
      const index = e.target.selectionEnd
      if (index === null) return

      if (e.shiftKey) {
        const firstHalf = this.localValue.slice(0, index)
        const arraySplittedByEnter = firstHalf.split('\n')
        const target = arraySplittedByEnter.pop()
        if (target === undefined || target.search('  ') === -1) return

        arraySplittedByEnter.push(target.replace('  ', ''))

        this.localValue = arraySplittedByEnter.join('\n') + this.localValue.slice(index)

        setTimeout(() => {
          e.target.setSelectionRange(index - 2, index - 2)
        }, 0)
      } else {
        this.localValue = this.localValue.slice(0, index) + '  ' + this.localValue.slice(index)
        this.$emit('input', this.localValue)

        setTimeout(() => {
          e.target.setSelectionRange(index + 2, index + 2)
        }, 0)
      }
    },
    handlePressEsc(e: HTMLInputEvent<HTMLTextAreaElement>) {
      e.target.blur()
    },
    handleKeydownCmdS(e: KeyboardEvent) {
      if (((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) && e.key === 's') {
        e.preventDefault()
        this.$emit('save')
      }
    },
  },
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
