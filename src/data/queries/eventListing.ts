import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { queries } from '.'
import { NodeEvent, NodeEventListing } from '@/types/drupal/node'
import { Menu } from '@/types/drupal/menu'
import { EventListing } from '@/types/formatted/eventListing'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { PAGE_SIZES } from '@/lib/constants/pageSizes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchAndConcatAllResourceCollectionPages,
  fetchSingleEntityOrPreview,
  getMenu,
} from '@/lib/drupal/query'
import { buildSideNavDataFromMenu } from '@/lib/drupal/facilitySideNav'

const PAGE_SIZE = PAGE_SIZES[RESOURCE_TYPES.EVENT_LISTING]

// Define the query params for fetching node--event_listing.
export const params: QueryParams<null> = () => {
  return queries
    .getParams()
    .addInclude(['field_administration', 'field_office'])
}

// Define the option types for the data loader.
export type EventListingDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

type EventListingData = {
  entity: NodeEventListing
  events: NodeEvent[]
  menu: Menu
}

const listingParams: QueryParams<string> = (listingEntityId: string) => {
  return queries
    .getParams('node--event--teaser')
    .addFilter('field_listing.id', listingEntityId)
    .addSort('-created')
}

// Implement the data loader.
export const data: QueryData<EventListingDataOpts, EventListingData> = async (
  opts
) => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.EVENT_LISTING,
    params
  )) as NodeEventListing

  // Fetch list of events related to this listing
  const { data: events } =
    await fetchAndConcatAllResourceCollectionPages<NodeEvent>(
      RESOURCE_TYPES.EVENT,
      listingParams(entity.id),
      PAGE_SIZE
    )

  // Fetch the menu name dynamically off of the field_office reference
  const menu = await getMenu(
    entity.field_office.field_system_menu.resourceIdObjMeta
      .drupal_internal__target_id
  )

  return {
    entity,
    events,
    menu,
  }
}

export const formatter: QueryFormatter<EventListingData, EventListing> = ({
  entity,
  events,
  menu,
}) => {
  const formattedEvents = events.map((event) => {
    return queries.formatData('node--event--teaser', event)
  })

  const formattedMenu = buildSideNavDataFromMenu(entity.path.alias, menu)

  return {
    ...entityBaseFields(entity),
    events: formattedEvents,
    menu: formattedMenu,
  }
}
