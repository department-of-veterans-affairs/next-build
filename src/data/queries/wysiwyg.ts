import {
  ParagraphWysiwyg,
  ParagraphRichTextCharLimit1000,
} from '@/types/drupal/paragraph'
import { QueryFormatter } from 'next-drupal-query'
import { Wysiwyg } from '@/types/formatted/wysiwyg'
import { drupalToVaPath, phoneLinks } from '@/lib/utils/helpers'

// Define the formatter for returning paragraph--wysiwyg & paragraph--rich_text_char_limit_1000 data.
export const formatter: QueryFormatter<
  ParagraphWysiwyg | ParagraphRichTextCharLimit1000,
  Wysiwyg
> = (entity: ParagraphWysiwyg | ParagraphRichTextCharLimit1000) => {
  const data = [entity.field_wysiwyg?.processed]
  const filters = [phoneLinks, drupalToVaPath]
  const filteredData = filters.reduce((d, f) => d.filter(f), data)

  return {
    id: entity.id,
    html: filteredData[0],
  }
}
