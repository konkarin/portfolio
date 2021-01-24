<template>
  <div class="MarkdownEditor">
    <div class="textEditor">
      <textarea :value="plainText" @input="inputText" />
    </div>
    <div class="markdownPreview">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="markdwonPreviewInner" v-html="markdownText" />
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

<style scoped>
.MarkdownEditor {
  display: flex;
  text-align: center;
  width: 80%;
  margin: 0 auto 1em;
  background-color: #fbfcff;
  border: 1px solid #cbcbcb;
}

.textEditor {
  padding: 10px;
  width: 50%;
}

textarea {
  width: 100%;
  height: 50vh;
  padding: 0;
  border: 0;
  outline: 0;
  resize: none;
  font-size: 16px;
  line-height: inherit;
  background-color: #fbfcff;
}

.markdownPreview {
  padding: 10px;
  text-align: left;
  width: 50%;
  border-left: 1px solid #cbcbcb;
}

.markdwonPreviewInner {
  padding-left: 1em;
  height: 50vh;
  overflow: scroll;
}

.markdwonPreviewInner >>> h1 {
  font-weight: bold;
  font-size: 3.2rem;
}

.markdwonPreviewInner >>> h2 {
  font-weight: bold;
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 2.8rem;
}

.markdwonPreviewInner >>> h3 {
  text-align: left;
  font-size: 2.2rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  margin-right: 2rem;
}

.markdwonPreviewInner >>> ul {
  padding-left: 1em;
  list-style-type: disc;
}

.markdwonPreviewInner >>> ol {
  padding-left: 1em;
  list-style-type: decimal;
}
</style>
