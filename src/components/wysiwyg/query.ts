import {
  ParagraphWysiwyg,
  ParagraphRichTextCharLimit1000,
} from '@/types/drupal/paragraph'
import { Wysiwyg } from '@/components/wysiwyg/formatted-type'
import { getHtmlFromField } from '@/lib/utils/getHtmlFromField'
import { GetHtmlFromDrupalContentOptions } from '@/lib/utils/getHtmlFromDrupalContent'

// Define the formatter for returning paragraph--wysiwyg & paragraph--rich_text_char_limit_1000 data.
export const formatter = (
  entity: ParagraphWysiwyg | ParagraphRichTextCharLimit1000,
  options?: GetHtmlFromDrupalContentOptions
): Wysiwyg => {
  const html = getHtmlFromField(entity.field_wysiwyg, options)

  return {
    type: entity.type as
      | 'paragraph--wysiwyg'
      | 'paragraph--rich_text_char_limit_1000',
    id: entity.id ?? null,
    html,
  }
}
