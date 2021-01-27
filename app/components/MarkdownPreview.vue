<template>
  <div class="markdown" />
</template>

<style scoped>
.markdown > :first-child {
  margin-top: 0;
}

.markdown >>> h1 {
  font-size: 2em;
  font-weight: bold;
  margin-top: 1.5em;
}

.markdown >>> h2 {
  font-size: 1.7em;
  font-weight: bold;
  margin-top: 1.5em;
  border-bottom: 1px solid #ddd;
}

.markdown >>> h3 {
  font-size: 1.5em;
  font-weight: bold;
  margin-top: 1.5em;
}

.markdown >>> h4 {
  font-size: 1.3em;
  font-weight: bold;
  margin-top: 1.5em;
}
.markdown >>> h5 {
  font-size: 1.1em;
  font-weight: bold;
  margin-top: 1.5em;
}
.markdown >>> h6 {
  font-size: 1em;
  font-weight: bold;
  margin-top: 1.5em;
}

.markdown >>> h1 + h2 {
  margin-top: 1em;
}

.markdown >>> h2 + h3 {
  margin-top: 1em;
}
.markdown >>> h3 + h4 {
  margin-top: 1em;
}
.markdown >>> h4 + h5 {
  margin-top: 1em;
}
.markdown >>> h5 + h6 {
  margin-top: 1em;
}

.markdown >>> ul {
  padding-left: 1.2em;
  list-style-type: disc;
}

.markdown >>> ol {
  padding-left: 1.2em;
  list-style-type: decimal;
}
.markdown >>> p {
  margin-top: 1.5rem;
}
.markdown >>> h2 + p {
  margin-top: 0.3rem;
}
.markdown >>> h3 + p {
  margin-top: 0.3rem;
}
</style>
