import type { Root as HastRoot, Element, ElementContent } from 'hast'
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

import { fetchOgp, type OgpData } from '@/utils/ogp'

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

/**
 * 単独行のリンク(リンクだけの段落)かどうか判定し、対象ならそのa要素を返す。
 * markdownでURLを単独行に書くと `<p><a href="url">url</a></p>` になるため、
 * 「子がa要素1つだけ」かつ「リンク文字列がhrefと一致(=ベタ貼りURL)」のものを対象とする。
 * `[ラベル](url)` のような文言付きリンクはカード化しない。
 */
const getBareLinkAnchor = (paragraph: Element): Element | null => {
  const children = paragraph.children.filter(
    (child) => !(child.type === 'text' && child.value.trim() === ''),
  )
  if (children.length !== 1) return null

  const anchor = children[0]
  if (anchor == null || anchor.type !== 'element' || anchor.tagName !== 'a') return null

  const href = anchor.properties?.href
  if (typeof href !== 'string' || href === '') return null

  const text = anchor.children
    .map((child) => (child.type === 'text' ? child.value : ''))
    .join('')
    .trim()
  if (text !== href) return null

  return anchor
}

/**
 * OGPカードのhast要素を生成する。
 * エディタのNodeViewと見た目を揃えられるよう .ogpCard 系のクラスで構造化する。
 */
const buildOgpCardNode = (href: string, ogp: OgpData): Element => {
  const body: ElementContent[] = [
    {
      type: 'element',
      tagName: 'span',
      properties: { className: ['ogpCard__title'] },
      children: [{ type: 'text', value: ogp.title || href }],
    },
  ]

  if (ogp.description) {
    body.push({
      type: 'element',
      tagName: 'span',
      properties: { className: ['ogpCard__desc'] },
      children: [{ type: 'text', value: ogp.description }],
    })
  }

  let siteLabel = ogp.siteName
  if (!siteLabel) {
    try {
      siteLabel = new URL(href).hostname
    } catch {
      siteLabel = href
    }
  }
  body.push({
    type: 'element',
    tagName: 'span',
    properties: { className: ['ogpCard__site'] },
    children: [{ type: 'text', value: siteLabel }],
  })

  const children: ElementContent[] = [
    {
      type: 'element',
      tagName: 'span',
      properties: { className: ['ogpCard__body'] },
      children: body,
    },
  ]

  if (ogp.image) {
    children.unshift({
      type: 'element',
      tagName: 'span',
      properties: { className: ['ogpCard__thumb'] },
      children: [
        {
          type: 'element',
          tagName: 'img',
          properties: { src: ogp.image, alt: '', loading: 'lazy' },
          children: [],
        },
      ],
    })
  }

  return {
    type: 'element',
    tagName: 'a',
    properties: {
      href,
      className: ['ogpCard'],
      target: '_blank',
      rel: ['noopener', 'noreferrer'],
    },
    children,
  }
}

/**
 * 単独行のリンクをOGPカードに変換するrehypeプラグイン。
 * OGP取得はネットワークI/Oを伴うため、ビルド時(prerender)のみ有効にすること。
 * 取得失敗・OGP情報なしの場合は元のリンクのまま据え置く。
 */
const rehypeOgpCard = () => {
  return async (tree: HastRoot) => {
    const targets: { parent: { children: ElementContent[] }; index: number; href: string }[] = []

    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'p' || parent == null || index == null) return
      const anchor = getBareLinkAnchor(node)
      if (anchor) {
        targets.push({
          parent: parent as { children: ElementContent[] },
          index,
          href: anchor.properties!.href as string,
        })
      }
    })

    if (targets.length === 0) return

    // 外部サイトへのリクエストはまとめて並列で取得する
    const results = await Promise.all(
      targets.map(async (target) => ({ ...target, ogp: await fetchOgp(target.href) })),
    )

    for (const { parent, index, href, ogp } of results) {
      // 取得失敗、もしくはタイトル/画像どちらも無い場合は通常リンクのまま
      if (!ogp || (!ogp.title && !ogp.image)) continue
      // カードはp要素と1対1で置換するためindexのズレは発生しない
      parent.children[index] = buildOgpCardNode(href, ogp)
    }
  }
}

interface ConvertOptions {
  // 単独行のリンクをOGPカードに変換する(ビルド時のみ。ブラウザではCORSで失敗する)
  ogp?: boolean
}

export const convertMarkdownTextToHTML = async (
  markdownText: string,
  options: ConvertOptions = {},
) => {
  const processor = unified()
    .use(parse)
    .use(gfm)
    .use(breaks)
    .use(rehype)
    .use(rehypeAddHeadingIds)

  if (options.ogp) {
    processor.use(rehypeOgpCard)
  }

  const hast = await processor
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
