import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { queries } from '@/data/queries'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeEvent, NodeEventListing } from '@/types/drupal/node'
import { Menu } from '@/types/drupal/menu'
import { EventListing } from '@/products/eventListing/formatted-type'
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
// See listingParams for more information about this value and its use.
const OUTREACH_CAL_UUID = '30295cab-89be-4173-a33c-8c0ca0a85d07'

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
  let eventParams = queries
    .getParams(`${RESOURCE_TYPES.EVENT}--teaser`)
    .addGroup('outreach_cal_group', 'OR')
    .addFilter('field_listing.id', listingEntityId, '=', 'outreach_cal_group')
    .addSort('-created')
  // The National Outreach Calendar is a special case.
  // https://www.va.gov/outreach-and-events/events/
  // There are two ways an event can end up on this calendar:
  // - directly assigned on field_listing (the way most events do)
  // - assigned via the checkbox field field_publish_to_outreach_cal
  // This additional filter grabs that second case.
  if (listingEntityId === OUTREACH_CAL_UUID) {
    eventParams = eventParams.addFilter(
      'field_publish_to_outreach_cal',
      '1',
      '=',
      'outreach_cal_group'
    )
  }
  return eventParams
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
  if (menu !== null) {
    formattedMenu = buildSideNavDataFromMenu(entity.path.alias, menu)
  }

  return {
    ...entityBaseFields(entity),
    introText: entity.field_intro_text,
    events: formattedEvents,
    menu: formattedMenu,
    totalItems,
    totalPages,
  }
}
