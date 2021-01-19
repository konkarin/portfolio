<template>
  <div>
    <h3>Gallery Editor</h3>
    <button class="flat-button edit-button" @click="deleteImgList()">
      Delete
    </button>
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
            v-model="selectedImgList"
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import firebase from '@/plugins/firebase'

type Data = {
  imgList: firebase.firestore.DocumentData[]
  selectedImgList: string[]
  deletingImgListId: string[]
}
type User = firebase.User

export default Vue.extend({
  data(): Data {
    return {
      imgList: [],
      selectedImgList: [],
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
      }
    },

    // 選択した画像のFirestoreドキュメントを削除する
    async deleteImgList(): Promise<void> {
      // 画像が選択されてない場合アラートを表示
      if (this.selectedImgList.length === 0) {
        alert('Please select images')
        return
      }

      const collectionRef = firebase
        .firestore()
        .collection(`users/${this.user.uid}/images`)

      const selectedImgList: string[] = this.selectedImgList

      // 選択した画像のdocumentを取得
      const snapshots = await Promise.all(
        selectedImgList.map((path) =>
          collectionRef.where('originalFilePath', '==', path).get()
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
