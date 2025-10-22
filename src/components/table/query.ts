import { QueryFormatter } from 'next-drupal-query'
import { ParagraphTable } from '@/types/drupal/paragraph'
import { Table } from '@/components/table/formatted-type'

export const formatter: QueryFormatter<ParagraphTable, Table> = (
  entity: ParagraphTable
) => {
  return {
    type: entity.type as Table['type'],
    id: entity.id,
    entityId: entity.drupal_internal__id,
    title: entity.field_table?.caption ?? null,
    data: entity.field_table?.value ?? [],
  }
}
