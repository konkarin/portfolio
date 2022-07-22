<template>
  <section class="imgContainer">
    <ImgColumn
      v-for="(column, index) in imgColumns"
      :key="index"
      :column="column"
      :style="`width: calc(100vw/${columnsLength})`"
    />
  </section>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import debounce from 'lodash.debounce'
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
    imgColumns(): DocumentData[][] {
      return this.createImgColumns(this.imgList, this.columnsLength)
    },
    handleResize() {
      return debounce(() => {
        this.updateColumnsLength()
      }, 300)
    },
  },
  mounted() {
    this.updateColumnsLength()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    updateColumnsLength() {
      // スマホサイズは2カラム固定
      const columnsLength =
        window.innerWidth <= 520 ? 2 : Math.floor(window.innerWidth / 260)

      // 最大4カラムまで
      this.columnsLength = columnsLength > 4 ? 4 : columnsLength
    },
    // handleResize() {
    //   return debounce(() => {
    //     this.updateColumnsLength()
    //   }, 300)
    // },
    createImgColumns(imgList: DocumentData[], columnsLength: number) {
      // [column[], column[], ...]の配列
      // NOTE: .mapがないと、push時にfillの引数の[]が参照され、同じ配列が生成される
      const columns: DocumentData[][] = new Array(columnsLength)
        .fill([])
        .map((_i) => [])

      const columnsHeightList: number[] = Array(columnsLength).fill(0)

      // 全体ループ
      imgList.forEach((img) => {
        // カラムの高さが最も小さいindexを取得
        const minHeightIndex: number =
          this.findMinHeightIndex(columnsHeightList)

        // カラムの高さが最も小さいindexの配列に画像を追加
        columns[minHeightIndex].push(img)
        // カラムの高さを更新
        columnsHeightList[minHeightIndex] += img.height / img.width
      })

      return columns
    },

    findMinHeightIndex(columnsHeightList: number[]): number {
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
  },
})
</script>

<style lang="scss" scoped>
.imgContainer {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}
</style>
