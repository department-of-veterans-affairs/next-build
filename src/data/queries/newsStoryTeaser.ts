import { QueryFormatter, QueryParams } from 'next-drupal-query'
import { queries } from '.'
import { NodeNewsStory } from '@/types/dataTypes/drupal/node'
import { NewsStoryTeaserType } from '@/types/index'

// Define the query params for fetching node--news_story.
export const params: QueryParams<null> = () => {
  return queries
    .getParams()
    .addInclude(['field_media', 'field_media.image', 'field_listing'])
}

export const formatter: QueryFormatter<NodeNewsStory, NewsStoryTeaserType> = (
  entity: NodeNewsStory
) => {
  return {
    id: entity.id,
    type: entity.type,
    published: entity.status,
    headingLevel: 'h2', //@todo fix headingLevel,
    title: entity.title,
    image: queries.formatData('media--image', [entity.field_media]),
    link: entity.path.alias,
    introText: entity.field_intro_text,
  }
}
