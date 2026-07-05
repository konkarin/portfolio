import { mount } from '@vue/test-utils'

import TagCombobox from '@/components/Article/TagCombobox.vue'

describe('components/Article/TagCombobox', () => {
  test('選択済みタグがチップとして表示される', () => {
    const wrapper = mount(TagCombobox, {
      props: { modelValue: ['Vue', 'Nuxt'], suggestions: [] },
    })
    const chips = wrapper.findAll('.tagCombobox__chip')
    expect(chips).toHaveLength(2)
    expect(chips[0].text()).toContain('Vue')
    expect(chips[1].text()).toContain('Nuxt')
  })

  test('フォーカスすると未選択の既存タグが候補表示される', async () => {
    const wrapper = mount(TagCombobox, {
      props: { modelValue: ['Vue'], suggestions: ['Vue', 'Nuxt', 'Firebase'] },
    })
    await wrapper.find('input').trigger('focus')
    const options = wrapper.findAll('[role="option"]').map((o) => o.text())
    // 選択済みのVueは候補から除外される
    expect(options).toEqual(['Nuxt', 'Firebase'])
  })

  test('入力文字で既存タグを絞り込める（大文字小文字は区別しない）', async () => {
    const wrapper = mount(TagCombobox, {
      props: { modelValue: [], suggestions: ['Vue', 'Nuxt', 'Firebase'] },
    })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.setValue('fire')
    const options = wrapper.findAll('[role="option"]').map((o) => o.text())
    // 部分一致するFirebaseだけが既存候補として残る（VueとNuxtは除外）
    expect(options).toContain('Firebase')
    expect(options).not.toContain('Vue')
    expect(options).not.toContain('Nuxt')
  })

  test('候補をクリックすると選択され update:modelValue が emit される', async () => {
    const wrapper = mount(TagCombobox, {
      props: { modelValue: [], suggestions: ['Vue', 'Nuxt'] },
    })
    await wrapper.find('input').trigger('focus')
    await wrapper.findAll('[role="option"]')[1].trigger('mousedown')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['Nuxt']])
  })

  test('候補に無い任意のタグをEnterで追加できる', async () => {
    const wrapper = mount(TagCombobox, {
      props: { modelValue: [], suggestions: ['Vue'] },
    })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.setValue('自作タグ')
    // 新規追加用の選択肢が表示される
    const options = wrapper.findAll('[role="option"]').map((o) => o.text())
    expect(options).toContain('「自作タグ」を追加')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['自作タグ']])
  })

  test('コンマでもタグを確定できる', async () => {
    const wrapper = mount(TagCombobox, {
      props: { modelValue: [], suggestions: [] },
    })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.setValue('タグA')
    await input.trigger('keydown', { key: ',' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['タグA']])
  })

  test('前後の空白はトリムして追加される', async () => {
    const wrapper = mount(TagCombobox, {
      props: { modelValue: [], suggestions: [] },
    })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.setValue('  余白  ')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['余白']])
  })

  test('チップの×ボタンで選択済みタグを削除できる', async () => {
    const wrapper = mount(TagCombobox, {
      props: { modelValue: ['Vue', 'Nuxt'], suggestions: [] },
    })
    await wrapper.find('.tagCombobox__chipRemove').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['Nuxt']])
  })

  test('入力が空のときBackspaceで末尾のタグを削除できる', async () => {
    const wrapper = mount(TagCombobox, {
      props: { modelValue: ['Vue', 'Nuxt'], suggestions: [] },
    })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.trigger('keydown', { key: 'Backspace' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['Vue']])
  })

  test('重複するタグは追加されない', async () => {
    const wrapper = mount(TagCombobox, {
      props: { modelValue: ['Vue'], suggestions: ['Vue'] },
    })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.setValue('Vue')
    // 既に選択済みなので新規追加の選択肢も候補も出ない
    expect(wrapper.findAll('[role="option"]')).toHaveLength(0)
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  test('↑↓キーで候補を選択しEnterで確定できる', async () => {
    const wrapper = mount(TagCombobox, {
      props: { modelValue: [], suggestions: ['Vue', 'Nuxt', 'Firebase'] },
    })
    const input = wrapper.find('input')
    await input.trigger('focus')
    // 1つ目→2つ目へ移動
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['Nuxt']])
  })
})
