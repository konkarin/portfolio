import ArticleView from '@/components/Article/ArticleView.vue'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import VueRouter from 'vue-router'

const article = {
  createdDate: 1615393188099,
  id: 'e2d0ebba-670e-4c13-a793-05373f64a8e0',
  isPublished: true,
  tags: ['test'],
  text: 'test text',
  title: 'test title',
  updatedDate: 1616861647099,
}

const markdownText = 'markdown test'

const localVue = createLocalVue()
localVue.use(VueRouter)
const router = new VueRouter()

const $route = {
  params: {
    article: article.id,
  },
}

const wrapper = shallowMount(ArticleView, {
  propsData: {
    article,
    markdownText,
  },
  mocks: {
    $route,
  },
  localVue,
  router,
})

describe('ArticleView', () => {
  test('render article title', () => {
    expect(wrapper.find(`h1`).text()).toBe(article.title)
  })
})
