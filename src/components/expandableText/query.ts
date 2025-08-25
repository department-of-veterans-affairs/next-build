// Define the query params for fetching node--news_story.
import { ParagraphExpandableText } from '@/types/drupal/paragraph'
import { QueryFormatter } from 'next-drupal-query'
import { ExpandableText } from '@/components/expandableText/formatted-type'

export const formatter: QueryFormatter<
  ParagraphExpandableText,
  ExpandableText
> = (entity: ParagraphExpandableText) => {
  return {
    type: entity.type as ExpandableText['type'],
    id: entity.id ?? null,
    entityId: entity.drupal_internal__id ?? null,
    header: entity.field_text_expander || null,
    text: entity.field_wysiwyg?.processed || null,
  }
}
