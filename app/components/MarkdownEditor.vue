<template>
  <div class="markdownEdit">
    <div class="markdownEdit__textEditContainer">
      <textarea
        class="textEdit"
        :value="plainText"
        placeholder="markdown記法で入力"
        @input="inputText"
      />
    </div>
    <div class="markdownEdit__container">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <MarkdownPreview class="markdownEdit__content" v-html="markdownText" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { convertTextToMarkdown } from '@/utils/markdown'

type Data = {
  markdownText: string
}

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget
}

export default Vue.extend({
  props: {
    plainText: {
      type: String as PropType<string>,
      required: true,
    },
  },
  data(): Data {
    return {
      markdownText: '',
    }
  },
  watch: {
    // NOTE: inputText内でplainTextの変更が完了しないためwatchで対応
    plainText() {
      this.setMarkdown()
    },
  },
  created() {
    this.setMarkdown()
  },
  methods: {
    async setMarkdown() {
      this.markdownText = await convertTextToMarkdown(this.plainText)
    },
    inputText(e: HTMLInputEvent) {
      this.$emit('input', e.target.value)
    },
  },
})
</script>

<style lang="scss" scoped>
.markdownEdit {
  display: flex;
  text-align: center;
  width: 100%;
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
    height: 50vh;
    overflow: scroll;
  }
}
.textEdit {
  padding: 0 0.5rem;
}

textarea {
  width: 100%;
  height: 50vh;
  border: 0;
  padding: 0;
  outline: 0;
  resize: none;
  font-size: 16px;
  line-height: inherit;
  background-color: #fbfcff;
}
</style>
