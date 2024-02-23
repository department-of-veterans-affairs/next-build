// Define the query params for fetching node--news_story.
import { ParagraphExpandableText } from '@/types/drupal/paragraph'
import { QueryFormatter } from 'next-drupal-query'
import { ExpandableText } from '@/types/formatted/expandableText'

export const formatter: QueryFormatter<
  ParagraphExpandableText,
  ExpandableText
> = (entity: ParagraphExpandableText) => {
  return {
    type: entity.type as ExpandableText['type'],
    id: entity.id,
    entityId: entity.drupal_internal__id,
    header: entity.field_text_expander || null,
    text: entity.field_wysiwyg?.processed || null,
  }
}
