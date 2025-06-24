import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import {
  NodeHealthCareLocalFacility,
  NodeLocationsListing,
} from '@/types/drupal/node'
import { LocationsListing } from '@/types/formatted/locationsListing'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import { buildSideNavDataFromMenu } from '@/lib/drupal/facilitySideNav'
import {
  entityBaseFields,
  fetchAndConcatAllResourceCollectionPages,
  fetchSingleEntityOrPreview,
  getMenu,
} from '@/lib/drupal/query'
import { Menu } from '@/types/drupal/menu'
import { formatter as formatAdministration } from './administration'
import { formatter as formatImage } from '@/data/queries/mediaImage'
import { PAGE_SIZES } from '@/lib/constants/pageSizes'
import { queries } from '.'

// Define the query params for fetching node--locations_listing.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_office',
    'field_administration',
  ])
}

// Define the option types for the data loader.
export type LocationsListingDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}
type LocationsListingData = {
  entity: NodeLocationsListing
  menu: Menu | null
  mainFacilities: NodeHealthCareLocalFacility[]
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
  // Fetch list of local facilities related to this Locations Listing
  // added the sort to be alphabetical which is different from content build to be more helpful
  const { data: mainFacilities } =
    await fetchAndConcatAllResourceCollectionPages<NodeHealthCareLocalFacility>(
      RESOURCE_TYPES.VAMC_FACILITY,
      queries
        .getParams(RESOURCE_TYPES.VAMC_FACILITY)
        .addFilter('field_region_page.id', entity.field_office.id)
        .addFilter('field_main_location', '1')
        .addSort('title', 'ASC'),
      PAGE_SIZES[RESOURCE_TYPES.VAMC_FACILITY]
    )
  return { entity, menu, mainFacilities }
}

export const formatter: QueryFormatter<
  LocationsListingData,
  LocationsListing
> = ({ entity, menu, mainFacilities }) => {
  const formattedMenu = buildSideNavDataFromMenu(entity.path.alias, menu)
  return {
    ...entityBaseFields(entity),
    administration: formatAdministration(entity.field_administration),
    title: entity.title,
    path: entity.field_office.path.alias,
    menu: formattedMenu,
    vamcEhrSystem: entity.field_office.field_vamc_ehr_system,
    mainFacilities: mainFacilities.map((facility) => ({
      title: facility.title,
      path: facility.path.alias,
      operatingStatusFacility: facility.field_operating_status_facility,
      address: facility.field_address,
      phoneNumber: facility.field_phone_number,
      fieldTelephone: facility.field_telephone,
      vaHealthConnectPhoneNumber:
        entity.field_office.field_va_health_connect_phone ?? null,
      image: formatImage(facility.field_media),
    })),
  }
}
