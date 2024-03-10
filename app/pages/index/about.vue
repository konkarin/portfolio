<template>
  <main class="wrapper">
    <PageTitle>
      About
      <a href="https://twitter.com/k0n_karin" class="pageTitle__link" target="_blank">
        こんかりん
      </a>
    </PageTitle>
    <div class="profile">
      <MarkdownPreview :html-text="profile || ''" />
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
import { db } from '@/api/apis'
import { convertMarkdownTextToHTML } from '@/utils/markdown'

export default defineNuxtComponent({
  name: 'PagesAbout',
  async setup() {
    const { AUTHOR_ID, APP_URL } = useRuntimeConfig().public

    const { data: profile } = await useAsyncData(async () => {
      const data = await db.getDocById('users', AUTHOR_ID).catch((e) => {
        console.error(e)
        return {
          profile: '',
        }
      })

      return await convertMarkdownTextToHTML(data?.profile || '')
    })

    useHead({
      title: 'About',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'About konkarin.',
        },
        { hid: 'og:type', property: 'og:type', content: 'article' },
        {
          hid: 'og:title',
          property: 'og:title',
          content: "About - konkarin's photos & blog",
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${APP_URL}/about`,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: 'About konkarin.',
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: 'https://konkarin.photo/HomeImg.jpg',
        },
      ],
    })

    return {
      profile,
    }
  },
})
</script>
