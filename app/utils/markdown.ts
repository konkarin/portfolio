import remark from 'remark'
import recommended from 'remark-preset-lint-recommended'
import html from 'remark-html'

export const convertTextToMarkdown = async (text) => {
  const markdown = await remark()
    .use(recommended)
    .use(html, { sanitize: true })
    .process(text)

  return markdown.toString()
}
