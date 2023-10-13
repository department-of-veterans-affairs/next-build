import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { deserialize } from 'next-drupal'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { queries } from '.'
import { TJsonaModel } from 'jsona/lib/JsonaTypes'
import { NodeStoryListing, NodeNewsStory } from '@/types/dataTypes/drupal/node'
import { Menu } from '@/types/dataTypes/drupal/menu'
import { StoryListingType } from '@/types/index'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { buildSideNavDataFromMenu } from '@/lib/drupal/facilitySideNav'
import { ListingPageDataOpts } from '@/lib/drupal/listingPages'

export const PAGE_SIZE = 10 as const

// Define the query params for fetching node--news_story.
export const params: QueryParams<null> = () => {
  return queries.getParams().addInclude(['field_office'])
}

type StoryListingData = {
  entity: NodeStoryListing
  stories: NodeNewsStory[]
  menu: Menu
  totalItems: number
  totalPages: number
  current: number
}

// Implement the data loader.
export const data: QueryData<ListingPageDataOpts, StoryListingData> = async (
  opts
) => {
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
        .addSort('-created')
        .addPageLimit(PAGE_SIZE)
        .addPageOffset(((opts?.page || 1) - 1) * PAGE_SIZE)
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
  // We may want to make our own version of this method, a la staticPathResources
  const menu = await drupalClient.getMenu(
    entity.field_office.field_system_menu.resourceIdObjMeta
      .drupal_internal__target_id,
    menuOpts
  )

  return {
    entity,
    stories: deserialize(stories) as NodeNewsStory[],
    menu,
    totalItems: stories.meta.count,
    totalPages: Math.ceil(stories.meta.count / PAGE_SIZE),
    current: opts?.page || 1,
  }
}

export const formatter: QueryFormatter<StoryListingData, StoryListingType> = ({
  entity,
  stories,
  menu,
  totalItems,
  totalPages,
  current,
}) => {
  const formattedStories = stories.map((story) => {
    return queries.formatData('node--news_story--teaser', story)
  })

  const formattedMenu = buildSideNavDataFromMenu(entity.path.alias, menu)

  return {
    id: entity.id,
    entityId: entity.drupal_internal__nid,
    entityPath: entity.path.alias,
    type: entity.type,
    published: entity.status,
    title: entity.title,
    introText: entity.field_intro_text,
    stories: formattedStories,
    menu: formattedMenu,
    currentPage: current,
    totalItems,
    totalPages,
  }
}
