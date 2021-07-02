import ArticleContainer from '@/components/Article/ArticleContainer.vue'
import { Article } from '@/types/index'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'

const articles: Article[] = [...Array(4).keys()].map((_, index) => {
  return {
    createdDate: 1615393188099,
    id: String(index),
    isPublished: true,
    tags: ['test'],
    text: 'test text',
    title: 'test title',
    updatedDate: 1616861647099,
  }
})

const articleTags = ['test']

const localVue = createLocalVue()
localVue.use(Vuex)

const store = new Vuex.Store({
  state: {
    articles,
    articleTags,
  },
})

const wrapper = shallowMount(ArticleContainer, {
  store,
  localVue,
  stubs: {
    NuxtChild: { template: '<div></div>' },
  },
})

describe('ArtcileContainer', () => {
  test('computed correct articles', () => {
    expect((wrapper.vm as any).articles).toMatchObject(articles)
  })

  test('computed correct recentArticles', () => {
    expect((wrapper.vm as any).recentArticles.length).toBe(3)
  })

  test('computed correct articleTags', () => {
    expect((wrapper.vm as any).articleTags).toMatchObject(articleTags)
  })
})
