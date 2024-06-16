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
      <div class="dashboardEdit__headContainer">
        <div class="dashboardEdit__tagContainer">
          <b>Tags:</b>
          <input
            v-model="tag"
            class="dashboardEdit__input"
            type="text"
            placeholder="コンマ区切りで入力"
          />
        </div>
        <div class="dashboardEdit__tagContainer">
          <b>CustomID:</b>
          <input
            v-model="customId"
            class="dashboardEdit__input"
            type="text"
            placeholder="CustomIDを入力"
            @input="validateCustomId(($event.target as HTMLInputElement).value)"
          />
          <div v-if="!isValidCustomId">
            <div class="dashboardEdit__error">利用できないCustomIDだよ</div>
          </div>
        </div>
        <div class="dashboardEdit__ogpContainer">
          <div class="dashboardEdit__ogpInput">
            <b>OGP画像</b>
            <input
              v-model="ogpImageUrl"
              class="dashboardEdit__input"
              type="text"
              placeholder="OGP画像のURLを入力"
            />
          </div>
          <div class="dashboardEdit__ogpPreview">
            <img :src="ogpImageUrl" class="dashboardEdit__ogpPreviewImg" />
          </div>
        </div>
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
          :disabled="article.title === '' || tag === '' || !isValidCustomId"
          @click="updateArticle"
        >
          保存
        </button>
      </div>
    </div>
    <MarkdownEditor :plain-text="plainText" @input="setText" @save="updateArticle" />
  </section>
</template>

<script lang="ts">
import { db } from '@/api/apis'
import type { Article } from '@/types/index'
import Day from '~/utils/day'
import { getArticleTags } from '~/utils/article'

interface Data {
  article: Article
  tag: string
  ogpImageUrl: string
  customId: string
  availableCustomIds: string[]
  isValidCustomId: boolean
}

export default defineNuxtComponent({
  data(): Data {
    return {
      article: {
        id: this.$route.params.article as string,
        title: '',
        text: '',
        isPublished: false,
        updatedDate: 0,
        createdDate: Day.getUnixMS(),
        releaseDate: 0,
        tags: [],
        ogpImageUrl: '',
      },
      tag: '',
      customId: '',
      ogpImageUrl: '',
      availableCustomIds: [],
      isValidCustomId: true,
    }
  },
  head(): { title: string } {
    return {
      title: `Editing ${this.articleTitle}`,
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    articleTitle(): string {
      return this.article.title
    },
    plainText(): string {
      return this.article.text
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
    if (this.article.ogpImageUrl !== undefined) {
      this.ogpImageUrl = this.article.ogpImageUrl
    }

    this.availableCustomIds = (await getArticles(useRuntimeConfig().public.AUTHOR_ID)).flatMap(
      (article) => {
        if (article.customId) return [article.id, article.customId]
        else return article.id
      }
    )
    this.customId = this.article.customId || ''
  },
  methods: {
    updatePublishing() {
      this.article.isPublished = !this.article.isPublished
    },

    setText(val: string) {
      this.article.text = val
    },

    validateCustomId(id: string) {
      // 利用可能な文字は半角英数とハイフンアンダーバーのみ
      const reg = /^[a-zA-Z0-9-_]*$/
      this.isValidCustomId = !this.availableCustomIds.includes(id) && reg.test(id)
    },

    async getArticle() {
      const uid = this.$store.state.user?.uid

      if (uid == null) return

      const collectionPath = `users/${uid}/articles`

      const article = (await db.getDocById(collectionPath, this.article.id)) as Article

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

      if (!this.isValidCustomId) {
        alert('利用できないCustomIDです')
        return
      }

      const articlesPath = `users/${this.user?.uid}/articles`

      this.article.tags = this.tag.replace(/\s+/g, '').split(',')
      this.article.ogpImageUrl = this.ogpImageUrl
      this.article.customId = this.customId

      // 公開日の設定
      if (this.article.isPublished) {
        // 公開日が既にある場合は更新日を更新
        if (this.article.releaseDate) {
          this.article.updatedDate = Day.getUnixMS()
        } else {
          this.article.releaseDate = Day.getUnixMS()
        }
      }

      try {
        await db.addData(articlesPath, this.article.id, this.article)
      } catch (e) {
        alert('Failed to update artilces')
        return
      }

      const articleTags = await getArticleTags(this.user?.uid || '')

      // 書き込み時にDBに存在しないタグがあればDBに追加する
      const notExistsTags = this.article.tags.filter((tag) => !articleTags.includes(tag))

      if (notExistsTags) {
        const articleTagsPath = `users/${this.user?.uid}/articleTags`

        try {
          for (const tag of notExistsTags) {
            await db.addData(articleTagsPath, tag, {})
          }
        } catch (e) {
          alert('Failed to update tags')
          return
        }
      }

      alert('Completed')
    },
  },
})
</script>

<style lang="scss" scoped>
.dashboardEdit__error {
  color: red;
}
</style>
