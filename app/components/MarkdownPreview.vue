<template>
  <div class="markdown" />
</template>

<style lang="scss" scoped>
.markdown > :first-child {
  margin-top: 0;
}

.markdown ::v-deep h1 {
  font-size: 2em;
  font-weight: bold;
  margin-top: 1.5em;
}

.markdown ::v-deep h2 {
  font-size: 1.7em;
  font-weight: bold;
  margin-top: 1.5em;
  border-bottom: 1px solid #ddd;
}

.markdown ::v-deep h3 {
  font-size: 1.5em;
  font-weight: bold;
  margin-top: 1.5em;
}

.markdown ::v-deep h4 {
  font-size: 1.3em;
  font-weight: bold;
  margin-top: 1.5em;
}
.markdown ::v-deep h5 {
  font-size: 1.1em;
  font-weight: bold;
  margin-top: 1.5em;
}
.markdown ::v-deep h6 {
  font-size: 1em;
  font-weight: bold;
  margin-top: 1.5em;
}

.markdown ::v-deep h1 + h2 {
  margin-top: 1em;
}

.markdown ::v-deep h2 + h3 {
  margin-top: 1em;
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
</style>
