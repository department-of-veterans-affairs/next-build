import { PublishedParagraph } from '@/types/formatted/publishedEntity'

export type PhoneNumber = PublishedParagraph & {
  extension: string
  label: string
  number: string
  phoneType: string
}
