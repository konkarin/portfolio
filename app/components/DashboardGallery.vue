<template>
  <section class="dashboard__content">
    <h3>Gallery Edit</h3>
    <div class="dashboardEdit__head">
      <ImgUploader />
      <button class="btn" @click="deleteImgList()">Delete</button>
    </div>
    <div class="gallery">
      <div v-if="imgList.length === 0">No Photos</div>
      <div
        v-for="(img, index) in imgList"
        :key="img.originalUrl"
        class="photo-box"
      >
        <label>
          <input
            :id="index"
            v-model="selectedImgPathList"
            type="checkbox"
            class="img-checkbox"
            :value="img.originalFilePath"
          />
          <div class="thumb-box">
            <img class="select-img" :src="img.thumbUrl" />
          </div>
        </label>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { DocumentData } from '@firebase/firestore'
import { db } from '~/api/apis'
import { Query } from '~/api/firestore'
import { User } from '@firebase/auth'

interface Data {
  imgList: DocumentData[]
  selectedImgPathList: string[]
}

export default Vue.extend({
  data(): Data {
    return {
      imgList: [],
      selectedImgPathList: [],
    }
  },
  computed: {
    user(): User {
      return this.$store.state.user
    },
  },
  watch: {
    async user(user: User) {
      if (user != null) this.imgList = await this.getImgList()
    },
  },
  async mounted() {
    if (this.user) this.imgList = await this.getImgList()
  },
  methods: {
    async getImgList(): Promise<DocumentData[]> {
      const path = `users/${this.user.uid}/images`

      try {
        return await db.getDocsData(path)
      } catch (e) {
        console.error(e)
        return []
      }
    },

    // 選択した画像のFirestoreドキュメントを削除する
    async deleteImgList(): Promise<void> {
      // 画像が選択されてない場合アラートを表示
      if (this.selectedImgPathList.length === 0) {
        alert('Please select images')
        return
      }

      const path = `users/${this.user.uid}/images`

      // 選択した画像のdocumentを取得
      const result = await Promise.all(
        this.selectedImgPathList.map((imgPath) => {
          const query: Query = {
            fieldPath: 'originalFilePath',
            filterStr: '==',
            value: imgPath,
          }

          return db.getDocIds(path, [query])
        })
      )

      const deleteImgIds = result.flatMap((ids) => {
        return ids
      })

      // まとめて削除
      await Promise.allSettled(
        deleteImgIds.map((id) => {
          db.deleteDoc(path, id)
        })
      ).catch((e) => {
        // TODO: トーストとかにしたい
        alert('Some error occured')
        console.error(e)
      })

      // TODO: トーストとかにしたい
      alert('Remove successfully')

      // TODO: firestoreを監視したい
      this.imgList = await this.getImgList()
    },
  },
})
</script>
