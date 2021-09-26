<template>
  <section class="articleEdit">
    <!-- TODO: 戻るボタンほしい -->
    <textarea
      v-model="article.title"
      placeholder="Title"
      class="articleEdit__title dashboardEdit__title"
      maxlength="64"
    />
    <div class="dashboardEdit__head">
      <div class="articleEdit__tagContainer">
        <b>Tags:</b>
        <input
          v-model="tag"
          class="articleEdit__tag"
          type="text"
          placeholder="コンマ区切りで入力"
        />
      </div>
      <div class="dashboardEdit__btnWrapper">
        <ToggleBtn
          class="dashboardEdit__btn"
          :toggle-btn="article.isPublished"
          @toggle="updatePublishing"
        >
          公開する
        </ToggleBtn>
        <button
          class="dashboardEdit__btn btn"
          :disabled="article.title === '' || tag === ''"
          @click="updateArticle"
        >
          保存
        </button>
      </div>
    </div>
    <MarkdownEditor :plain-text="article.text" @input="setText" />
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
        createdDate: Day.getUnixMS(),
        releaseDate: null,
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
      await this.showArticle()
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

    async showArticle(): Promise<void> {
      const article = await this.getArticle()

      if (article == null) return
      this.article = article
    },

    async updateArticle() {
      if (this.article.title.length === 0) {
        alert('Titleは必須です。')
        return
      }

      const articlesPath = `users/${this.$store.state.user.uid}/articles`

      this.article.tags = this.tag.replace(/\s+/g, '').split(',')

      // 公開日の設定
      if (this.article.isPublished) {
        if (this.article.releaseDate == null) {
          this.article.releaseDate = Day.getUnixMS()
        } else {
          this.article.updatedDate = Day.getUnixMS()
        }
      }

      try {
        await Apis.db.updateDoc(articlesPath, this.article.id, this.article)
      } catch (e) {
        alert('Failed to update artilces')
        return
      }

      // 書き込み時にDBに存在しないタグがあればDBに追加する
      const notExistsTags = this.article.tags.filter(
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
