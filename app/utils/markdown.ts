import { unified } from 'unified'
import parse from 'remark-parse'
import gfm from 'remark-gfm'
import highlight from 'rehype-highlight'
import rehype from 'remark-rehype'
import stringify from 'rehype-stringify'
import breaks from 'remark-breaks'
import rehypeParse from 'rehype-parse'
import rehypeRemark from 'rehype-remark'
import remarkStringify from 'remark-stringify'

export const convertMarkdownTextToHTML = async (markdownText: string) => {
  const hast = await unified()
    .use(parse)
    .use(gfm)
    .use(breaks)
    .use(rehype)
    .use(stringify)
    .use(highlight)
    .process(markdownText)
    .catch((e) => {
      console.error(e)
      return markdownText
    })

  return hast.toString()
}

export const convertHTMLTextToMarkdown = async (htmlText: string) => {
  const mdast = await unified()
    .use(rehypeParse)
    .use(rehypeRemark)
    .use(gfm)
    .use(remarkStringify)
    .process(htmlText)
    .catch((e) => {
      console.error(e)
      return htmlText
    })

  return mdast.toString()
}
