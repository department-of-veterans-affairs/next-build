import { PublishedParagraph } from '@/types/formatted/publishedEntity'

export type FeaturedContent = PublishedParagraph & {
  type: 'paragraph--featured_content'
  title: string
  description?: string
  id?: string
  link?: {
    id: string
    url: string
    label: string
  }
}
