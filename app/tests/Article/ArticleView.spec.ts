import { RouterLinkStub, shallowMount } from '@vue/test-utils'

import { runtimePublicConfig } from '../../../config'
import ArticleView from '@/components/Article/ArticleView.vue'

const article = {
  createdDate: 1615393188099,
  id: 'e2d0ebba-670e-4c13-a793-05373f64a8e0',
  isPublished: true,
  tags: ['test'],
  text: 'test text',
  title: 'test title',
  updatedDate: 1617019200000,
  releaseDate: 1616932800000,
}

const htmlText = 'markdown test'

const $route = {
  path: '/articles',
  params: {
    article: article.id,
  },
}

const $config = {
  public: runtimePublicConfig,
}

const wrapper = shallowMount(ArticleView, {
  propsData: {
    article,
    htmlText,
  },
  mocks: {
    $route,
    $config,
  },
  global: {
    stubs: {
      RouterLink: RouterLinkStub,
      NuxtLink: RouterLinkStub,
    },
    mocks: {
      $config: {
        public: { APP_URL: 'konkarin-photo.web.app/' },
      },
    },
  },
})

describe('ArticleView', () => {
  test('render article title', () => {
    expect(wrapper.find(`h1`).text()).toBe(article.title)
  })

  test('computed correct date format', () => {
    // 日付のチェック
    const ISO8061Regex = /^\d{4}-\d{2}-\d{2}/
    expect(ISO8061Regex.test(wrapper.vm.releaseDate)).toBe(true)
  })

  test('render article tags links', () => {
    const wrappers = wrapper.findAll(`[data-test="articleTag"]`)

    wrappers.forEach((tag, index) => {
      expect(tag.findComponent(RouterLinkStub).props().to).toBe(`/tags/${article.tags[index]}`)
    })
  })

  test('computed correct twitter share url', () => {
    const text = encodeURIComponent(article.title)

    expect(wrapper.vm.twitterShareUrl).toContain(text)
    expect(wrapper.vm.twitterShareUrl).toContain('konkarin-photo.web.app/')
  })

  test('exists twitter share url', () => {
    const text = encodeURIComponent(article.title)

    expect(wrapper.find('[data-test="twitterShare"]').attributes().href).toContain(text)
  })
})
