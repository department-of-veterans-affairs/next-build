import {
  QueryData,
  QueryFormatter,
  QueryOpts,
  QueryParams,
} from 'next-drupal-query'
import { drupalClient } from '@/lib/utils/drupalClient'
import { queries } from '.'
import { NodeStoryListing, NodeNewsStory } from '@/types/dataTypes/drupal/node'
import { StoryListingType } from '@/types/index'

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
  stories: NodeNewsStory[]
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
  const stories = await drupalClient.getResourceCollection<NodeNewsStory[]>(
    'node--news_story',
    {
      params: queries
        .getParams('node--news_story--teaser')
        .addFilter('field_listing.id', entity.id)
        .getQueryObject(),
    }
  )
  return {
    entity,
    stories,
  }
}

export const formatter: QueryFormatter<StoryListingData, StoryListingType> = ({
  entity,
  stories,
}) => {
  const formattedStories = stories.map((story) => {
    return queries.formatData('node--news_story--teaser', story)
  })
  return {
    id: entity.id,
    type: entity.type,
    published: entity.status,
    title: entity.title,
    introText: entity.field_intro_text,
    stories: formattedStories,
  }
}
