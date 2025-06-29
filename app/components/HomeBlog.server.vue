<template>
  <section>
    <h2>Blog</h2>
    <ul class="blog">
      <li v-for="article in recentArticles" :key="article.id" class="post">
        <NuxtLink :to="`/articles/${article.customId || article.id}`">
          <div class="post-inner">
            <p class="post-title">
              {{ article.title }}
            </p>
            <p class="post-text">{{ sliceText(article.text) }}...</p>
          </div>
          <div class="post-img">
            <img v-if="article.ogpImageUrl" :src="article.ogpImageUrl" alt="" />
            <div class="post-dummyImg" v-else>🦊</div>
          </div>
        </NuxtLink>
      </li>
    </ul>
    <div class="blog-footer">
      <NuxtLink to="articles" class="link-button">View All Posts</NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { fromMarkdown } from 'mdast-util-from-markdown'
import { toString } from 'mdast-util-to-string'

const recentArticles = computed(() => {
  return useNuxtApp().$articles.value?.slice(0, 2) || []
})

const sliceText = (markdown: string, length = 80) => {
  const tree = fromMarkdown(markdown)
  const plainText = toString(tree)
  return plainText.length > length ? plainText.slice(0, length) + '...' : plainText
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
  &:hover .post-text {
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

.post-text {
  color: #666;
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
  font-size: 3rem;
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
