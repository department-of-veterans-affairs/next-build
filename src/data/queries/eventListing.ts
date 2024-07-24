import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { queries } from '.'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
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
  return new DrupalJsonApiParams().addInclude(['field_office'])
}

// Define the option types for the data loader.
export type EventListingDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

type EventListingData = {
  entity: NodeEventListing
  events: NodeEvent[]
  menu?: Menu
  totalItems: number
  totalPages: number
}

const listingParams: QueryParams<string> = (listingEntityId: string) => {
  return queries
    .getParams(`${RESOURCE_TYPES.EVENT}--teaser`)
    .addGroup('parentgroup', 'OR')
    .addFilter('field_listing.id', listingEntityId, '=', 'parentgroup')
    .addFilter('field_publish_to_outreach_cal', '1', 'IN', 'parentgroup') //check if an event has the "outreach cal" button checked. IDK WHY 1 WORKS BUT TRUE DOSENT :(
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

  // Fetch the menu name dynamically off of the field_office reference if available.
  // The `/outreach-and-events/events` event listing page has no menu attached to it.
  let menu = null
  if (entity.field_office.field_system_menu) {
    menu = await getMenu(
      entity.field_office.field_system_menu.resourceIdObjMeta
        .drupal_internal__target_id
    )
  }

  return {
    entity,
    events,
    menu,
    totalItems: events.length,
    totalPages: 1, // We don't want to paginate event listing pages. The widget handles pagination.
  }
}

export const formatter: QueryFormatter<EventListingData, EventListing> = ({
  entity,
  events,
  menu,
  totalItems,
  totalPages,
}) => {
  const formattedEvents = events.map((event) => {
    return queries.formatData(`${RESOURCE_TYPES.EVENT}--teaser`, event)
  })

  let formattedMenu = null
  if (menu !== null)
    formattedMenu = buildSideNavDataFromMenu(entity.path.alias, menu)

  return {
    ...entityBaseFields(entity),
    introText: entity.field_intro_text,
    events: formattedEvents,
    menu: formattedMenu,
    totalItems,
    totalPages,
  }
}
