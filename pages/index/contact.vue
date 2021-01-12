<template>
  <div class="wrapper">
    <h1>Contact</h1>
    <p>ご質問、ご意見、お仕事のご依頼等は以下よりお願いいたします。</p>
    <a href="https://twitter.com/k0n_karin" target="_blank">
      <Twitter />
    </a>
    <a href="https://www.instagram.com/k0n_karin/" target="_blank">
      <Instagram />
    </a>
    <a href="https://github.com/konkarin" target="_blank">
      <Github />
    </a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  // transition: 'page'
  head() {
    return {
      title: 'Contact',
    }
  },
})
</script>
