<template>
  <section class="wrapper">
    <textarea v-model="title" placeholder="Title" />
    <MarkdownEditor :plain-text="plainText" @input="setPlainText" />
    <button
      class="dashboard__btn dashboard__btn--center btn"
      @click="updateArticle"
    >
      保存
    </button>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import apis from '@/api/apis'

interface Data {
  title: string
  plainText: string
}

export default Vue.extend({
  data(): Data {
    return {
      title: '',
      plainText: '',
    }
  },
  async mounted() {
    if (!this.$store.state.isAuth) {
      this.$router.push({ path: '/dashboard/articles' })
      return
    }

    const article = await this.getArticle()

    this.title = article.title
    this.plainText = article.text
  },
  methods: {
    setPlainText(val: string) {
      this.plainText = val
    },

    async getArticle() {
      const collectionPath = `users/${this.$store.state.user.uid}/articles`

      const article = await apis.Db.getDocById(
        collectionPath,
        this.$route.params.article
      )

      if (article == null)
        return {
          title: '',
          text: '',
        }

      return article
    },

    async updateArticle() {
      const collectionPath = `users/${this.$store.state.user.uid}/articles`

      const article = {
        title: this.title,
        text: this.plainText,
      }

      await apis.Db.updateDoc(
        collectionPath,
        this.$route.params.article,
        article
      )
    },
  },
})
</script>

<style lang="scss" scoped>
textarea {
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
</style>
