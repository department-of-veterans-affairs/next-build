import { QueryFormatter, QueryParams } from 'next-drupal-query'
import { queries } from '.'
import { NodeNewsStory } from '@/types/dataTypes/drupal/node'
import { NewsStoryTeaserType } from '@/types/index'
import { mediaImageDataService } from '@/templates/common/media/dataService'

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
    image: mediaImageDataService(
      entity.field_media,
      '1_1_square_medium_thumbnail '
    ),
    link: entity.path.alias,
    introText: entity.field_intro_text,
  }
}
