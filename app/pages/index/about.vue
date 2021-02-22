<template>
  <main class="wrapper">
    <!-- TODO: markedで編集できるようにする -->
    <PageTitle>
      About
      <a href="https://twitter.com/k0n_karin" target="_blank">こんかりん</a>
    </PageTitle>
    <div class="profile">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <MarkdownPreview v-html="profile" />
    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import apis from '@/api/apis'
import { convertTextToMarkdown } from '@/utils/markdown'
import MarkdownPreview from '~/components/MarkdownPreview.vue'

export default Vue.extend({
  components: { MarkdownPreview },
  data() {
    return {
      profile: '',
    }
  },
  async mounted() {
    const data = await apis.db.getDocById('users', process.env.authorId)

    this.profile = await convertTextToMarkdown(data.profile)
  },
  head() {
    return {
      title: 'About',
    }
  },
})
</script>
