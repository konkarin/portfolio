<template>
  <section class="dashboard__content dashboardEdit">
    <h1>Profile</h1>
    <div class="dashboardEdit__head">
      <div />
      <div class="dashboardEdit__btn">
        <button class="btn" @click="saveProfile">保存</button>
      </div>
    </div>
    <MarkdownEditor :plain-text="plainText" @input="setPlainText" @save="saveProfile" />
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { User } from '@firebase/auth'
import { db } from '@/api/apis'

type Data = {
  plainText: string
}

export default defineComponent({
  data(): Data {
    return {
      plainText: '',
    }
  },
  computed: {
    user(): User | null {
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
      const data = await db.getDocById('users', this.user?.uid || '')
      if (data === undefined) return ''
      return data.profile as string
    },

    async saveProfile() {
      const data = {
        profile: this.plainText as string,
      }

      await db
        .updateDoc('users', this.user?.uid || '', data)
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
