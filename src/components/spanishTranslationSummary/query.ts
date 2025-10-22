import { ParagraphSpanishTranslationSummary } from '@/types/drupal/paragraph'
import { QueryFormatter } from 'next-drupal-query'
import { SpanishTranslationSummary } from './formatted-type'
import { getHtmlFromField } from '@/lib/utils/getHtmlFromField'

export const formatter: QueryFormatter<
  ParagraphSpanishTranslationSummary,
  SpanishTranslationSummary
> = (entity: ParagraphSpanishTranslationSummary) => {
  return {
    type: entity.type as SpanishTranslationSummary['type'],
    id: entity.id,
    entityId: entity.drupal_internal__id,
    html: getHtmlFromField(entity.field_wysiwyg),
    textExpander: entity.field_text_expander,
  }
}
