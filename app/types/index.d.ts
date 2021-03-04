export interface Article {
  id: string
  title: string
  text: string
  isPublished: boolean
  updatedDate: number | null
  createdDate: number | null
  tags: string[]
}
