<template>
  <div>
    <ImgColumn
      v-for="(column, index) in imgColumns"
      :key="index"
      :column="column"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { DocumentData } from '@/types/firebase'

export default Vue.extend({
  props: {
    imgList: {
      type: Array as PropType<DocumentData[]>,
      required: true,
    },
  },
  data() {
    return {
      columnsLength: 3,
    }
  },
  computed: {
    imgColumns() {
      const columns = this.createImgColumns(this.imgList, this.columnsLength)
      return columns
    },
  },
  methods: {
    createImgColumns(imgList: DocumentData[], columnsLength: number) {
      // [imgList[], imgList[], ...]の配列
      const columns: DocumentData[][] = Array(columnsLength).fill([])
      const columnsHeightList: number[] = Array(columnsLength).fill(0)

      // 全体ループ
      imgList.forEach((img) => {
        // カラムの高さが最も小さいindexを取得
        const minHeightIndex = this.findMinHeightIndex(columnsHeightList)

        // カラムの高さが最も小さいindexの配列に画像を追加
        columns[minHeightIndex].push(img)
        // カラムの高さを更新
        columnsHeightList[minHeightIndex] += img.height
      })

      return columns
    },

    findMinHeightIndex(columnsHeightList: number[]) {
      let minHeight = 100000
      let minIndex = 0

      columnsHeightList.forEach((height, index) => {
        if (minHeight > height) {
          minHeight = height
          minIndex = index
        }
      })
      return minIndex
    },

    updateColumnsLength() {},

    openModal(url: string) {
      this.$emit('open', url)
    },
  },
})
</script>
