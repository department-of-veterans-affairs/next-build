import { EntityMetaInfo } from '@/data/delegators/entityMetaProvider'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import {
  NodePersonProfile,
  NodeResourceType,
} from '@/types/dataTypes/drupal/node'

import { PersonProfile } from '@/templates/components/personProfile'
import { queries } from '@/data/queries'
export const personProfileDataService = function (
  entity: NodePersonProfile,
  viewMode: string
) {
  if (!entity) return null

  switch (viewMode) {
    case 'teaser':
      return {
        // headingLevel: headingLevel,
        title: entity.title,
        description: entity.field_description,
      }

    case 'full':
    default:
      return {
        title: entity.title,
        image: queries.formatData('media--image', [entity.field_media]),
        caption: entity.field_image_caption,
        author: entity.field_author,
        introText: entity.field_intro_text,
        bodyContent: entity.field_full_story?.processed,
        date: entity.created,
        socialLinks: entity,
        listing: entity.field_listing,
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
 * See {@link NodeMetaInfo}
 */
export const Meta: EntityMetaInfo = {
  resource: NodeResourceType.PersonProfile,
  component: PersonProfile,
  dataService: personProfileDataService,
  params: params,
}
