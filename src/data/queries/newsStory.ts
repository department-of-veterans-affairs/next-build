import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { queries } from '.'
import { NodeNewsStory } from '@/types/dataTypes/drupal/node'
import { NewsStory } from '@/types/dataTypes/formatted/newsStory'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import { entityBaseFields } from '@/lib/utils/query'

// Define the query params for fetching node--news_story.
export const params: QueryParams<null> = () => {
  return queries
    .getParams()
    .addInclude([
      'field_media',
      'field_media.image',
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
  const entity = opts?.context?.preview
    ? // need to use getResourceFromContext for unpublished revisions
      await drupalClient.getResourceFromContext<NodeNewsStory>(
        'node--news_story',
        opts.context,
        {
          params: params().getQueryObject(),
        }
      )
    : // otherwise just lookup by uuid
      await drupalClient.getResource<NodeNewsStory>(
        'node--news_story',
        opts.id,
        {
          params: params().getQueryObject(),
        }
      )

  return entity
}

export const formatter: QueryFormatter<NodeNewsStory, NewsStory> = (
  entity: NodeNewsStory
) => {
  return {
    ...entityBaseFields(entity),
    image: queries.formatData('media--image', {
      entity: entity.field_media,
      cropType: '2_1_large',
    }),
    caption: entity.field_image_caption,
    author: entity.field_author,
    introText: entity.field_intro_text,
    bodyContent: entity.field_full_story,
    date: entity.created,
    socialLinks: {
      path: entity.path.alias,
      title: entity.title,
    },
    listing: entity.field_listing.path.alias,
    administration: {
      id: entity.field_administration?.drupal_internal__tid || null,
      name: entity.field_administration?.name || null,
    },
  }
}
