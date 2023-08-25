import {
  QueryData,
  QueryFormatter,
  QueryOpts,
  QueryParams,
} from 'next-drupal-query'
import { deserialize } from 'next-drupal'
import { drupalClient } from '@/lib/utils/drupalClient'
import { queries } from '.'
import { TJsonaModel } from 'jsona/lib/JsonaTypes'
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
  page: number
}>

type StoryListingData = {
  entity: NodeStoryListing
  stories: NodeNewsStory[]
  menu: Menu
  total: number
  current: number
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

  // Fetch list of stories related to this listing. `deserialize: false` for jsonapi pagination
  const stories = await drupalClient.getResourceCollection<TJsonaModel>(
    'node--news_story',
    {
      params: queries
        .getParams('node--news_story--teaser')
        .addFilter('field_listing.id', entity.id)
        .addSort('-changed')
        .addPageLimit(10)
        .addPageOffset(opts?.page)
        .getQueryObject(),
      deserialize: false,
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
    stories: deserialize(stories) as NodeNewsStory[],
    menu,
    total: stories.meta.count / 10,
    current: opts?.page,
  }
}

export const formatter: QueryFormatter<StoryListingData, StoryListingType> = ({
  entity,
  stories,
  menu,
  total,
  current,
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
    currentPage: current,
    totalPages: total,
  }
}
