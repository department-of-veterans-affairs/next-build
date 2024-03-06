import { FieldFormattedText } from '../drupal/field_type'
import { FormattedParagraph } from '@/data/queries'

export type QaParagraph = {
  question: string
  answers: FormattedParagraph[]
}
