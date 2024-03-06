import { FieldFormattedText } from '../drupal/field_type'
import { FormattedParagraph } from '@/data/queries'
import { PublishedParagraph } from '@/types/formatted/publishedEntity'

export type QaParagraph = PublishedParagraph & {
  question: string
  answers: FormattedParagraph[]
  type: string
}
