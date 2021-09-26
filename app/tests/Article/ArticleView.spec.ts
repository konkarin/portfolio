import ArticleView from '@/components/Article/ArticleView.vue'
import { RouterLinkStub, shallowMount } from '@vue/test-utils'

const article = {
  createdDate: 1615393188099,
  id: 'e2d0ebba-670e-4c13-a793-05373f64a8e0',
  isPublished: true,
  tags: ['test'],
  text: 'test text',
  title: 'test title',
  updatedDate: 1616986800000,
  releaseDate: 1616900400000,
}

const htmlText = 'markdown test'

const $route = {
  path: '/articles',
  params: {
    article: article.id,
  },
}

const wrapper = shallowMount(ArticleView, {
  propsData: {
    article,
    htmlText,
  },
  mocks: {
    $route,
  },
  stubs: {
    NuxtLink: RouterLinkStub,
  },
})

describe('ArticleView', () => {
  test('render article title', () => {
    expect(wrapper.find(`h1`).text()).toBe(article.title)
  })

  test('computed correct date format', () => {
    // 日付のチェック
    const ISO8061Regex = /^\d{4}-\d{2}-\d{2}/
    expect(ISO8061Regex.test((wrapper.vm as any).releaseDate)).toBe(true)
  })

  test('render article tags links', () => {
    const wrappers = wrapper.findAll(`[data-test="articleTag"]`).wrappers

    wrappers.forEach((tag, index) => {
      expect(tag.findComponent(RouterLinkStub).props().to).toBe(
        `/tags/${article.tags[index]}`
      )
    })
  })

  test('computed correct twitter share url', () => {
    const text = encodeURIComponent(article.title)

    expect((wrapper.vm as any).twitterShareUrl).toContain(text)
    expect((wrapper.vm as any).twitterShareUrl).toContain(
      'konkarin-photo.web.app/'
    )
  })

  test('exists twitter share url', () => {
    const text = encodeURIComponent(article.title)

    expect(
      wrapper.find('[data-test="twitterShare"]').attributes().href
    ).toContain(text)
  })
})
