<script setup lang="ts">
import Github from '@/components/svg/Github.vue'
import Twitter from '@/components/svg/Twitter.vue'
</script>

<template>
  <section class="server-component">
    <h2>About me</h2>
    <div class="profile">
      <div class="profile-image">
        <div></div>
      </div>
      <div>
        <p>
          こん と申します。コーヒー飲みながら猫と暮らしています。たまにキャンプします。
        </p>
        <p>
          Frontend Engineer @Henry (ex-Yappli, ex-CRI Middleware)
        </p>
        <p class="accounts">
          <a href="https://x.com/k0n_karin" target="_blank"><Twitter />Twitter</a>
          <a href="https://github.com/konkarin" target="_blank"><Github />GitHub</a>
        </p>
      </div>
    </div>
  </section>
</template>
