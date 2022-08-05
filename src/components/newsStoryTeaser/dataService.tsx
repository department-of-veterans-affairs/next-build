import { ComponentType } from 'react'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { mediaImageDataService } from '@/components/media/dataService'
import { EntityMetaInfo } from '@/lib/delegators/entityMetaProvider'
import { NodeNewsStory, NodeResourceType } from '@/types/node'
import {
  NewsStoryTeaser,
  NewsStoryTeaserProps,
} from '@/components/newsStoryTeaser'

export const transformNewsStoryTeaserData = function (
  entity: NodeNewsStory
): NewsStoryTeaserProps {
  return {
    title: entity.title,
    image: mediaImageDataService(entity.field_media),
    link: entity.path.alias,
    introText: entity.field_intro_text,
  }
}

/** All nodes end with NodeMetaInfo: the name of the resource, the name of the component, and the parameters necessary for calling the resource. */
const params = new DrupalJsonApiParams()
  .addInclude(['field_media', 'field_media.image'])
  .addPageLimit(10)

/** Export information necessary to identify the component and query it.
 * See {@link EntityMetaInfo}
 */
export const Meta: EntityMetaInfo = {
  resource: NodeResourceType.NewsStory,
  component: NewsStoryTeaser,
  dataService: transformNewsStoryTeaserData,
  params: params,
}
