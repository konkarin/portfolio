<template>
  <li class="post">
    <NuxtLink :to="`/articles/${article.customId || article.id}`">
      <div class="post-inner">
        <div>
          <p class="post-subTitle">
            {{ releaseDate(article.releaseDate) }}
          </p>
          <p class="post-title">
            {{ article.title }}
          </p>
        </div>
        <p class="post-text">{{ sliecedText }}</p>
      </div>
      <div class="post-img">
        <img v-if="article.ogpImageUrl" :src="article.ogpImageUrl" alt="" />
        <div class="post-dummyImg" v-else>🦊</div>
      </div>
    </NuxtLink>
  </li>
</template>

<script setup lang="ts">
import { remark } from 'remark'
import strip from 'strip-markdown'
import type { Article } from '@/types'
import Day from '@/utils/day'

const { article } = defineProps<{
  article: Article
}>()

const file = await remark()
  .use(strip)
  .process(article.text)
  .catch((e) => {
    console.error({ e })
    return article.text
  })

const strippedText = file.toString()
const sliecedText = strippedText.length > 80 ? strippedText.slice(0, 80) + '...' : strippedText

const releaseDate = (date?: number) => {
  const format = 'YYYY-MM-DD'

  return Day.getDate(date, format)
}
</script>

<style lang="scss" scoped>
h2 {
  margin: 1rem 0;
}

.blog {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post {
  font-size: 1.2rem;
  line-height: 1.5;
  color: #333;
  > a {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 1rem;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 0.5rem;
    }
  }

  &:hover .post-title {
    color: var(--darkYellow);
  }
  @media (hover: hover) {
    &:hover {
      .post-img > img,
      .post-img:has(div) > div {
        transform: scale(1.05);
        opacity: 0.8;
      }
    }
  }
}

.post-inner {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;

  @media (max-width: 768px) {
    gap: 0;
  }
}

.post-title {
  font-weight: bold;
}

.post-subTitle {
  font-size: 14px;
  color: #666;
}

.post-text {
  color: var(--gray);
  font-size: 0.9rem;
  @media (max-width: 768px) {
    visibility: hidden;
    height: 0px;
  }
}
.post-text {
  color: #666;
  font-size: 0.9rem;
}

.post-img {
  height: 150px;
  width: 250px;
  overflow: hidden;
  border-radius: 8px;
  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition:
      opacity 0.3s,
      transform 0.3s;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
}

.post-dummyImg {
  display: grid;
  justify-content: center;
  height: 100%;
  align-items: center;
  font-size: 4rem;
  filter: grayscale(1);
  background: #eee;
  height: 100%;
  transition:
    opacity 0.3s,
    transform 0.3s;
}

.link-button {
  padding: 0.5rem 1rem;
  border-radius: 50px;
  background-color: var(--yellow);
  font-weight: bold;
  transition: opacity 0.3s;
  &:hover {
    opacity: 0.7;
  }
}

.blog-footer {
  margin-top: 2rem;
}
</style>
