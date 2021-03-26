// @ts-ignore
import merge from 'deepmerge'
import sanitize from 'hast-util-sanitize'
import 'highlight.js/styles/tomorrow-night.css'
import remark from 'remark'
import highlight from 'remark-highlight.js'
import html from 'remark-html'
import recommended from 'remark-preset-lint-recommended'

const schema = merge(sanitize, { attributes: { '*': ['className'] } })

export const convertTextToMarkdown = async (text) => {
  const markdown = await remark()
    .use(highlight)
    .use(recommended)
    .use(html, { sanitize: schema })
    .process(text)

  return markdown.toString()
}
