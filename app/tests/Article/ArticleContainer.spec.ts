import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import ArticleContainer from '@/components/Article/ArticleContainer.vue'
import { Article } from '@/types/index'

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

const store = createStore({
  state: {
    articles,
    articleTags,
  },
})

const wrapper = shallowMount(ArticleContainer, {
  global: {
    plugins: [store],
  },
  stubs: {
    NuxtPage: { template: '<div></div>' },
  },
})

describe('ArtcileContainer', () => {
  test('computed correct articles', () => {
    expect(wrapper.vm.allArticles).toMatchObject(articles)
  })

  test('computed correct recentArticles', () => {
    expect(wrapper.vm.recentArticles.length).toBe(3)
  })

  test('computed correct articleTags', () => {
    expect(wrapper.vm.articleTags).toMatchObject(articleTags)
  })
})
