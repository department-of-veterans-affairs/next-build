import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import {
  NodeHealthCareLocalFacility,
  NodeLocationsListing,
} from '@/types/drupal/node'
import { LocationsListing } from './formatted-type'
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
import { formatter as formatAdministration } from '@/data/queries/administration'
import { formatter as formatImage } from '@/components/mediaImage/query'
import { formatter as formatPhone } from '@/data/queries/phoneNumber'
import { PAGE_SIZES } from '@/lib/constants/pageSizes'
import { queries } from '@/data/queries'
import {
  getLovellVariantOfBreadcrumbs,
  getLovellVariantOfUrl,
  getOppositeChildVariant,
} from '@/lib/drupal/lovell/utils'

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
  healthClinicFacilities: NodeHealthCareLocalFacility[]
  mobileFacilities: NodeHealthCareLocalFacility[]
  lovell?: ExpandedStaticPropsContext['lovell']
  otherVaLocationIds: string[]
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
  // added the sort to ensure this matches content build order
  // Fetch list of local facilities related to this Locations Listing
  const { data: allFacilities } =
    await fetchAndConcatAllResourceCollectionPages<NodeHealthCareLocalFacility>(
      RESOURCE_TYPES.VAMC_FACILITY,
      queries
        .getParams(RESOURCE_TYPES.VAMC_FACILITY)
        .addFilter('field_region_page.id', entity.field_office.id)
        .addSort('title', 'ASC'),
      PAGE_SIZES[RESOURCE_TYPES.VAMC_FACILITY]
    )

  // Categorize facilities based on content build template
  // Matches GraphQL categorization: main (field_main_location=true),
  // mobile (field_mobile=true), other (neither main nor mobile)
  const mainFacilities = allFacilities.filter((f) => f.field_main_location)
  const mobileFacilities = allFacilities.filter((f) => f.field_mobile)
  const healthClinicFacilities = allFacilities.filter(
    (f) => !f.field_main_location && !f.field_mobile
  )
  const otherVaLocationIds = entity.field_office.field_other_va_locations
  return {
    entity,
    menu,
    mainFacilities,
    healthClinicFacilities,
    mobileFacilities,
    lovell: opts.context?.lovell,
    otherVaLocationIds,
  }
}

export const formatter: QueryFormatter<
  LocationsListingData,
  LocationsListing
> = ({
  entity,
  menu,
  mainFacilities,
  healthClinicFacilities,
  mobileFacilities,
  lovell,
  otherVaLocationIds,
}) => {
  let { breadcrumbs } = entity
  if (lovell?.isLovellVariantPage) {
    breadcrumbs = getLovellVariantOfBreadcrumbs(breadcrumbs, lovell.variant)
  }

  const formattedMenu = buildSideNavDataFromMenu(entity.path.alias, menu)
  // Mobile clinics don't include VA Health Connect phone numbers in production so we add a flag to exclude them
  const formatFacility = (
    facility: NodeHealthCareLocalFacility,
    includeHealthConnect = true
  ) => ({
    title: facility.title,
    path: facility.path.alias,
    operatingStatusFacility: facility.field_operating_status_facility,
    address: facility.field_address,
    mainPhoneString: facility.field_phone_number,
    mentalHealthPhoneNumber: formatPhone(facility.field_telephone),
    vaHealthConnectPhoneNumber: includeHealthConnect
      ? (entity.field_office.field_va_health_connect_phone ?? null)
      : null,
    image: formatImage(facility.field_media),
  })

  const baseResult = {
    ...entityBaseFields(entity),
    administration: formatAdministration(entity.field_administration),
    title: entity.title,
    breadcrumbs,
    path: entity.field_office.path.alias,
    menu: formattedMenu,
    vamcEhrSystem: entity.field_office.field_vamc_ehr_system,
    mainFacilities: mainFacilities.map((facility) =>
      formatFacility(facility, true)
    ),
    healthClinicFacilities: healthClinicFacilities.map((facility) =>
      formatFacility(facility, true)
    ),
    mobileFacilities: mobileFacilities.map((facility) =>
      formatFacility(facility, false)
    ),
    otherVaLocationIds,
  }

  // Add Lovell variant information if this is a Lovell page
  if (lovell?.isLovellVariantPage) {
    return {
      ...baseResult,
      lovellVariant: lovell.variant,
      lovellSwitchPath: getLovellVariantOfUrl(
        entity.path.alias,
        getOppositeChildVariant(lovell.variant)
      ),
    }
  }

  return baseResult
}
