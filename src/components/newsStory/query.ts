import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { queries } from '@/lib/drupal/queries'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeNewsStory } from '@/types/drupal/node'
import { NewsStory } from './formatted-type'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { getNestedIncludes } from '@/lib/utils/queries'
import { formatter as formatAdministration } from '@/components/administration/query'

// Define the query params for fetching node--news_story.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    ...getNestedIncludes('field_media', 'media--image'),
    'field_author',
    'field_listing',
    'field_administration',
  ])
}

// Define the option types for the data loader.
export type NewsStoryDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Implement the data loader.
export const data: QueryData<NewsStoryDataOpts, NodeNewsStory> = async (
  opts
): Promise<NodeNewsStory> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.STORY,
    params
  )) as NodeNewsStory

  return entity
}

export const formatter: QueryFormatter<NodeNewsStory, NewsStory> = (
  entity: NodeNewsStory
) => {
  return {
    ...entityBaseFields(entity),
    image: queries.formatData('media--image', entity.field_media),
    caption: entity.field_image_caption,
    author: entity.field_author,
    introText: entity.field_intro_text,
    bodyContent: entity.field_full_story,
    date: entity.created,
    socialLinks: {
      path: `${process.env.SITE_URL}${entity.path.alias}`,
      title: entity.title,
    },
    listing: entity.field_listing.path.alias,
    administration: formatAdministration(entity.field_administration),
  }
}
