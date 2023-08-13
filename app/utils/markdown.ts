import merge from 'deepmerge'
import remark from 'remark'
import html from 'remark-html'

// @ts-expect-error
import recommended from 'remark-preset-lint-recommended'
// @ts-expect-error
import highlight from 'remark-highlight.js'
import json from 'hast-util-sanitize/lib/github.json'

const schema = merge(json, { attributes: { '*': ['className'] } })

export const convertMarkdownTextToHTML = async (text: string) => {
  const hast = await remark()
    .use(recommended)
    // @ts-expect-error
    .use(html, { sanitize: schema })
    .use(highlight)
    .process(text)

  return hast.toString()
}
