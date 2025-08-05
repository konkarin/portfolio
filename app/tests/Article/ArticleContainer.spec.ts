import { shallowMount } from '@vue/test-utils'

import ArticleContainer from '@/components/Article/ArticleContainer.vue'
import type { Article } from '@/types/index'

const articles: Article[] = [...Array(4).keys()].map((_, index) => {
  return {
    createdDate: 1616932800000,
    id: String(index),
    isPublished: true,
    tags: ['test'],
    text: 'test text',
    title: 'test title',
    updatedDate: 1617019200000,
    ogpImageUrl: '',
  }
})

const articleTags = ['test']

const wrapper = shallowMount(ArticleContainer, {
  global: {
    plugins: [],
  },
  stubs: {
    NuxtPage: { template: '<div></div>' },
  },
})

vi.mock('#app', () => ({
  useNuxtApp: () => ({
    $tags: ref(articleTags),
    $articles: ref(articles),
  }),
}))

describe('ArtcileContainer', () => {
  test('computed correct articles', () => {
    expect(wrapper.vm.allArticles).toMatchObject(articles)
  })

  test('computed correct recentArticles', () => {
    expect(wrapper.vm.recentArticles.length).toBe(2)
  })

  test('computed correct articleTags', () => {
    expect(wrapper.vm.articleTags).toMatchObject(articleTags)
  })
})
