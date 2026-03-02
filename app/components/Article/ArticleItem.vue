<template>
  <NuxtLink :to="`/articles/${articleId}`" class="articleItem">
    <div class="articleItem__eyeCatchOuter">
      <div class="articleItem__eyeCatchInner">
        <template v-if="imageUrl && !isImageError">
          <div v-if="!isImageLoaded" class="articleItem__skeleton"></div>
          <img
            v-show="isImageLoaded"
            ref="imgRef"
            class="articleItem__eyeCatch"
            :src="imageUrl"
            alt=""
            @load="isImageLoaded = true"
            @error="isImageError = true"
          />
        </template>
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
      {{ article.text }}
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import type { Article } from '@/types/index'
import Day from '@/utils/day'

const { article } = defineProps<{
  article: Article
}>()

const isImageError = ref(false)
const isImageLoaded = ref(false)
const imgRef = ref<HTMLImageElement | null>(null)

const imageUrl = computed(() => article.thumbnailImageUrl || article.ogpImageUrl || '')

const releaseDate = computed(() => {
  const format = 'YYYY-MM-DD'
  return Day.getDate(article.releaseDate, format)
})

onMounted(() => {
  if (imgRef.value?.complete) {
    isImageLoaded.value = true
  }
})

const articleId = computed(() => article.customId || article.id)
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
  position: relative;
}

.articleItem__eyeCatch {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.articleItem__skeleton {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #eee;
  animation: pulse 1.5s infinite ease-in-out;
  z-index: 1;
}

@keyframes pulse {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
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
