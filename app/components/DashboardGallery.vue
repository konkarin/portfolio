<template>
  <section class="dashboard__content">
    <h3>Gallery Edit</h3>
    <div class="dashboardEdit__head">
      <ImgUploader />
      <div class="dashboardEdit__controler">
        <button class="btn" @click="saveImgList()">Save</button>
        <button
          class="btn btn--danger"
          @click="deleteImgList()"
          :disabled="selectedImgPathList.length === 0"
        >
          Delete
        </button>
      </div>
    </div>
    <div class="dashboardEdit__gallery">
      <div v-if="imgList.length === 0">No Photos</div>
      <div
        v-for="(img, index) in imgList"
        :key="img.originalUrl"
        class="photoBox"
        draggable="true"
        @dragover.prevent
        @dragenter="dragEnter($event)"
        @dragleave="dragLeave($event)"
        @dragstart="dragStart(index)"
        @drop="drop($event, index)"
      >
        <label class="photoBox__select">
          <input
            :id="`${index}`"
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
import type { DocumentData } from '@firebase/firestore'
import type { User } from '@firebase/auth'

import { db } from '~/api/apis'
import type { Query } from '~/api/firestore'

interface Data {
  imgList: DocumentData[]
  selectedImgPathList: string[]
  draggingIndex: number
}

export default defineComponent({
  data(): Data {
    return {
      imgList: [],
      selectedImgPathList: [],
      draggingIndex: -1,
    }
  },
  computed: {
    user(): User | null {
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
      const path = `users/${this.user?.uid}/images`

      try {
        return await db.getOrderDocs(path, 'order')
      } catch (e) {
        console.error(e)
        return []
      }
    },

    dragStart(index: number) {
      this.draggingIndex = index
    },
    dragEnter(e: Event) {
      ;(e.target as HTMLElement).classList.add('-dragenter')
    },
    dragLeave(e: Event) {
      ;(e.target as HTMLElement).classList.remove('-dragenter')
    },
    drop(e: Event, index: number) {
      if (this.draggingIndex === -1) return
      ;(e.target as HTMLElement).classList.remove('-dragenter')

      const draggingImg = this.imgList[this.draggingIndex]
      this.imgList.splice(this.draggingIndex, 1)
      this.imgList.splice(index, 0, draggingImg)
      this.draggingIndex = -1
    },

    async saveImgList() {
      const idList = this.imgList.map((img) => img.id as string)
      const path = `users/${this.user?.uid}/images`
      try {
        await Promise.all(
          idList.map((id, index) => {
            return db.updateData(path, id, { order: index })
          })
        )
        alert('Update successfully')
      } catch (e) {
        console.error(e)
        alert('Some error occured')
      }
    },

    // 選択した画像のFirestoreドキュメントを削除する
    async deleteImgList(): Promise<void> {
      // 画像が選択されてない場合アラートを表示
      if (this.selectedImgPathList.length === 0) {
        alert('Please select images')
        return
      }

      const path = `users/${this.user?.uid}/images`

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
.dashboardEdit__controler {
  display: flex;
  gap: 8px;
}

.dashboardEdit__gallery {
  display: grid;
  grid-template-columns: repeat(4, minmax(100px, 1fr));
  grid-auto-rows: 200px;
  gap: 10px;
}

.photoBox {
  box-sizing: border-box;
}

.photoBox__thumbnail {
  width: 100%;
  height: 100%;
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
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  &.-dragenter {
    opacity: 0.7;
  }
}
</style>
