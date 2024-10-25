import { QueryFormatter } from 'next-drupal-query'
import { ParagraphChecklistItem } from '@/types/drupal/paragraph'
import { ChecklistItem } from '@/types/formatted/checklist'

export const formatter: QueryFormatter<ParagraphChecklistItem, ChecklistItem> = (
  entity: ParagraphChecklistItem
) => {
  return {
    type: entity.type as ChecklistItem['type'],
    id: entity.id,
    items: entity.field_checklist_items,
    header: entity.field_section_header,
    intro: entity.field_section_intro
  }
}
