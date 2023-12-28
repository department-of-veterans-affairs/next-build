import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { queries } from '.'
import {
  NodeStoryListing,
  NodeNewsStory,
  NodeTypes,
} from '@/types/dataTypes/drupal/node'
import { Menu } from '@/types/dataTypes/drupal/menu'
import { StoryListing } from '@/types/dataTypes/formatted/storyListing'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { buildSideNavDataFromMenu } from '@/lib/drupal/facilitySideNav'
import { ListingPageDataOpts } from '@/lib/drupal/listingPages'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { PAGE_SIZES } from '@/lib/constants/pageSizes'
import {
  fetchAndConcatAllResourceCollectionPages,
  fetchSingleResourceCollectionPage,
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/utils/query'

const PAGE_SIZE = PAGE_SIZES[RESOURCE_TYPES.STORY_LISTING]

// Define the query params for fetching node--news_story.
export const params: QueryParams<null> = () => {
  return queries.getParams().addInclude(['field_office'])
}

const listingParams: QueryParams<string> = (listingEntityId: string) => {
  return queries
    .getParams('node--news_story--teaser')
    .addFilter('field_listing.id', listingEntityId)
    .addSort('-created')
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
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    'node--story_listing',
    params
  )) as NodeStoryListing

  // Fetch list of stories related to this listing
  const {
    data: stories,
    totalItems,
    totalPages,
  } = opts.page
    ? await fetchSingleResourceCollectionPage<NodeNewsStory>(
        RESOURCE_TYPES.STORY,
        listingParams(entity.id),
        PAGE_SIZE,
        opts.page
      )
    : await fetchAndConcatAllResourceCollectionPages<NodeNewsStory>(
        RESOURCE_TYPES.STORY,
        listingParams(entity.id),
        PAGE_SIZE
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
    stories,
    menu,
    totalItems,
    totalPages: totalPages,
    current: opts?.page,
  }
}

export const formatter: QueryFormatter<StoryListingData, StoryListing> = ({
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
    ...entityBaseFields(entity),
    introText: entity.field_intro_text,
    stories: formattedStories,
    menu: formattedMenu,
    currentPage: current,
    totalItems,
    totalPages,
  }
}
