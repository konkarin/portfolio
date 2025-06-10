<template>
  <NuxtLink :to="`/articles/${articleId}`" class="articleItem">
    <div data-test="releaseDate" class="articleItem__subTitle">
      {{ releaseDate }}
    </div>
    <div data-test="articleTitle" class="articleItem__title">
      {{ article.title }}
    </div>
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
  </NuxtLink>
</template>

<script lang="ts">
import Day from '@/utils/day'
import type { Article } from '@/types/index'

export default defineComponent({
  props: {
    article: {
      type: Object as PropType<Article>,
      required: true,
    },
  },
  computed: {
    releaseDate(): string {
      const format = 'YYYY-MM-DD'

      return Day.getDate(this.article.releaseDate, format)
    },
    articleId() {
      return this.article.customId || this.article.id
    },
  },
})
</script>

<style scoped lang="scss">
.articleItem__eyeCatchOuter {
  overflow: hidden;
  height: 400px;
}

@media screen and ($sm <= width < $md) {
  .articleItem__eyeCatchOuter {
    height: 300px;
  }
}

@media screen and (max-width: $sm) {
  .articleItem__eyeCatchOuter {
    height: 200px;
  }
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
  font-size: 3rem;
  filter: grayscale(1);
  background: #eee;
}

.articleItem__subTitle {
  color: var(--gray);
}
</style>
