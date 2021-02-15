<template>
  <main class="wrapper">
    <PageTitle>Contact</PageTitle>
    <div class="textMessage">
      ご質問、ご意見、お仕事のご依頼等は以下よりお願いいたします。
    </div>
    <a href="https://twitter.com/k0n_karin" target="_blank">
      <Twitter />
    </a>
    <a href="https://www.instagram.com/k0n_karin/" target="_blank">
      <Instagram />
    </a>
    <a href="https://github.com/konkarin" target="_blank">
      <Github />
    </a>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  head() {
    return {
      title: 'Contact',
    }
  },
})
</script>
