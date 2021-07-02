import ArticleItem from '@/components/Article/ArticleItem.vue'
import { mount, RouterLinkStub } from '@vue/test-utils'

const article = {
  createdDate: 1615393188099,
  id: 'e2d0ebba-670e-4c13-a793-05373f64a8e0',
  isPublished: true,
  tags: ['test'],
  text: 'test text',
  title: 'test title',
  updatedDate: 1616861647099,
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

  test('computed correct date format', () => {
    // 日付のチェック
    const ISO8061Regex = /^\d{4}-\d{2}-\d{2}/
    expect(ISO8061Regex.test((wrapper.vm as any).articleDate)).toBe(true)
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
