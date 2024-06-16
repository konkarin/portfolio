<template>
  <div class="markdown" v-html="htmlText" />
</template>

<script lang="ts">
import 'highlight.js/styles/tomorrow-night.css'

export default defineComponent({
  props: {
    htmlText: {
      type: String,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.markdown > :first-child {
  margin-top: 0;
}

.markdown {
  line-height: 1.9;

  :deep(a) {
    color: var(--yellow);
    line-break: anywhere;
    word-break: break-all;
    &:hover {
      text-decoration: underline;
    }
  }

  :deep(h1) {
    margin-top: 2em;
    border-bottom: 1px solid #ddd;
  }

  :deep(h2) {
    margin-top: 2em;
    border-bottom: 1px solid #ddd;
  }

  :deep(h3) {
    margin-top: 1.5em;
  }

  :deep(h4) {
    margin-top: 1.5em;
  }

  :deep(h5) {
    margin-top: 1.5em;
  }

  :deep(h6) {
    font-size: 0.9rem;
  }

  :deep(h1 + h2) {
    margin-top: 1.5em;
  }

  :deep(h2 + h3) {
    margin-top: 1.5em;
  }

  :deep(h3 + h4) {
    margin-top: 1em;
  }

  :deep(h4 + h5) {
    margin-top: 1em;
  }

  :deep(h5 + h6) {
    margin-top: 1em;
  }

  :deep(p) {
    margin-top: 1.5rem;
  }

  :deep(ul) {
    padding-left: 1.2em;
    list-style-type: disc;
  }

  :deep(ol) {
    padding-left: 1.2em;
    list-style-type: decimal;
  }

  :deep(li) {
    margin: 0.4rem 0;
    > p {
      margin: 0;
    }
  }

  :deep(blockquote) {
    margin: 1.4rem 0;
    border-left: 3px solid #b3bfc7;
    padding: 2px 0 2px 0.7em;
    color: #626e77;
    :first-child {
      margin: 0;
    }
  }

  :deep(h2 + p) {
    margin-top: 1rem;
  }

  :deep(h3 + p) {
    margin-top: 0.5rem;
  }

  :deep(code) {
    border-radius: 3px;
    font-size: 0.9rem;
    display: block;
    overflow-x: auto;
    background: #1d1f21;
    color: #c5c8c6;
    padding: 0.5em;
  }

  :deep(img) {
    max-height: 60vh;
    margin: 1.5rem auto;
  }
}
</style>
