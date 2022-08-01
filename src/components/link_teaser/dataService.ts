import { IMAGE_PATH_TEMP } from '@/lib/constants'
import { ParagraphResourceType, ParagraphLinkTeaser } from '@/types/paragraph'
import { EntityMetaInfo } from '@/lib/delegators/entityMetaProvider'
import { LinkTeaser } from './index'

export const transformAudienceTopicsData = function (
  entity: ParagraphLinkTeaser
) {
  if (!entity) {
    return []
  }
  const thumbnail = IMAGE_PATH_TEMP + '/img/arrow-right-blue.svg'
  return {
    id: entity.id,
    title: entity.field_link?.title,
    options: entity.field_link?.options,
    summary: entity.field_link_summary,
    uri: entity.field_link.uri,
    thumbnail: thumbnail,
    parentField: entity.parent_field_name,
    componentParams: { boldTitle: false, sectionHeader: '' },
  }
}

export const Meta: EntityMetaInfo = {
  resource: ParagraphResourceType.LinkTeaser,
  component: LinkTeaser,
  dataService: transformAudienceTopicsData,
}
