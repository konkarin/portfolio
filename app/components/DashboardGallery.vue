<template>
  <section class="dashboard__content">
    <h3>Gallery Edit</h3>
    <div class="dashboardEdit__head">
      <ImgUploader />
      <button class="btn" @click="deleteImgList()">Delete</button>
    </div>
    <div class="dashboardEdit__gallery">
      <div v-if="imgList.length === 0">No Photos</div>
      <div
        v-for="(img, index) in imgList"
        :key="img.originalUrl"
        class="photoBox"
        :style="{
          width: `${(img.width * 200) / img.height}px`,
          'flex-grow': `${(img.width * 200) / img.height}`,
        }"
      >
        <label class="photoBox__select">
          <input
            :id="index"
            v-model="selectedImgPathList"
            type="checkbox"
            class="photoBox__checkbox"
            :value="img.originalFilePath"
          />
          <div class="photoBox__thumbnail">
            <img class="photoBox__photo" :src="img.thumbUrl" />
          </div>
        </label>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import firebase from '@/utils/firebase'
import { FirebaseUser } from '~/types/firebase'

interface Data {
  imgList: firebase.firestore.DocumentData[]
  selectedImgPathList: string[]
  deletingImgListId: string[]
}

export default Vue.extend({
  data(): Data {
    return {
      imgList: [],
      selectedImgPathList: [],
      deletingImgListId: [],
    }
  },
  computed: {
    user(): FirebaseUser {
      return this.$store.state.user
    },
  },
  watch: {
    async user(user: FirebaseUser) {
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

<style lang="scss" scoped>
.dashboardEdit__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  :only-child {
    text-align: right;
  }
}

.dashboardEdit__gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  &::after {
    content: '';
    flex-grow: 9999;
  }
}

.photoBox {
  box-sizing: border-box;
  width: 25%;
  height: 100%;
}

.photoBox__thumbnail {
  overflow: hidden;
}

.photoBox__checkbox {
  display: none;
  &:checked + div {
    outline: 5px solid var(--yellow);
    outline-offset: -5px;
  }
}

.photoBox__photo {
  cursor: pointer;
  width: 100%;
  height: 100%;
  display: block;
}
</style>
