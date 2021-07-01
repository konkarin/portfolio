import merge from 'deepmerge'
import remark from 'remark'
import highlight from 'remark-highlight.js'
import html from 'remark-html'
import recommended from 'remark-preset-lint-recommended'

const json = require('hast-util-sanitize/lib/github.json')
const schema = merge(json, { attributes: { '*': ['className'] } })

export const convertMarkdownTextToHTML = async (text) => {
  const hast = await remark()
    .use(recommended)
    .use(html, { sanitize: schema })
    .use(highlight)
    .process(text)

  return hast.toString()
}
