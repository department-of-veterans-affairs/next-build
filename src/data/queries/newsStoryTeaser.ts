import { QueryFormatter, QueryParams } from 'next-drupal-query'
import { queries } from '.'
import { NodeNewsStory } from '@/types/drupal/node'
import { NewsStoryTeaser } from '@/types/formatted/newsStory'

// Define the query params for fetching node--news_story.
export const params: QueryParams<null> = () => {
  return queries
    .getParams()
    .addInclude(['field_media', 'field_media.image', 'field_listing'])
}

export const formatter: QueryFormatter<NodeNewsStory, NewsStoryTeaser> = (
  entity: NodeNewsStory
) => {
  return {
    id: entity.id,
    type: entity.type,
    published: entity.status,
    headingLevel: 'h2', //@todo fix headingLevel,
    title: entity.title,
    image: queries.formatData('media--image', entity.field_media), //cropType: '2_1_large'
    link: entity.path.alias,
    introText: entity.field_intro_text,
    lastUpdated: entity.field_last_saved_by_an_editor || entity.created,
  }
}
