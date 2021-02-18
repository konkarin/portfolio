<template>
  <section class="dashboard__content">
    <MarkdownEditor :plain-text="plainText" @input="setPlainText" />
    <button class="dashboard__btn btn" @click="saveProfile">保存</button>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import firebase from '@/plugins/firebase'
import apis from '@/api/apis'

type Data = {
  plainText: string
}

type User = firebase.User

export default Vue.extend({
  data(): Data {
    return {
      plainText: '',
    }
  },
  computed: {
    user(): User {
      return this.$store.state.user
    },
  },
  async created() {
    this.plainText = await this.getProfile()
  },
  methods: {
    setPlainText(val: string) {
      this.plainText = val
    },
    async getProfile() {
      const data = await apis.Db.getDocById('users', this.user.uid)

      return data.profile as string
    },

    async saveProfile() {
      const data = {
        profile: this.plainText as string,
      }

      try {
        await apis.Db.updateDoc('users', this.user.uid, data)

        // TODO: ポップアップにする
        alert('Saved')
      } catch (e) {
        alert(e)
        console.error(e)
      }
    },
  },
})
</script>
