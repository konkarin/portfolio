export interface Article {
  id: string
  title: string
  text: string
  isPublished: boolean
  updatedDate?: number
  createdDate: number
  releaseDate?: number
  tags: string[]
  ogpImageUrl?: string
  thumbnailImageUrl?: string // 2026年以降のデータにだけ存在する
  customId?: string
}
