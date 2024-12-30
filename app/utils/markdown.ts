import { unified } from 'unified'
import parse from 'remark-parse'
import gfm from 'remark-gfm'
import highlight from 'rehype-highlight'
import rehype from 'remark-rehype'
import stringify from 'rehype-stringify'
import breaks from 'remark-breaks'

export const convertMarkdownTextToHTML = async (text: string) => {
  const hast = await unified()
    .use(parse)
    .use(gfm)
    .use(breaks)
    .use(rehype)
    .use(stringify)
    .use(highlight)
    .process(text)
    .catch((e) => {
      console.error(e)
      return text
    })

  return hast.toString()
}
