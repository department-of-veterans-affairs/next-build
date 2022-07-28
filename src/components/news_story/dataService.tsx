import { ComponentType } from 'react'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { generalEntityDataService } from '@/lib/delegators/generalEntityDataService'
import { mediaImageDataService } from '@/components/media/dataService'
import { EntityMetaInfo } from '@/lib/delegators/entityMetaProvider'
import { NodeNewsStory, NodeResourceType } from '@/types/node'
import {
  NewsStoryFull,
  NewsStoryProps,
  NewsStoryTeaserProps,
} from '@/components/news_story'

export const newsStoryDataService = function (
  entity: NodeNewsStory,
  viewMode: string,
  headingLevel?: ComponentType | keyof JSX.IntrinsicElements
): NewsStoryProps | NewsStoryTeaserProps {
  switch (viewMode) {
    case 'teaser':
      return {
        headingLevel: headingLevel,
        title: entity.title,
        image: mediaImageDataService(entity.field_media),
        link: entity.path.alias,
        introText: entity.field_intro_text,
      }

    case 'full':
    default:
      return {
        title: entity.title,
        image: mediaImageDataService(entity.field_media),
        caption: entity.field_image_caption,
        author: generalEntityDataService(entity.field_author, 'teaser'),
        introText: entity.field_intro_text,
        bodyContent: entity.field_full_story?.processed,
        date: entity.created,
        socialLinks: {
          path: entity.path.alias,
          title: entity.title,
        },
        listing: entity.field_listing.path.alias,
      }
  }
}

/** All nodes end with NodeMetaInfo: the name of the resource, the name of the component, and the parameters necessary for calling the resource. */
const params = new DrupalJsonApiParams()
  .addInclude([
    'field_media',
    'field_media.image',
    'field_author',
    'field_listing',
  ])
  .addPageLimit(10)

/** Export information necessary to identify the component and query it.
 * See {@link EntityMetaInfo}
 */
export const Meta: EntityMetaInfo = {
  resource: NodeResourceType.NewsStory,
  component: NewsStoryFull,
  dataService: newsStoryDataService,
  params: params,
}
