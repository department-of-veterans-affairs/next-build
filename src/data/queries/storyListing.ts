import {
  QueryData,
  QueryFormatter,
  QueryOpts,
  QueryParams,
} from 'next-drupal-query'
import { drupalClient } from '@/lib/utils/drupalClient'
import { queries } from '.'
import { NodeStoryListing, NodeNewsStory } from '@/types/dataTypes/drupal/node'
import { Menu } from '@/types/dataTypes/drupal/menu'
import { StoryListingType } from '@/types/index'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

// Define the query params for fetching node--news_story.
export const params: QueryParams<null> = () => {
  return queries.getParams().addInclude(['field_office'])
}

// Define the option types for the data loader.
type DataOpts = QueryOpts<{
  id: string
}>

type StoryListingData = {
  entity: NodeStoryListing
  stories: NodeNewsStory[]
  menu: Menu
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

  // Fetch facility menu (sidebar navigation)
  const menuOpts = {
    params: new DrupalJsonApiParams()
      .addFields('menu_items', ['title,url'])
      .getQueryObject(),
  }

  // Fetch the menu name dynamically off of the field_office reference
  const menu = await drupalClient.getMenu(
    entity.field_office.field_system_menu.resourceIdObjMeta
      .drupal_internal__target_id,
    menuOpts
  )

  return {
    entity,
    stories,
    menu,
  }
}

export const formatter: QueryFormatter<StoryListingData, StoryListingType> = ({
  entity,
  stories,
  menu,
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
    menu: menu,
  }
}
