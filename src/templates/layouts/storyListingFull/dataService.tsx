/**
 * ### Overview
 * Story Listing represents an individual story within a Facility. These are used for human-interest articles.
 *
 * Story Listing expects nodes of type {@link NodeStoryListing}.
 *
 * ### View modes
 * Teaser: {@link StoryListing}
 *
 * ### Examples
 * @see https://va.gov/pittsburgh-health-care/stories/
 *
 */
import { generalEntityDataService } from '@/data/delegators/generalEntityDataService'
import { EntityMetaInfo } from '@/data/delegators/entityMetaProvider'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { StoryListing } from '@/templates/layouts/storyListingFull'
import { mediaImageDataService } from '@/templates/common/media/dataService'
import {
  NodeResourceType,
  NodeStoryListing,
} from '@/types/data-types/drupal/node'

export const storyListingDataService = function (
  entity: NodeStoryListing,
  viewMode: string
) {
  switch (viewMode) {

    case 'full':
    default:
      return {
        title: entity.title,
        image: mediaImageDataService(entity.field_media) || null,
        caption: entity.field_image_caption || '',
        author: generalEntityDataService(entity.field_author, 'teaser'),
        introText: entity.field_intro_text,
        bodyContent: entity.field_full_story?.processed || '',
        date: entity.created,
        socialLinks: {
          path: entity.path.alias,
          title: entity.title,
        },
        listing: entity.field_listing || null,
      }
  }
}

/** All nodes end with NodeMetaInfo: the name of the resource, the name of the component, and the parameters necessary for calling the resource. */
const params = new DrupalJsonApiParams()
  .addFilter('status', '1')
  .addSort('created', 'DESC')

const newsStory = new DrupalJsonApiParams()
  .addInclude(['field_media', 'field_media.image', 'field_listing'])
  .addPageLimit(10)

/** Export information necessary to identify the component and query it.
 * See {@link NodeMetaInfo}
 */

export const Meta: EntityMetaInfo = {
  resource: NodeResourceType.StoryListing,
  component: StoryListing,
  dataService: storyListingDataService,
  params: params,
  additionalNode: NodeResourceType.NewsStory,
  additionalParams: newsStory,
}
