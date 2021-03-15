<template>
  <main class="wrapper">
    <PageTitle>
      About
      <a
        href="https://twitter.com/k0n_karin"
        class="pageTitle__link"
        target="_blank"
      >
        こんかりん
      </a>
    </PageTitle>
    <div class="profile">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <MarkdownPreview v-html="profile" />
      <div class="profile__sns sns">
        <a
          href="https://twitter.com/k0n_karin"
          class="sns__icon shareBtn shareBtn--lg"
          target="_blank"
        >
          <Twitter />
        </a>
        <a
          href="https://www.instagram.com/k0n_karin/"
          class="sns__icon shareBtn shareBtn--lg"
          target="_blank"
        >
          <Instagram />
        </a>
        <a
          href="https://github.com/konkarin"
          class="sns__icon shareBtn shareBtn--lg"
          target="_blank"
        >
          <Github />
        </a>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import apis from '@/api/apis'
import { convertTextToMarkdown } from '@/utils/markdown'

interface Data {
  profile: string
}

export default Vue.extend({
  async asyncData(): Promise<Data> {
    const data = await apis.db.getDocById('users', process.env.authorId)

    return {
      profile: await convertTextToMarkdown(data.profile),
    }
  },
  data(): Data {
    return {
      profile: '',
    }
  },
  async mounted() {
    if (this.profile === '') {
      const data = await apis.db.getDocById('users', process.env.authorId)

      this.profile = await convertTextToMarkdown(data.profile)
    }
  },
  head() {
    return {
      title: 'About',
      meta: [
        { hid: 'og:type', property: 'og:type', content: 'article' },
        {
          hid: 'og:title',
          property: 'og:title',
          content: "About - kon_karin's photo & blog",
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${process.env.APP_URL}about`,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: 'kon_karinの自己紹介です。',
        },
      ],
    }
  },
})
</script>
