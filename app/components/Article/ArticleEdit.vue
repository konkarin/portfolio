<template>
  <section class="wrapper">
    <div class="articleEdit">
      <textarea
        v-model="article.title"
        placeholder="Title"
        class="articleEdit__title"
        maxlength="64"
      />
      <ToggleBtn
        :toggle-btn="article.isPublished"
        class="articleEdit__toggleBtn"
        @toggle="updatePublishing"
      >
        公開する
      </ToggleBtn>
      <MarkdownEditor :plain-text="article.text" @input="setText" />
      <div class="articleEdit__tagContainer">
        <b>Tags:</b>
        <input
          v-model="tag"
          class="articleEdit__tag"
          type="text"
          placeholder="コンマ区切りで入力"
        />
      </div>
      <button class="articleEdit__btn btn btn--center" @click="updateArticle">
        保存
      </button>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import Apis from '@/api/apis'
import { Article } from '@/types/index'
import Day from '~/utils/day'

interface Data {
  article: Article
  tag: string
}

export default Vue.extend({
  data(): Data {
    return {
      article: {
        id: this.$route.params.article,
        title: '',
        text: '',
        isPublished: false,
        updatedDate: null,
        createdDate: null,
        tags: [],
      },
      tag: '',
    }
  },
  computed: {
    articleTitle(): string {
      return this.article.title
    },
  },
  async mounted() {
    if (!this.$store.state.isAuth) {
      this.$router.push({ path: '/dashboard/articles' })
      return
    }

    try {
      await this.setArticle()
    } catch (e) {
      console.error(e)
      alert('Failed to get articles.\nPlease retry.')
      return
    }

    this.tag = this.article.tags.join()
  },
  methods: {
    updatePublishing() {
      this.article.isPublished = !this.article.isPublished
    },

    setText(val: string) {
      this.article.text = val
    },

    async getArticle() {
      const uid: string = this.$store.state.user.uid

      const collectionPath = `users/${uid}/articles`

      const article = (await Apis.db.getDocById(
        collectionPath,
        this.article.id
      )) as Article

      return article
    },

    async setArticle(): Promise<void> {
      const article = await this.getArticle()

      if (article == null) return

      this.article.title = article.title
      this.article.text = article.text
      this.article.isPublished = article.isPublished
      this.article.createdDate = article.createdDate
      this.article.tags = article.tags
    },

    async updateArticle() {
      if (this.article.title.length === 0) {
        alert('Titleは必須です。')
        return
      }

      const articlesPath = `users/${this.$store.state.user.uid}/articles`

      const article: Article = {
        id: this.article.id,
        title: this.article.title,
        text: this.article.text,
        isPublished: this.article.isPublished,
        updatedDate: Day.getUnixMS(),
        createdDate: this.article.createdDate || Day.getUnixMS(),
        tags: this.tag.split(','),
      }

      try {
        await Apis.db.updateDoc(articlesPath, article.id, article)
      } catch (e) {
        alert('Failed to update artilces')
        return
      }

      // 書き込み時にDBに存在しないタグがあればDBに追加する
      const notExistsTags = article.tags.filter(
        (tag) => !this.$store.state.articleTags.includes(tag)
      )

      if (notExistsTags) {
        const articleTagsPath = `users/${this.$store.state.user.uid}/articleTags`

        try {
          for (const tag of notExistsTags) {
            await Apis.db.updateDoc(articleTagsPath, tag, {})
          }
        } catch (e) {
          alert('Failed to update tags')
          return
        }
      }

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
