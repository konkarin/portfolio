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
import firebase from '@/utils/firebase'

interface Data {
  imgList: firebase.firestore.DocumentData[]
  selectedImgPathList: string[]
  deletingImgListId: string[]
}

type User = firebase.User

export default Vue.extend({
  data(): Data {
    return {
      imgList: [],
      selectedImgPathList: [],
      deletingImgListId: [],
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
    async getImgList(): Promise<firebase.firestore.DocumentData[]> {
      const collectionRef = firebase
        .firestore()
        .collection(`users/${this.user.uid}/images`)

      try {
        const snapshot = await collectionRef.get()

        return snapshot.docs.map((doc) => doc.data())
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

      const collectionRef = firebase
        .firestore()
        .collection(`users/${this.user.uid}/images`)

      const selectedImgPathList: string[] = this.selectedImgPathList

      // 選択した画像のdocumentを取得
      const snapshots = await Promise.all(
        selectedImgPathList.map((imgPath) =>
          collectionRef.where('originalFilePath', '==', imgPath).get()
        )
      )
      snapshots.forEach((snapshot) =>
        snapshot.forEach((document) => this.deletingImgListId.push(document.id))
      )

      // まとめて削除
      await Promise.all(
        this.deletingImgListId.map((id: string) =>
          collectionRef.doc(id).delete()
        )
      )

      // TODO: ポップアップにする
      alert('Remove successfully')

      this.imgList = await this.getImgList()
    },
  },
})
</script>
