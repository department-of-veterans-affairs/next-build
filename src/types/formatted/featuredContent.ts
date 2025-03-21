import { PublishedParagraph } from '@/types/formatted/publishedEntity'
import { FormattedCta } from './cta'

export type FeaturedContent = PublishedParagraph & {
  type: 'paragraph--featured_content'
  title: string
  description?: string
  id?: string
  link?: FormattedCta
}
