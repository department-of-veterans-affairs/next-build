import { PublishedParagraph } from '@/types/formatted/publishedEntity'

export type WysiwygField = {
  html: string
  className?: string
}

export type Wysiwyg = PublishedParagraph &
  WysiwygField & {
    type: 'paragraph--wysiwyg' | 'paragraph--rich_text_char_limit_1000'
  }
