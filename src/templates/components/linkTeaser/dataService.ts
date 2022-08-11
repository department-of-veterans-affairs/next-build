import {
  ParagraphResourceType,
  ParagraphLinkTeaser,
} from '@/types/dataTypes/drupal/paragraph'
import { EntityMetaInfo } from '@/data/delegators/entityMetaProvider'
import { LinkTeaser, LinkTeaserProps } from './index'

export const transformLinkTeaserData = function (
  entity: ParagraphLinkTeaser
): LinkTeaserProps {
  return {
    id: entity.id,
    uri: entity.field_link?.uri,
    title: entity.field_link?.title,
    options: entity.field_link?.options,
    summary: entity.field_link_summary,
    parentField: entity.parent_field_name,
    componentParams: { boldTitle: false, sectionHeader: '' },
  }
}

export const Meta: EntityMetaInfo = {
  resource: ParagraphResourceType.LinkTeaser,
  component: LinkTeaser,
  dataService: transformLinkTeaserData,
}
