<template>
  <main class="wrapper">
    <PageTitle>Contact</PageTitle>
    <div class="contact">
      <div class="contact__message">
        ご質問、ご意見、お仕事のご依頼等は以下よりお願いいたします。
      </div>
      <div class="contact__sns">
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
    </div>
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
