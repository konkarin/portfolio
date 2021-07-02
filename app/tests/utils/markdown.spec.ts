import { convertMarkdownTextToHTML } from '@/utils/markdown'

describe('markdown', () => {
  test('convert markdown to HTML', async () => {
    const header = '# 見出し1\n## 見出し2\n### 見出し3\n'
    const text = 'hello world  \nnew line\n'
    const bulletedList = '- 箇条書き\n - 箇条書き\n'
    const orderList = '1. 順序リスト1\n1. 順序リスト2\n\n'
    const img =
      '![Home image](https://staging-konkarin-photo.web.app/HomeImg.jpg)\n'
    const link = '[github](https://github.com/konkarin/portfolio)\n'
    const code = '```console.log(hoge)```\n'

    const markdown =
      header + text + bulletedList + orderList + img + link + code
    const html = await convertMarkdownTextToHTML(markdown)

    expect(html).toContain('<h1>見出し1</h1>')
    expect(html).toContain('<h2>見出し2</h2>')
    expect(html).toContain('<h3>見出し3</h3>')
    expect(html).toContain(`<p>hello world<br>\nnew line</p>`)
    expect(html).toContain('<ul>\n<li>箇条書き</li>\n<li>箇条書き</li>\n</ul>')
    expect(html).toContain(
      '<ol>\n<li>順序リスト1</li>\n<li>順序リスト2</li>\n</ol>'
    )
    expect(html).toContain(
      '<a href="https://github.com/konkarin/portfolio">github</a>'
    )
    expect(html).toContain(
      '<img src="https://staging-konkarin-photo.web.app/HomeImg.jpg" alt="Home image">'
    )
    expect(html).toContain(`<code>console.log(hoge)</code>`)
  })
})
