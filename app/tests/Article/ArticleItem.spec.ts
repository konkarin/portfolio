import { mount, RouterLinkStub } from '@vue/test-utils'
import ArticleItem from '@/components/Article/ArticleItem.vue'

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

const wrapper = mount(ArticleItem, {
  propsData: {
    article,
  },
  stubs: {
    NuxtLink: RouterLinkStub,
  },
})

describe('ArticleItem', () => {
  test('render article links', () => {
    expect(wrapper.findComponent(RouterLinkStub).props().to).toContain(
      article.id
    )
  })

  test('render releaseDate', () => {
    expect(wrapper.find(`[data-test="releaseDate"]`).text()).toBe('2021-03-28')
  })

  test('render article title', () => {
    expect(wrapper.find(`[data-test="articleTitle"]`).text()).toBe(
      article.title
    )
  })

  test('render article tags', () => {
    wrapper
      .findAll(`[data-test="articleTag"]`)
      .wrappers.forEach((tag, index) => {
        expect(tag.text()).toBe(article.tags[index])
      })
  })
})
