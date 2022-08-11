import {
  QueryData,
  QueryFormatter,
  QueryOpts,
  QueryParams,
} from 'next-drupal-query'
import { drupalClient } from '@/lib/utils/drupalClient'
import { queries } from '.'
import { NodeStoryListing } from '@/types/dataTypes/drupal/node'
import { NewsStoryTeaserType, StoryListingType } from '@/types/index'

// Define the query params for fetching node--news_story.
export const params: QueryParams<null> = () => {
  return queries.getParams()
}

// Define the option types for the data loader.
type DataOpts = QueryOpts<{
  id: string
}>

type StoryListingData = {
  entity: NodeStoryListing
  stories: NewsStoryTeaserType[]
}

// Implement the data loader.
export const data: QueryData<DataOpts, StoryListingData> = async (opts) => {
  const entity = await drupalClient.getResource<NodeStoryListing>(
    'node--story_listing',
    opts?.id,
    {
      params: params().getQueryObject(),
    }
  )
  const stories = await queries.getData('story_listing--news_stories', {
    listingId: entity.id,
  })
  return {
    entity,
    stories,
  }
}

export const formatter: QueryFormatter<StoryListingData, StoryListingType> = ({
  entity,
  stories,
}) => {
  return {
    id: entity.id,
    type: entity.type,
    published: entity.status,
    title: entity.title,
    introText: entity.field_intro_text,
    stories: stories,
  }
}
