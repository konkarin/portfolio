<template>
  <div class="wrapper">
    <textarea v-model="inputText" @input="setMarkdown" />
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="markdownText" />
    <button @click="saveProfile">保存</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import firebase from '@/plugins/firebase'
import { convertTextToMarkdown } from '@/utils/markdown'

type Data = {
  inputText: string
  markdownText: string
}

type User = firebase.User

export default Vue.extend({
  data(): Data {
    return {
      inputText: '',
      markdownText: '',
    }
  },
  computed: {
    user(): User {
      return this.$store.state.user
    },
  },
  async created() {
    this.inputText = await this.getProfile()
    this.setMarkdown()
  },
  methods: {
    async setMarkdown() {
      this.markdownText = await convertTextToMarkdown(this.inputText)
    },

    async getProfile() {
      const collectionRef = firebase.firestore().collection('users')

      const data = await collectionRef.doc(this.user.uid).get()

      return data.get('profile')
    },

    async saveProfile() {
      const data = {
        profile: this.inputText,
      }

      const collectionRef = firebase.firestore().collection('users')
      try {
        await collectionRef.doc(`${this.user.uid}`).update(data)
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
