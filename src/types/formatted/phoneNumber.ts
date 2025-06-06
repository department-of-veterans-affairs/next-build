import { PublishedParagraph } from '@/types/formatted/publishedEntity'

export type PhoneNumber = PublishedParagraph & {
  /** The optional phone extension (e.g., "123"). */
  extension: string
  label?: string
  /** The phone number string (e.g., "123-456-7890"). */
  number: string
  /** The phone type (e.g., "tel", "fax"). */
  phoneType: string
}
