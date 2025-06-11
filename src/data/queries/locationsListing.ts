import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeLocationsListing } from '@/types/drupal/node'
import { LocationsListing } from '@/types/formatted/locationsListing'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import { buildSideNavDataFromMenu } from '@/lib/drupal/facilitySideNav'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
  getMenu,
} from '@/lib/drupal/query'
import { Menu } from '@/types/drupal/menu'

// Define the query params for fetching node--locations_listing.
export const params: QueryParams<null> = () => {
  return (
    new DrupalJsonApiParams()
      // uncomment to add referenced entity data to the response
      .addInclude(['field_office'])
  )
}

// Define the option types for the data loader.
export type LocationsListingDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}
type LocationsListingData = {
  entity: NodeLocationsListing
  menu: Menu | null
}
// Implement the data loader.
export const data: QueryData<
  LocationsListingDataOpts,
  LocationsListingData
> = async (opts): Promise<LocationsListingData> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.LOCATIONS_LISTING,
    params
  )) as NodeLocationsListing

  if (!entity) {
    throw new Error(`NodeLocationsListing entity not found for id: ${opts.id}`)
  }
  const menu = entity.field_office.field_system_menu
    ? await getMenu(
        entity.field_office.field_system_menu.resourceIdObjMeta
          ?.drupal_internal__target_id
      )
    : null

  return { entity, menu }
}

export const formatter: QueryFormatter<
  LocationsListingData,
  LocationsListing
> = ({ entity, menu }) => {
  const formattedMenu = buildSideNavDataFromMenu(entity.path.alias, menu)
  return {
    ...entityBaseFields(entity),
    title: entity.title,
    path: entity.path.alias,
    menu: formattedMenu,
  }
}
