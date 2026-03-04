<template>
  <section>
    <h2>Tech</h2>
    <ul class="tech-list">
      <li v-for="article in zenn" :key="article.link" class="tech">
        <a :href="article.link" target="_blank">
          <img src="https://static.zenn.studio/images/icon.png" class="favicon" alt="" />
          <span>{{ article.title }}</span>
        </a>
      </li>
      <li v-for="slide in slides" :key="slide.link" class="tech">
        <a :href="slide.link" target="_blank">
          <img src="https://d1eu30co0ohy4w.cloudfront.net/favicon.ico" class="favicon" alt="" />
          <span>{{ slide.title }}</span>
        </a>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { useFetch } from '#app'

interface Root {
  status: string
  feed: Feed
  items: Item[]
}

interface Feed {
  url: string
  title: string
  link: string
  author: string
  description: string
  image: string
}

interface Item {
  title: string
  pubDate: string
  link: string
  guid: string
  author: string
  thumbnail: string
  description: string
  content: string
  enclosure: Enclosure
  categories: any[]
}

interface Enclosure {
  link: string
  type: string
}

const { data: zenn } = await useFetch(
  'https://api.rss2json.com/v1/api.json?rss_url=https://zenn.dev/kon_karin/feed',
  {
    transform,
  },
)

const { data: slides } = await useFetch(
  'https://api.rss2json.com/v1/api.json?rss_url=https://speakerdeck.com/konkarin.rss',
  {
    transform,
  },
)

function transform(data: Root) {
  return (data?.items ?? []).slice(0, 2).map((item: Item) => {
    return {
      title: item.title,
      link: item.link,
    }
  })
}
</script>

<style lang="scss" scoped>
h2 {
  margin: 1rem 0;
}
.tech-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 0;
}

.tech {
  > a {
    display: flex;
    gap: 0.2rem;
    padding: 2px;
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  }
}

.favicon {
  width: 24px;
  height: 24px;
  display: inline;
  border-radius: 4px;
}
</style>
