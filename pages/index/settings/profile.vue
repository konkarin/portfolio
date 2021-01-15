<template>
  <div class="wrapper">
    <textarea v-model="inputText" @input="convertMarkdown" />
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="markdownText" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import remark from 'remark'
import recommended from 'remark-preset-lint-recommended'
import html from 'remark-html'

type Data = {
  inputText: string
  markdownText: string
}

export default Vue.extend({
  data(): Data {
    return {
      inputText: '',
      markdownText: '',
    }
  },
  methods: {
    convertMarkdown(): void {
      remark()
        .use(recommended)
        .use(html)
        .process(this.inputText, (err, file) => {
          if (err) console.error(err)
          else this.markdownText = String(file)
        })
    },
  },
})
</script>
