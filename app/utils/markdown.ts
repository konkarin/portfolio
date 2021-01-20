import remark from 'remark'
import recommended from 'remark-preset-lint-recommended'
import html from 'remark-html'

import rehype from 'rehype'
import merge from 'deepmerge'
import gh from 'hast-util-sanitize'
import sanitize from 'rehype-sanitize'

export const convertTextToMarkdown = async (text) => {
  const markdown = await remark().use(recommended).use(html).process(text)

  return sanitizeMarkdown(markdown.toString())
}

const schema = merge(gh, { tagNames: ['math', 'mi'] })

export const sanitizeMarkdown = async (markdown) => {
  const sanitizedMarkdown = await rehype()
    .data('settings', { fragment: true })
    .use(sanitize, schema)
    .process(markdown)
  console.log(sanitizedMarkdown)

  return sanitizedMarkdown.toString()
}
