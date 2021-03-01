<template>
  <section class="wrapper">
    <div class="articleEdit">
      <textarea
        v-model="title"
        placeholder="Title"
        class="articleEdit__title"
        maxlength="64"
      />
      <ToggleBtn
        :toggle-btn="isPublished"
        class="articleEdit__toggleBtn"
        @toggle="updatePublishing"
      >
        公開する
      </ToggleBtn>
      <MarkdownEditor :plain-text="text" @input="setText" />
      <button class="articleEdit__btn btn btn--center" @click="updateArticle">
        保存
      </button>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import apis from '@/api/apis'
import { Article } from '@/types/index'
import day from '~/utils/day'

export default Vue.extend({
  data(): Article {
    return {
      id: this.$route.params.article,
      title: '',
      text: '',
      isPublished: false,
      updatedDate: null,
      createdDate: null,
    }
  },
  computed: {
    articleTitle(): string {
      return this.title
    },
  },
  async mounted() {
    if (!this.$store.state.isAuth) {
      this.$router.push({ path: '/dashboard/articles' })
      return
    }

    await this.setArticle()
  },
  methods: {
    updatePublishing() {
      this.isPublished = !this.isPublished
    },

    setText(val: string) {
      this.text = val
    },

    async getArticle() {
      const uid: string = this.$store.state.user.uid

      const collectionPath = `users/${uid}/articles`

      const article = (await apis.db.getDocById(
        collectionPath,
        this.id
      )) as Article

      return article
    },

    async setArticle() {
      const article = await this.getArticle()

      if (article == null) return

      this.title = article.title
      this.text = article.text
      this.isPublished = article.isPublished
      this.createdDate = article.createdDate
    },

    async updateArticle() {
      if (this.title.length === 0) {
        alert('Titleは必須です。')
        return
      }

      const collectionPath = `users/${this.$store.state.user.uid}/articles`

      const article: Article = {
        id: this.id,
        title: this.title,
        text: this.text,
        isPublished: this.isPublished,
        updatedDate: day.getUnixMS(),
        createdDate: this.createdDate || day.getUnixMS(),
      }

      await apis.db.updateDoc(collectionPath, article.id, article)
      alert('Completed')
    },
  },
  head(): { title: string } {
    return {
      title: `Editing ${this.articleTitle}`,
    }
  },
})
</script>

<style lang="scss" scoped>
.articleEdit {
  &__title {
    width: 100%;
    height: 2.5rem;
    border: 0;
    padding: 0;
    outline: 0;
    resize: none;
    font-size: 1.5rem;
    font-weight: bold;
    line-height: 1.6;
    background-color: #fbfcff;
  }

  &__toggleBtn {
    justify-content: flex-end;
    margin-top: 0.5rem;
  }

  &__btn {
    display: flex;
    margin-top: 1rem;
  }
}
</style>
