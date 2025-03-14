import { FormattedParagraph } from '@/data/queries'
import { PublishedParagraph } from '@/types/formatted/publishedEntity'

export type QaParagraph = PublishedParagraph & {
  question: string
  answers: FormattedParagraph[]
  type: string
  setHeaderh3?: boolean
}
