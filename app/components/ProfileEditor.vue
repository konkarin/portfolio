<template>
  <section class="dashboard__content">
    <h1>Profile</h1>
    <MarkdownEditor :plain-text="plainText" @input="setPlainText" />
    <button class="dashboard__btn btn btn--center" @click="saveProfile">
      保存
    </button>
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
  async mounted() {
    this.plainText = await this.getProfile().catch((e) => {
      console.error(e)
      alert('Failed to get profiles.\nPlease retry.')
      return ''
    })
  },
  methods: {
    setPlainText(val: string) {
      this.plainText = val
    },

    async getProfile() {
      const data = await apis.db.getDocById('users', this.user.uid)

      return data.profile as string
    },

    async saveProfile() {
      const data = {
        profile: this.plainText as string,
      }

      await apis.db
        .updateDoc('users', this.user.uid, data)
        .then(() => {
          // TODO: ポップアップにする
          alert('Saved')
        })
        .catch((e) => {
          alert('Failed to update profiles.\nPlease retry.')
          console.error(e)
        })
    },
  },
})
</script>
