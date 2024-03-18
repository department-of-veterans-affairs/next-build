import { QueryFormatter } from 'next-drupal-query'
import { ParagraphNumberCallout } from '@/types/drupal/paragraph'
import { NumberCallout } from '@/types/formatted/numberCallout'

export const formatter: QueryFormatter<
  ParagraphNumberCallout,
  NumberCallout
> = (entity: ParagraphNumberCallout) => {
  return {
    type: entity.type as NumberCallout['type'],
    id: entity.id,
    entityId: entity.drupal_internal__id,
    numberPhrase: entity.field_short_phrase_with_a_number,
    description: entity.field_wysiwyg.processed,
  }
}
