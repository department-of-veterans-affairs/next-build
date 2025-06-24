import { QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeNewsStory } from '@/types/drupal/node'
import { NewsStoryTeaser } from '@/products/newsStory/formatted-type'
import { getNestedIncludes } from '@/lib/utils/queries'
import { formatter as formatImage } from '@/data/queries/mediaImage'

// Define the query params for fetching node--news_story.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    ...getNestedIncludes('field_media', 'media--image'),
    'field_listing',
  ])
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
    image: formatImage(entity.field_media), //cropType: '2_1_large'
    link: `${entity.path.alias}`,
    introText: entity.field_intro_text,
    lastUpdated: entity.field_last_saved_by_an_editor || entity.created,
  }
}
