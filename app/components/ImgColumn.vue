<template>
  <div>
    <div v-for="img in column" :key="img.originalFilePath">
      <img :src="img.thumbUrl" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { DocumentData } from '@/types/firebase'

export default Vue.extend({
  props: {
    column: {
      type: Array as PropType<DocumentData[]>,
      required: true,
    },
  },
})
</script>
