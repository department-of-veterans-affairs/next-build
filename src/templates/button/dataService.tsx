import { ParagraphButton, ParagraphResourceType } from '@/types/paragraph'
import { Button, ButtonProps } from 'templates/button'
import { EntityMetaInfo } from 'data/delegators/entityMetaProvider'

export const buttonDataService = function (
  entity: ParagraphButton
): ButtonProps {
  return {
    id: entity.id,
    url: entity.field_button_link?.uri || null,
    label: entity.field_button_label || null,
  }
}

export const Meta: EntityMetaInfo = {
  resource: ParagraphResourceType.Button,
  component: Button,
  dataService: buttonDataService,
}
