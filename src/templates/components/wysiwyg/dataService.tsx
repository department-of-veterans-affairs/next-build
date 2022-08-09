import { EntityMetaInfo } from 'data/delegators/entityMetaProvider'
import { ParagraphResourceType, ParagraphWysiwyg } from '@/types/data-types/drupal/paragraph'
import { drupalToVaPath, phoneLinks } from '@/lib/utils/helpers'
import Wysiwyg from 'templates/components/wysiwyg'

export const wysiwygDataService = (entity: ParagraphWysiwyg) => {
  const data = [entity.field_wysiwyg?.processed]
  const filters = [phoneLinks, drupalToVaPath]
  const filteredData = filters.reduce((d, f) => d.filter(f), data)
  return {
    id: entity.id,
    html: filteredData || filteredData[0] || '',
  }
}
export const Meta: EntityMetaInfo = {
  resource: ParagraphResourceType.Wysiwyg,
  component: Wysiwyg,
  dataService: wysiwygDataService,
}
