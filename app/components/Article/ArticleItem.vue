<template>
  <NuxtLink :to="`/articles/${articleId}`" class="articleItem">
    <div class="articleItem__eyeCatchOuter">
      <div class="articleItem__eyeCatchInner">
        <img
          v-if="article.ogpImageUrl"
          class="articleItem__eyeCatch"
          :src="article.ogpImageUrl"
          loading="lazy"
        />
        <div v-else class="articleItem__emptyEyeCatch">🦊</div>
      </div>
    </div>
    <div>
      <div data-test="releaseDate" class="articleItem__subTitle">
        {{ releaseDate }}
      </div>
      <div data-test="articleTitle" class="articleItem__title">
        {{ article.title }}
      </div>
    </div>
    <div class="articleItem__text">
      {{ sliecedText }}
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { remark } from 'remark'
import strip from 'strip-markdown'

import type { Article } from '@/types/index'
import Day from '@/utils/day'

const { article } = defineProps<{
  article: Article
}>()

const releaseDate = computed(() => {
  const format = 'YYYY-MM-DD'
  return Day.getDate(article.releaseDate, format)
})

const articleId = computed(() => article.customId || article.id)

const file = await remark()
  .use(strip)
  .process(article.text)
  .catch((e) => {
    console.error({ e })
    return article.text
  })

const strippedText = file.toString()
const sliecedText = strippedText.length > 100 ? strippedText.slice(0, 100) + '...' : strippedText
</script>

<style scoped lang="scss">
.articleItem {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: var(--black);
  max-width: 400px;
  width: 100%;
  @media (hover: hover) {
    &:hover {
      text-decoration: none;
      color: var(--darkYellow);
      & .articleItem__eyeCatchInner {
        transform: scale(1.05);
        opacity: 0.8;
      }
    }
  }
}

.articleItem__title {
  display: block;
  width: 100%;
  font-size: 1.5em;
  font-weight: bold;
  transition: 0.3s;
}

.articleItem__eyeCatchOuter {
  overflow: hidden;
  height: 200px;
}

.articleItem__eyeCatchInner {
  transition:
    opacity 0.3s,
    transform 0.3s;
  height: 100%;
}

.articleItem__eyeCatch {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.articleItem__emptyEyeCatch {
  display: grid;
  justify-content: center;
  height: 100%;
  align-items: center;
  font-size: 4rem;
  filter: grayscale(1);
  background: #eee;
}

.articleItem__subTitle {
  color: #666;
}

.articleItem__title {
  font-weight: bold;
}

.articleItem__text {
  font-size: 0.9rem;
  color: #666;
}
</style>
