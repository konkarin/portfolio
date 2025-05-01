<template>
  <section class="articleEdit">
    <!-- TODO: 戻るボタンほしい -->
    <textarea
      v-model="article.title"
      placeholder="Title"
      class="articleEdit__title dashboardEdit__title"
      maxlength="64"
    />
    <div class="dashboardEdit__head">
      <div class="dashboardEdit__headContainer">
        <div class="dashboardEdit__tagContainer">
          <b>Tags:</b>
          <input
            v-model="tag"
            class="dashboardEdit__input"
            type="text"
            placeholder="コンマ区切りで入力"
          />
        </div>
        <div class="dashboardEdit__tagContainer">
          <b>CustomID:</b>
          <input
            v-model="customId"
            class="dashboardEdit__input"
            type="text"
            placeholder="CustomIDを入力"
            @input="validateCustomId(($event.target as HTMLInputElement).value)"
          />
          <div v-if="!isValidCustomId">
            <div class="dashboardEdit__error">利用できないCustomIDだよ</div>
          </div>
        </div>
        <div class="dashboardEdit__ogpContainer">
          <div class="dashboardEdit__ogpInput">
            <b>OGP画像</b>
            <input
              v-model="ogpImageUrl"
              class="dashboardEdit__input"
              type="text"
              placeholder="OGP画像のURLを入力"
              @paste="onPasteOgp"
              @drop.prevent="onDropOgp"
            />
          </div>
          <div class="dashboardEdit__ogpPreview">
            <img :src="ogpImageUrl" class="dashboardEdit__ogpPreviewImg" />
          </div>
        </div>
      </div>

      <div class="dashboardEdit__btnWrapper">
        <ToggleBtn
          class="dashboardEdit__btn"
          :toggle-btn="article.isPublished"
          @toggle="updatePublishing"
        >
          公開する
        </ToggleBtn>
        <button
          class="dashboardEdit__btn btn"
          :disabled="article.title === '' || tag === '' || !isValidCustomId"
          @click="updateArticle"
        >
          保存
        </button>
      </div>
    </div>
    <MarkdownEditor :plain-text="plainText" @input="setText" @save="updateArticle" />
  </section>
</template>

<script setup lang="ts">
import { db } from '@/api/apis'
import type { Article } from '@/types/index'
import Day from '~/utils/day'
import { getArticleTags } from '~/utils/article'
import { v4 } from 'uuid'

const { $accessor } = useNuxtApp()
const article = ref<Article>({
  id: useRoute().params.article as string,
  title: '',
  text: '',
  isPublished: false,
  updatedDate: 0,
  createdDate: Day.getUnixMS(),
  releaseDate: 0,
  tags: [],
  ogpImageUrl: '',
})
const tag = ref('')
const customId = ref('')
const ogpImageUrl = ref('')
const availableCustomIds = ref<string[]>([])
const isValidCustomId = ref(true)
const user = computed(() => {
  return $accessor.user
})
const articleTitle = computed((): string => {
  return article.value.title
})
const plainText = computed((): string => {
  return article.value.text
})
const updatePublishing = () => {
  article.value.isPublished = !article.value.isPublished
}
const setText = (val: string) => {
  article.value.text = val
}
const validateCustomId = (id: string) => {
  // 利用可能な文字は半角英数とハイフンアンダーバーのみ
  const reg = /^[a-zA-Z0-9-_]*$/
  isValidCustomId.value = !availableCustomIds.value.includes(id) && reg.test(id)
}
const getArticle = async () => {
  const uid = $accessor.user?.uid
  if (uid == null) return

  const collectionPath = `users/${uid}/articles`

  const a = (await db.getDocById(collectionPath, article.value.id)) as Article

  return a
}
const showArticle = async (): Promise<void> => {
  const a = await getArticle()

  if (a == null) return
  article.value = a
}
const updateArticle = async () => {
  if (article.value.title.length === 0) {
    alert('Titleは必須です。')
    return
  }

  if (!isValidCustomId.value) {
    alert('利用できないCustomIDです')
    return
  }

  const articlesPath = `users/${user.value?.uid}/articles`

  article.value.tags = tag.value.replace(/\s+/g, '').split(',')
  article.value.ogpImageUrl = ogpImageUrl.value
  article.value.customId = customId.value

  // 公開日の設定
  if (article.value.isPublished) {
    // 公開日が既にある場合は更新日を更新
    if (article.value.releaseDate) {
      article.value.updatedDate = Day.getUnixMS()
    } else {
      article.value.releaseDate = Day.getUnixMS()
    }
  }

  try {
    await db.addData(articlesPath, article.value.id, article.value)
  } catch {
    alert('Failed to update artilces')
    return
  }

  const articleTags = await getArticleTags(user.value?.uid || '')

  // 書き込み時にDBに存在しないタグがあればDBに追加する
  const notExistsTags = article.value.tags.filter((tag) => !articleTags.includes(tag))

  if (notExistsTags) {
    const articleTagsPath = `users/${user.value?.uid}/articleTags`

    try {
      for (const tag of notExistsTags) {
        await db.addData(articleTagsPath, tag, {})
      }
    } catch {
      alert('Failed to update tags')
      return
    }
  }

  alert('Completed')
}

const { uploadImage } = useImageUpload()

const createOgpPath = () => `users/${user.value?.uid}/ogps/${v4()}`

const onPasteOgp = async () => {
  if (user.value == null) return

  const blob = await loadClipboardImage()
  if (!blob) return

  const file = new File([await resizeImage(blob)], 'image.webp', { type: 'image/png' })

  const url = await uploadImage(file, createOgpPath())
  if (url) {
    ogpImageUrl.value = ''
    ogpImageUrl.value = url
  }
}

const onDropOgp = async (e: DragEvent) => {
  if (user.value == null) return

  const file = e.dataTransfer?.files[0]
  if (!file) return

  const resizedFile = new File([await resizeImage(file)], 'image.webp')

  const url = await uploadImage(resizedFile, createOgpPath())
  if (url) {
    ogpImageUrl.value = ''
    ogpImageUrl.value = url
  }
}

onMounted(async () => {
  if (!$accessor.isAuth) {
    useRouter().push({ path: '/dashboard/articles' })
    return
  }

  try {
    await showArticle()
  } catch (e) {
    console.error(e)
    alert('Failed to get articles.\nPlease retry.')
    return
  }

  tag.value = article.value.tags.join()
  if (article.value.ogpImageUrl !== undefined) {
    ogpImageUrl.value = article.value.ogpImageUrl
  }

  availableCustomIds.value = (await getArticles(useRuntimeConfig().public.AUTHOR_ID)).flatMap(
    (article) => {
      if (article.customId) return [article.id, article.customId]
      else return article.id
    },
  )
  customId.value = article.value.customId || ''
})

useHead({
  title: `Editing ${articleTitle.value}`,
})
</script>

<style lang="scss" scoped>
.dashboardEdit__error {
  color: red;
}
</style>
