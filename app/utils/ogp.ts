import type { Root as HastRoot } from 'hast'
import rehypeParse from 'rehype-parse'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'

export interface OgpData {
  url: string
  title?: string
  description?: string
  image?: string
  siteName?: string
}

/**
 * URLからOGPメタ情報を取得する。
 * Nuxtのprerender(nuxt generate)時にビルド側(Node)で実行されることを想定しているため、
 * ブラウザ環境(CORS)では利用しないこと。
 * 取得に失敗した場合はnullを返し、呼び出し側で通常のリンクにフォールバックする。
 */
export const fetchOgp = async (url: string, timeoutMs = 5000): Promise<OgpData | null> => {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        // OGPを返さないサイト対策で一般的なUAを送る
        'user-agent':
          'Mozilla/5.0 (compatible; konkarin-photo-ogp/1.0; +https://konkarin.photo)',
      },
    }).finally(() => clearTimeout(timer))

    if (!res.ok) return null

    const contentType = res.headers.get('content-type') || ''
    if (!contentType.includes('text/html')) return null

    const html = await res.text()
    return parseOgp(html, url)
  } catch (e) {
    console.error(`Failed to fetch OGP for ${url}:`, e)
    return null
  }
}

/**
 * HTML文字列からOGP情報をパースする。
 * og:* を優先し、無い場合は<title>やmeta descriptionにフォールバックする。
 */
const parseOgp = (html: string, url: string): OgpData => {
  const tree = unified().use(rehypeParse).parse(html) as HastRoot

  const meta: Record<string, string> = {}
  let titleTag = ''

  visit(tree, 'element', (node) => {
    if (node.tagName === 'meta') {
      const key = (node.properties?.property ?? node.properties?.name) as string | undefined
      const content = node.properties?.content as string | undefined
      if (key && content && meta[key.toLowerCase()] === undefined) {
        meta[key.toLowerCase()] = content
      }
    }

    if (node.tagName === 'title' && titleTag === '') {
      const text = node.children.find((child) => child.type === 'text')
      if (text && text.type === 'text') {
        titleTag = text.value.trim()
      }
    }
  })

  // og:imageは相対URLのことがあるためページURLを基準に絶対URL化する
  const rawImage = meta['og:image'] || meta['og:image:url']
  let image: string | undefined
  if (rawImage) {
    try {
      image = new URL(rawImage, url).href
    } catch {
      image = undefined
    }
  }

  return {
    url,
    title: meta['og:title'] || titleTag || undefined,
    description: meta['og:description'] || meta['description'] || undefined,
    image,
    siteName: meta['og:site_name'] || undefined,
  }
}
