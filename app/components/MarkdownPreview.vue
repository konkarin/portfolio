<template>
  <div class="markdown" />
</template>

<script lang="ts">
import 'highlight.js/styles/tomorrow-night.css'

import Vue from 'vue'
export default Vue.extend({})
</script>

<style lang="scss" scoped>
.markdown > :first-child {
  margin-top: 0;
}

.markdown ::v-deep a {
  color: var(--yellow);

  &:hover {
    text-decoration: underline;
  }
}

.markdown ::v-deep h1 {
  margin-top: 2em;
  border-bottom: 1px solid #ddd;
}

.markdown ::v-deep h2 {
  margin-top: 2em;
  border-bottom: 1px solid #ddd;
}

.markdown ::v-deep h3 {
  margin-top: 1.5em;
}

.markdown ::v-deep h4 {
  margin-top: 1.5em;
}

.markdown ::v-deep h5 {
  margin-top: 1.5em;
}

.markdown ::v-deep h6 {
  font-size: 0.9rem;
}

.markdown ::v-deep h1 + h2 {
  margin-top: 1.5em;
}

.markdown ::v-deep h2 + h3 {
  margin-top: 1.5em;
}

.markdown ::v-deep h3 + h4 {
  margin-top: 1em;
}

.markdown ::v-deep h4 + h5 {
  margin-top: 1em;
}

.markdown ::v-deep h5 + h6 {
  margin-top: 1em;
}

.markdown ::v-deep ul {
  padding-left: 1.2em;
  list-style-type: disc;
}

.markdown ::v-deep ol {
  padding-left: 1.2em;
  list-style-type: decimal;
}
.markdown ::v-deep p {
  margin-top: 1.5rem;
}
.markdown ::v-deep h2 + p {
  margin-top: 0.3rem;
}
.markdown ::v-deep h3 + p {
  margin-top: 0.3rem;
}
.markdown ::v-deep code {
  border-radius: 3px;
  font-size: 0.9rem;
  display: block;
  overflow-x: auto;
  background: #1d1f21;
  color: #c5c8c6;
  padding: 0.5em;
}

.markdown ::v-deep img {
  max-width: 80%;
  margin: 1.5rem auto;
}
</style>
