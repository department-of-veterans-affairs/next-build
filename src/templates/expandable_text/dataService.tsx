import { EntityMetaInfo } from 'data/delegators/entityMetaProvider'
import {
  ParagraphExpandableText,
  ParagraphResourceType,
} from '@/types/paragraph'
import { ExpandableText } from '.'

function isRequestValid(paragraph) {
  return paragraph.field_text_expander !== null
}

export const expandableTextDataService = function (
  entity: ParagraphExpandableText,
  viewMode: string
) {
  if (!entity || !isRequestValid(entity)) return

  switch (viewMode) {
    default:
      return {
        id: entity.id,
        header: entity.field_text_expander || null,
        text: entity.field_wysiwyg?.processed || null,
      }
  }
}

export const Meta: EntityMetaInfo = {
  resource: ParagraphResourceType.ExpandableText,
  component: ExpandableText,
  dataService: expandableTextDataService,
}
