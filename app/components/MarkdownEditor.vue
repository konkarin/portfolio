<template>
  <div class="markdownEditor">
    <div class="textEditor">
      <textarea :value="plainText" @input="inputText" />
    </div>
    <div class="markdownContainer">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <MarkdownPreview class="markdwonContent" v-html="markdownText" />
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
.markdownEditor {
  display: flex;
  text-align: center;
  width: 100%;
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

.markdownContainer {
  padding: 10px;
  text-align: left;
  width: 50%;
  border-left: 1px solid #cbcbcb;
}

.markdwonContent {
  padding-left: 1em;
  height: 50vh;
  overflow: scroll;
}
</style>
