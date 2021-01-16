<template>
  <div>
    <h3>Gallery Editor</h3>
    <button class="flat-button edit-button" @click="deleteImgs()">
      Delete
    </button>
    <div class="gallery">
      <div
        v-for="(photo, index) in photoList"
        :key="photo.fileName"
        class="photo-box"
      >
        <label>
          <input
            :id="index"
            v-model="selectValueList"
            type="checkbox"
            class="img-checkbox"
            :value="photo.fileName"
          />
          <div class="thumb-box">
            <img class="select-img" :src="photo.thumburl" />
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
  photoList: object[]
  selectValueList: object[]
}

export default Vue.extend({
  data(): Data {
    return {
      photoList: [],
      selectValueList: [],
    }
  },
  async created(): Promise<void> {
    await this.getImages()
  },
  methods: {
    /**
     *
     */
    async getImages(): Promise<void> {
      const snapshot = await firebase.firestore().collection('images').get()

      this.photoList = snapshot.docs.map((doc) => doc.data())
    },

    // 選択した画像のFirestoreドキュメントを削除する
    deleteImgs(): void {
      // 画像が選択されてない場合アラートを表示
      if (this.selectValueList.length === 0) {
        alert('Please select images')
        return
      }

      // 確認ダイアログを表示
      if (confirm('Remove your images?')) {
        // 参照先を指定
        const db = firebase.firestore().collection('images')

        for (const item of this.selectValueList) {
          // 選択した画像名と一致するドキュメントを取得
          db.where('fileName', '==', item)
            .get()
            .then((snapshot) => {
              snapshot.forEach((document) => {
                // ドキュメントを削除
                // TODO: クライアントで消すべきじゃないかも
                db.doc(document.id)
                  .delete()
                  .catch((e) => {
                    alert(e)
                  })
              })
            })
        }

        alert('Remove successfully')
        this.$router.go({ name: 'MyPage' } as any)
      }
    },
  },
})
</script>
