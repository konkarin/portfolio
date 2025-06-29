<template>
  <section class="dashboard__content">
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

<script setup lang="ts">
import type { DocumentData } from '@firebase/firestore'
import type { User } from '@firebase/auth'

import { db } from '~/api/apis'
import type { Query } from '~/api/firestore'
import { useAuthInject } from '@/composables/useAuth'

const { user } = useAuthInject()
const getImgList = async (): Promise<DocumentData[]> => {
  const path = `users/${user.value?.uid}/images`

  try {
    return await db.getOrderDocs(path, 'order')
  } catch (e) {
    console.error(e)
    return []
  }
}
const imgList = ref<DocumentData[]>([])
watch(user, async (user) => {
  if (user != null) imgList.value = await getImgList()
})
onMounted(async () => {
  if (user.value) imgList.value = await getImgList()
})

const draggingIndex = ref(-1)
const dragStart = (index: number) => {
  draggingIndex.value = index
}
const dragEnter = (e: Event) => {
  ;(e.target as HTMLElement).classList.add('-dragenter')
}
const dragLeave = (e: Event) => {
  ;(e.target as HTMLElement).classList.remove('-dragenter')
}
const drop = (e: Event, index: number) => {
  const draggingImg = imgList.value[draggingIndex.value]
  if (draggingIndex.value === -1 || !draggingImg) return
  ;(e.target as HTMLElement).classList.remove('-dragenter')
  imgList.value.splice(draggingIndex.value, 1)
  imgList.value.splice(index, 0, draggingImg)
  draggingIndex.value = -1
}

const saveImgList = async () => {
  const idList = imgList.value.map((img) => img.id as string)
  const path = `users/${user.value?.uid}/images`
  try {
    await Promise.all(
      idList.map((id, index) => {
        return db.updateData(path, id, { order: index })
      }),
    )
    showToast({
      title: 'Update successfully',
      type: 'success',
    })
  } catch (e) {
    console.error(e)
    showToast({
      title: 'Some error occured',
      type: 'error',
    })
  }
}

const selectedImgPathList = ref<string[]>([])
const { showToast } = useToast()
const deleteImgList = async (): Promise<void> => {
  // 画像が選択されてない場合アラートを表示
  if (selectedImgPathList.value.length === 0) {
    showToast({
      title: 'Please select images',
      type: 'error',
    })
    return
  }

  const path = `users/${user.value?.uid}/images`

  // 選択した画像のdocumentを取得
  const result = await Promise.all(
    selectedImgPathList.value.map((imgPath) => {
      const query: Query = {
        fieldPath: 'originalFilePath',
        filterStr: '==',
        value: imgPath,
      }

      return db.getDocIds(path, [query])
    }),
  )

  const deleteImgIds = result.flatMap((ids) => {
    return ids
  })

  try {
    // まとめて削除
    await Promise.allSettled(
      deleteImgIds.map((id) => {
        return db.deleteDoc(path, id)
      }),
    )

    showToast({
      title: 'Remove successfully',
      type: 'success',
    })
    // TODO: firestoreを監視したい
    imgList.value = await getImgList()
  } catch (e) {
    showToast({
      title: 'Some error occured',
      type: 'error',
    })
    console.error(e)
  }
}
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
