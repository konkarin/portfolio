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
import { DocumentData } from '@firebase/firestore'
import { User } from '@firebase/auth'
import { db } from '~/api/apis'
import { Query } from '~/api/firestore'

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

      try {
        // まとめて削除
        await Promise.allSettled(
          deleteImgIds.map((id) => {
            return db.deleteDoc(path, id)
          })
        )

        // TODO: トーストとかにしたい
        alert('Remove successfully')
        // TODO: firestoreを監視したい
        this.imgList = await this.getImgList()
      } catch (e) {
        // TODO: トーストとかにしたい
        alert('Some error occured')
        console.error(e)
      }
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
