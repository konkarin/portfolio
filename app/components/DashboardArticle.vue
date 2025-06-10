<template>
  <div class="articleItem">
    <div class="articleItem__titleContainer">
      <NuxtLink :to="`/dashboard/articles/${article.id}`" class="articleItem__title">
        {{ article.title }}
      </NuxtLink>
      <div class="articleItem__actionContainer">
        <NuxtLink :to="`/dashboard/articles/${article.id}`" class="articleItem__edit edit">
          <Pencil />
          <span class="edit__tooltip">編集</span>
        </NuxtLink>
        <div class="articleItem__edit edit" @click="removeArticle">
          <Trash />
          <span class="edit__tooltip">削除</span>
        </div>
      </div>
    </div>
    <div class="articleItem__footer">{{ relativeTime }}に作成</div>
  </div>
</template>

<script lang="ts">
import Day from '@/utils/day'
import type { Article } from '@/types/index'

export default defineComponent({
  props: {
    article: {
      type: Object as PropType<Article>,
      required: true,
    },
  },
  emits: ['remove'],
  computed: {
    relativeTime(): string {
      return Day.relativeTime(Day.getDate(this.article.createdDate))
    },
  },
  methods: {
    removeArticle() {
      this.$emit('remove')
    },
  },
})
</script>

<style lang="scss" scoped>
.edit {
  position: relative;
  width: 30px;
  height: 30px;
  color: var(--black);
  background-color: var(--brightGray);
  border-radius: 50%;
  transition: 0.2s;

  &:hover {
    cursor: pointer;
    background-color: var(--lightYellow);

    .edit__tooltip {
      opacity: 1;
      visibility: visible;
      transition: 0.3s ease-in 0.2s;
    }
  }
}

.edit__tooltip {
  display: inline-block;
  opacity: 0;
  visibility: hidden;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -32px;
  padding: 5px;
  white-space: nowrap;
  text-align: center;
  font-size: 10.5px;
  line-height: 1.3;
  border-radius: 3px;
  box-shadow: 0 1px 2px rgb(0 0 0 / 30%);
  z-index: 200;
  color: var(--white);
  background-color: var(--black);
  &::before {
    content: '';
    position: absolute;
    top: -13px;
    left: 50%;
    margin-left: -7px;
    border: 7px solid transparent;
    border-bottom: 7px solid var(--black);
  }
}

.articleItem__titleContainer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.articleItem__actionContainer {
  margin-top: 0.5rem;
  display: flex;
}

.articleItem__edit {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 0.5rem;
}

.articleItem__footer {
  display: flex;
}
.articleItem__edit {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 0.5rem;
}

.articleItem__footer {
  display: flex;
}
</style>
