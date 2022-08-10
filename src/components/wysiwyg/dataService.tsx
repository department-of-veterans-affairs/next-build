import { EntityMetaInfo } from '@/lib/delegators/entityMetaProvider'
import { ParagraphResourceType, ParagraphWysiwyg } from '@/types/paragraph'
import { drupalToVaPath, phoneLinks } from '@/utils/helpers'
import { Wysiwyg } from '@/components/wysiwyg'

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
