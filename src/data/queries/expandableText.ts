// Define the query params for fetching node--news_story.
import { ParagraphExpandableText } from '@/types/dataTypes/drupal/paragraph'
import {
  QueryData,
  QueryFormatter,
  QueryOpts,
  QueryParams,
} from 'next-drupal-query'
import { queries } from '@/data/queries/index'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { ExpandableTextType } from '@/types/index'

export const params: QueryParams<null> = () => {
  return queries.getParams().addPageLimit(10)
}

// Define the option types for the data loader.
type DataOpts = QueryOpts<null>

// Implement the data loader.
export const data: QueryData<DataOpts, ParagraphExpandableText[]> = async (
  opts
): Promise<ParagraphExpandableText[]> => {
  const entities = await drupalClient.getResourceCollection<
    ParagraphExpandableText[]
  >('paragraph--expandable_text', {
    params: params().getQueryObject(),
  })

  return entities
}

export const formatter: QueryFormatter<
  ParagraphExpandableText[],
  ExpandableTextType[]
> = (entities: ParagraphExpandableText[]) => {
  return entities.map((entity) => ({
    id: entity.id,
    header: entity.field_text_expander || null,
    text: entity.field_wysiwyg?.processed || null,
  }))
}
