<template>
  <div class="imgContainer">
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
      columnsLength: 4,
    }
  },
  computed: {
    imgColumns() {
      return this.createImgColumns(this.imgList, this.columnsLength)
    },
  },
  methods: {
    createImgColumns(imgList: DocumentData[], columnsLength: number) {
      // [column[], column[], ...]の配列
      // NOTE: .mapがないと、push時にfillの引数の[]が参照され、同じ配列が生成される
      const columns: DocumentData[][] = new Array(columnsLength)
        .fill([])
        .map((_i) => [])
      console.log(columns, Array(columnsLength).fill([]))

      const columnsHeightList: number[] = Array(columnsLength).fill(0)

      // 全体ループ
      imgList.forEach((img) => {
        // カラムの高さが最も小さいindexを取得
        const minHeightIndex = this.findMinHeightIndex(columnsHeightList)

        // カラムの高さが最も小さいindexの配列に画像を追加
        columns[minHeightIndex].push(img)

        const heightRate = img.exif.ImageHeight / img.exif.ImageWidth
        // カラムの高さを更新
        columnsHeightList[minHeightIndex] += heightRate
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

<style lang="scss" scoped>
.imgContainer {
  display: flex;
  justify-content: center;
}
</style>
