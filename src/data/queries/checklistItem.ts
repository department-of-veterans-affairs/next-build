import { QueryFormatter } from 'next-drupal-query'
import { ParagraphChecklistItems } from '@/types/drupal/paragraph'
import { ChecklistItem } from '@/types/formatted/checklistItem'

export const formatter: QueryFormatter<ParagraphChecklistItems, ChecklistItem> = (
  entity: ParagraphChecklistItems
) => {
  return {
    items: entity.field_checklist_items,
    header: entity.field_section_header,
    intro: entity.field_section_intro
  }
}
