import { QueryFormatter } from 'next-drupal-query'

import { ParagraphProcessList } from '@/types/drupal/paragraph'
import { ProcessList } from '@/types/formatted/processList'

export const formatter: QueryFormatter<ParagraphProcessList, ProcessList> = (
  entity: ParagraphProcessList
) => {
  return {
    type: entity.type as ProcessList['type'],
    id: entity.id,
    entityId: entity.drupal_internal__id,
    steps: entity.field_steps.map((step) => ({
      html: step.processed,
    })),
  }
}
