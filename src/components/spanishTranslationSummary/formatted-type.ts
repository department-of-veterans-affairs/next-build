import { PublishedParagraph } from '@/types/formatted/publishedEntity'

export type SpanishTranslationSummary = PublishedParagraph & {
  type: 'paragraph--spanish_translation_summary'
  html: string
  textExpander: string
}
