<template>
  <section class="dashboard__content">
    <h1 class="dashboard__title">Articles</h1>
    <div class="dashboard__articleList">
      <article
        v-for="article in articles"
        :key="article"
        class="dashboard__articleItemContainer"
      >
        <div class="dashboard__articleItem">
          <NuxtLink to="" class="dashboard__articleTitle">
            {{ article }}
          </NuxtLink>
          <div class="dashboard__articleEdit">
            <div class="dashboard__articleToggleBtn">
              <ToggleBtn :toggle-btn="isPublished" @toggle="updatePublishing" />
              公開する
            </div>
            <button class="btn">編集</button>
          </div>
        </div>
        <div class="dashboard__articleFooter">tag date</div>
      </article>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      articles: ['hoge', 'fuga', 'piyo'],
      isPublished: true,
    }
  },
  methods: {
    updatePublishing() {
      this.isPublished = !this.isPublished
    },
  },
})
</script>
