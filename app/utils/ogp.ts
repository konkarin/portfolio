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

    // res.text()はcharset未指定時にUTF-8決め打ちでデコードするため、
    // Shift_JIS/EUC-JP等のサイトで文字化けする。バイト列で受けてcharsetを判定する。
    const buffer = await res.arrayBuffer()
    const html = decodeHtml(buffer, contentType)
    return parseOgp(html, url)
  } catch (e) {
    console.error(`Failed to fetch OGP for ${url}:`, e)
    return null
  }
}

/**
 * HTMLのバイト列を適切なcharsetでデコードする。
 * charsetは「Content-Typeヘッダ → HTMLのmetaタグ → UTF-8」の順で判定する。
 */
const decodeHtml = (buffer: ArrayBuffer, contentType: string): string => {
  const headerCharset = /charset=["']?([^"';\s]+)/i.exec(contentType)?.[1]

  // meta判定用にまずlatin1でざっと読む(charset宣言はASCII範囲なので化けない)
  const bytes = new Uint8Array(buffer)
  const head = new TextDecoder('latin1').decode(bytes.subarray(0, 4096))
  const metaCharset =
    /<meta[^>]+charset=["']?([^"'>\s/]+)/i.exec(head)?.[1] ||
    /<meta[^>]+content=["'][^"']*charset=([^"';\s]+)/i.exec(head)?.[1]

  const charset = (headerCharset || metaCharset || 'utf-8').toLowerCase().trim()

  try {
    return new TextDecoder(charset).decode(bytes)
  } catch {
    // 未対応のcharsetラベルの場合はUTF-8にフォールバック
    return new TextDecoder('utf-8').decode(bytes)
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
