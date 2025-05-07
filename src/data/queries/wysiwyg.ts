import {
  ParagraphWysiwyg,
  ParagraphRichTextCharLimit1000,
} from '@/types/drupal/paragraph'
import { QueryFormatter } from 'next-drupal-query'
import { Wysiwyg } from '@/types/formatted/wysiwyg'
import { getHtmlFromField } from '@/lib/utils/getHtmlFromField'

// Define the formatter for returning paragraph--wysiwyg & paragraph--rich_text_char_limit_1000 data.
export const formatter: QueryFormatter<
  ParagraphWysiwyg | ParagraphRichTextCharLimit1000,
  Wysiwyg
> = (entity: ParagraphWysiwyg | ParagraphRichTextCharLimit1000) => {
  const html = getHtmlFromField(entity.field_wysiwyg)

  return {
    type: entity.type as
      | 'paragraph--wysiwyg'
      | 'paragraph--rich_text_char_limit_1000',
    id: entity.id,
    html,
  }
}
