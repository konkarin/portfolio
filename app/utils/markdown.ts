import type { Root as HastRoot, ElementContent } from 'hast'
import type { Root as MdastRoot, Heading as MdastHeading } from 'mdast'
import { toString } from 'mdast-util-to-string'
import highlight from 'rehype-highlight'
import rehypeParse from 'rehype-parse'
import rehypeRemark from 'rehype-remark'
import stringify from 'rehype-stringify'
import breaks from 'remark-breaks'
import gfm from 'remark-gfm'
import parse from 'remark-parse'
import rehype from 'remark-rehype'
import remarkStringify from 'remark-stringify'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'

interface Heading {
  text: string
  id: string
  level: number
}

const generateSlug = (text: string): string => {
  return text.toLowerCase().trim().replace(/\s+/g, '-')
}

const rehypeAddHeadingIds = () => {
  return (tree: HastRoot) => {
    visit(tree, 'element', (element) => {
      if (/^h[1-6]$/.test(element.tagName)) {
        const getHeaderText = (node: ElementContent): string => {
          if (node.type === 'text') {
            return node.value
          }
          if (node.type === 'element') {
            return node.children.map(getHeaderText).join('')
          }
          return ''
        }

        const text = element.children.map(getHeaderText).join('')
        element.properties = {
          ...element.properties,
          id: generateSlug(text),
        }
      }
    })
  }
}

export const convertMarkdownTextToHTML = async (markdownText: string) => {
  const hast = await unified()
    .use(parse)
    .use(gfm)
    .use(breaks)
    .use(rehype)
    .use(rehypeAddHeadingIds)
    .use(stringify)
    .use(highlight)
    .process(markdownText)
    .catch((e) => {
      console.error(e)
      return markdownText
    })

  return hast.toString()
}

export const getHeadings = (markdownText: string): Heading[] => {
  const tree = unified().use(parse).use(gfm).parse(markdownText) as MdastRoot
  const headings: Heading[] = []

  visit(tree, 'heading', (node: MdastHeading) => {
    const text = toString(node)
    headings.push({
      text,
      id: generateSlug(text),
      level: node.depth,
    })
  })

  return headings
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
