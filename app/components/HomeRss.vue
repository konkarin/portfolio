<template>
  <section>
    <h2>Tech</h2>
    <ul class="tech-list">
      <li v-for="article in techArticles" :key="article.link" class="tech">
        <a :href="article.link" target="_blank">
          <img src="https://static.zenn.studio/images/icon.png" class="favicon" />
          <span>{{ article.title }}</span>
        </a>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
const { data } = await useFetch(
  'https://api.rss2json.com/v1/api.json?rss_url=https://zenn.dev/kon_karin/feed',
)
const techArticles = computed(() => (data.value?.items ?? []).slice(0, 3))
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
