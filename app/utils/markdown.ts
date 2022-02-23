import merge from 'deepmerge'
import remark from 'remark'
import html from 'remark-html'

const recommended = require('remark-preset-lint-recommended')
const highlight = require('remark-highlight.js')

const json = require('hast-util-sanitize/lib/github.json')
const schema = merge(json, { attributes: { '*': ['className'] } })

export const convertMarkdownTextToHTML = async (text: string) => {
  const hast = await remark()
    .use(recommended)
    .use(html, { sanitize: schema })
    .use(highlight)
    .process(text)

  return hast.toString()
}
