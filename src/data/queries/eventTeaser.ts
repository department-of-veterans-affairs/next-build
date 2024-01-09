import { QueryFormatter, QueryParams } from 'next-drupal-query'
import { queries } from '.'
import { NodeEvent } from '@/types/drupal/node'
import { EventTeaser } from '@/types/formatted/event'
import { entityBaseFields } from '@/lib/drupal/query'

// Define the query params for fetching node--news_story.
export const params: QueryParams<null> = () => {
  return queries
    .getParams()
    .addInclude(['field_media', 'field_media.image', 'field_listing'])
}

export const formatter: QueryFormatter<NodeEvent, EventTeaser> = (
  entity: NodeEvent
) => {
  return entity.title
  // return {
  // ...entityBaseFields(entity),
  // date: entity.date,
  // image: queries.formatData('media--image', entity.field_media), //cropType: '2_1_large'
  // }
}
