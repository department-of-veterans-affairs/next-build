import { QueryData, QueryOpts, QueryParams } from "@next-drupal/query"

import { drupalClient } from "@/utils/drupalClient"
import { queries } from "./"

import { NewsStoryPageProps } from "@/types/index"
import { NodeNewsStory } from "data/types/drupal"
import NewsStoryPageMapping from "data/mappings/NewsStoryPageMapping"

// Define the query params for fetching the node--article.
export const params: QueryParams<null> = () => {
  return queries.getParams().addInclude([
    'field_media',
    'field_media.image',
    'field_author',
    'field_listing',
  ])
}

// Define the option types for the data loader.
type DataOpts = QueryOpts<{
  id: string
}>

// Implement the data loader.
export const data: QueryData<DataOpts, NewsStoryPageProps> = async (
  opts
): Promise<NewsStoryPageProps> => {
  const node = await drupalClient.getResource<NodeNewsStory>("node--news_story", opts?.id, {
    params: params().getQueryObject(),
  })

  return NewsStoryPageMapping(node)
}
