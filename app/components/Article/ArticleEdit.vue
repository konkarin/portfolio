<template>
  <section class="articleEdit">
    <div class="articleEdit__header">
      <div>
        <NuxtLink to="/dashboard/articles" aria-label="記事一覧へ" class="articleEdit__back">
          ←
        </NuxtLink>
      </div>
      <div class="articleEdit__headerRight">
        <ToggleBtn :value="article.isPublished" @toggle="updatePublishing">公開する</ToggleBtn>
        <BaseButton
          :disabled="article.title === '' || tag === '' || !isValidCustomId"
          @click="updateArticle"
        >
          保存
        </BaseButton>
      </div>
    </div>
    <textarea
      v-model="article.title"
      placeholder="Title"
      class="articleEdit__title dashboardEdit__title"
      maxlength="64"
    />
    <div class="dashboardEdit__head">
      <div class="dashboardEdit__headContainer">
        <label class="dashboardEdit__tagContainer">
          <b>Tags</b>
          <input
            v-model="tag"
            class="dashboardEdit__input"
            type="text"
            placeholder="コンマ区切りで入力"
          />
        </label>
        <div>
          <label class="dashboardEdit__tagContainer">
            <b>CustomID</b>
            <input
              v-model="customId"
              class="dashboardEdit__input"
              type="text"
              placeholder="CustomIDを入力"
              @input="validateCustomId(($event.target as HTMLInputElement).value)"
            />
          </label>
          <div v-if="!isValidCustomId">
            <div class="dashboardEdit__error">利用できないCustomIDだよ</div>
          </div>
        </div>
        <div class="dashboardEdit__ogpContainer">
          <label class="dashboardEdit__ogpInput">
            <b>OGP画像</b>
            <input
              v-model="ogpImageUrl"
              class="dashboardEdit__input"
              type="text"
              placeholder="OGP画像のURLを入力、または画像を貼り付け"
              @paste="onPasteOgp"
              @drop.prevent="onDropOgp"
            />
          </label>
          <div class="dashboardEdit__ogpPreview">
            <img :src="ogpImageUrl" class="dashboardEdit__ogpPreviewImg" />
          </div>
        </div>
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
import { useAuthInject } from '@/composables/useAuth'

const { user, isAuth } = useAuthInject()
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
  const uid = user.value?.uid
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
const { showToast } = useToast()
const updateArticle = async () => {
  if (article.value.title.length === 0) {
    showToast({
      title: 'Titleは必須です。',
      type: 'error',
    })
    return
  }

  if (!isValidCustomId.value) {
    showToast({
      title: '利用できないCustomIDです',
      type: 'error',
    })
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
    showToast({
      title: 'Failed to update articles.',
      type: 'error',
    })
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
      showToast({
        title: 'Failed to update tags',
        type: 'error',
      })
      return
    }
  }

  showToast({
    title: 'Completed',
    type: 'success',
  })
}

const { uploadImage } = useImageUpload()

const createOgpPath = () => `users/${user.value?.uid}/ogps/${v4()}`

const onPasteOgp = async () => {
  if (user.value == null) return

  const blob = await loadClipboardImage()
  if (!blob) return

  const file = new File(
    [await resizeImage(blob, { targetWidth: 1200, targetHeight: 630, mode: 'cover' })],
    'image.webp',
    { type: 'image/png' },
  )

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

  const resizedFile = new File(
    [await resizeImage(file, { targetWidth: 1200, targetHeight: 630, mode: 'cover' })],
    'image.webp',
  )

  const url = await uploadImage(resizedFile, createOgpPath())
  if (url) {
    ogpImageUrl.value = ''
    ogpImageUrl.value = url
  }
}

onMounted(async () => {
  if (!isAuth.value) {
    useRouter().push({ path: '/dashboard/articles' })
    return
  }

  try {
    await showArticle()
  } catch (e) {
    console.error(e)
    showToast({
      title: 'Failed to get articles.\nPlease retry.',
      type: 'error',
    })
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

.articleEdit {
  padding-bottom: 5rem;

  &__title {
    width: 100%;
    height: 2.5rem;
    border: 0;
    padding: 0;
    outline: 0;
    resize: none;
    font-size: 1.5rem;
    font-weight: bold;
    line-height: 1.6;
    background-color: #fbfcff;
  }
}

.dashboardEdit__ogpContainer {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dashboardEdit__headContainer {
  display: grid;
  gap: 8px;
  flex-grow: 1;
}

.dashboardEdit__tagContainer {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dashboardEdit__ogpInput {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-grow: 1;
}

.dashboardEdit__ogpPreview {
  max-height: 100px;
}

.dashboardEdit__ogpPreviewImg {
  max-height: 100px;
}

.articleEdit__header {
  display: flex;
  justify-content: space-between;
}

.articleEdit__headerRight {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.articleEdit__back {
  padding: 8px;
  display: flex;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 100px;
  &:hover {
    background-color: var(--brightGray);
  }
}

.dashboardEdit__input {
  outline: 0;
  border-radius: 4px;
  border: 1px solid #cbcbcb;
  background-color: #fbfcff;
  flex-grow: 1;
  padding: 8px 12px;
  height: 40px;
  box-sizing: border-box;
}
</style>
