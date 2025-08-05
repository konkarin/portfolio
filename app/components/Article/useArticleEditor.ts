import { v4 } from 'uuid'

import { db } from '~/api/apis'
import type { Article } from '~/types'

export function useArticleEditor() {
  const { user, isAuth } = useAuthInject()

  const inputTag = ref('')
  const isDirty = ref(false)
  const loading = ref(false)

  const article = ref<Article>({
    id: useRoute().params.article as string,
    title: '',
    text: '',
    isPublished: false,
    updatedDate: 0,
    createdDate: day.getUnixMS(),
    releaseDate: 0,
    tags: [],
    ogpImageUrl: '',
  })
  const updatePublishing = () => {
    isDirty.value ||= true
    article.value.isPublished = !article.value.isPublished
  }
  const getArticle = async () => {
    const uid = user.value?.uid
    if (uid == null)
      return {
        id: useRoute().params.article as string,
        title: '',
        text: '',
        isPublished: false,
        updatedDate: 0,
        createdDate: day.getUnixMS(),
        releaseDate: 0,
        tags: [],
        ogpImageUrl: '',
      }
    const collectionPath = `users/${uid}/articles`

    return (await db.getDocById(collectionPath, article.value.id)) as Article | undefined
  }

  const { customId, isValidCustomId, validateCustomId } = useCustomId()
  const { ogpImageUrl, uploadOgp } = useOgp()
  const { editor } = useMarkdownEditor((text) => {
    if (!loading.value) {
      isDirty.value ||= true
    }
    article.value.text = text
  })
  const { showToast } = useToast()

  onMounted(async () => {
    // TODO: これここでやるべき？
    if (!isAuth.value) {
      useRouter().push({ path: '/dashboard/articles' })
      return
    }

    try {
      loading.value = true
      const _article = await getArticle()
      if (_article == null) {
        return
      }
      _article.text = await convertMarkdownTextToHTML(_article.text)
      article.value = _article
      editor.value?.commands.setContent(article.value.text)
    } catch (e) {
      console.error(e)
      showToast({
        title: 'Failed to get articles.\nPlease retry.',
        type: 'error',
      })
      return
    } finally {
      loading.value = false
    }

    inputTag.value = article.value.tags.join()
    if (article.value.ogpImageUrl !== undefined) {
      ogpImageUrl.value = article.value.ogpImageUrl
    }

    customId.value = article.value.customId || ''
  })

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

    article.value.tags = inputTag.value.replace(/\s+/g, '').split(',')
    article.value.ogpImageUrl = ogpImageUrl.value
    article.value.customId = customId.value

    // 公開日の設定
    if (article.value.isPublished) {
      // 公開日が既にある場合は更新日を更新
      if (article.value.releaseDate) {
        article.value.updatedDate = day.getUnixMS()
      } else {
        article.value.releaseDate = day.getUnixMS()
      }
    }

    const text = await convertHTMLTextToMarkdown(editor.value?.getHTML() || '')

    const request = {
      ...article.value,
      text,
    }

    try {
      loading.value = true
      await db.addData(articlesPath, article.value.id, request)

      isDirty.value = false
    } catch {
      showToast({
        title: 'Failed to update articles.',
        type: 'error',
      })
      return
    } finally {
      loading.value = false
    }

    const articleTags = await getArticleTags(user.value?.uid || '')

    // 書き込み時にDBに存在しないタグがあればDBに追加する
    const notExistsTags = article.value.tags.filter((tag) => !articleTags.includes(tag))

    // TODO: これなんでフロントでやってる？
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

  return {
    isDirty,
    editor,
    article,
    inputTag,
    ogpImageUrl,
    customId,
    isValidCustomId: readonly(isValidCustomId),
    updatePublishing,
    uploadOgp,
    updateArticle,
    validateCustomId,
  }
}

function useOgp() {
  const ogpImageUrl = ref('')

  const { user } = useAuthInject()
  const { uploadImage } = useImageUpload()

  async function uploadOgp(blob: Blob) {
    if (user.value == null) return

    const resizedImage = new File(
      [
        await resizeImage(blob, {
          targetWidth: 1200,
          targetHeight: 630,
          mode: 'cover',
        }),
      ],
      'image.webp',
      {
        type: 'image/png',
      },
    )

    const url = await uploadImage(resizedImage, `users/${user.value?.uid}/ogps/${v4()}`)
    if (url) {
      ogpImageUrl.value = url
    }
  }

  return {
    ogpImageUrl,
    uploadOgp,
  }
}

function useCustomId() {
  const { isAuth } = useAuthInject()

  const customId = ref('')
  const availableCustomIds = ref<string[]>([])
  const isValidCustomId = ref(true)
  const validateCustomId = (id: string) => {
    // 利用可能な文字は半角英数とハイフンアンダーバーのみ
    const reg = /^[a-zA-Z0-9-_]*$/
    isValidCustomId.value = !availableCustomIds.value.includes(id) && reg.test(id)
  }
  onMounted(async () => {
    if (!isAuth.value) {
      return
    }
    availableCustomIds.value = (await getArticles(useRuntimeConfig().public.AUTHOR_ID)).flatMap(
      (article) => {
        if (article.customId) return [article.id, article.customId]
        else return article.id
      },
    )
  })

  return {
    customId,
    isValidCustomId: readonly(isValidCustomId),
    validateCustomId,
  }
}
