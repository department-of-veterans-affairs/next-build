import {
  QueryData,
  QueryFormatter,
  QueryOpts,
  QueryParams,
} from 'next-drupal-query'
import { queries } from '.'
import { ParagraphLinkTeaser } from '@/types/drupal/paragraph'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { LinkTeaser } from '@/types/formatted/linkTeaser'

// Define the query params for fetching node--news_story.
export const params: QueryParams<null> = () => {
  return queries.getParams().addPageLimit(3)
}

// Define the option types for the data loader.
type DataOpts = QueryOpts<null>

// Implement the data loader.
export const data: QueryData<DataOpts, ParagraphLinkTeaser[]> = async (
  opts
): Promise<ParagraphLinkTeaser[]> => {
  const entities = await drupalClient.getResourceCollection<
    ParagraphLinkTeaser[]
  >('paragraph--link_teaser', {
    params: params().getQueryObject(),
  })

  return entities
}

export const formatter: QueryFormatter<ParagraphLinkTeaser, LinkTeaser> = (
  entity: ParagraphLinkTeaser
) => {
  return {
    id: entity.id,
    uri: entity.field_link?.uri,
    title: entity.field_link?.title,
    options: entity.field_link?.options,
    summary: entity.field_link_summary,
    parentField: entity.parent_field_name,
    componentParams: { boldTitle: false, sectionHeader: '' },
  }
}
