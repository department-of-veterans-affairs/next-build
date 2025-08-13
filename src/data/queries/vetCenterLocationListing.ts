import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import {
  NodeVetCenter,
  NodeVetCenterCap,
  NodeVetCenterLocationListing,
  NodeVetCenterMobileVetCenter,
  NodeVetCenterOutstation,
} from '@/types/drupal/node'
import {
  VetCenterLocationListing,
  VetCenterInfoVariant,
  MobileVetCenterLocationInfo,
  VetCenterLocationInfo,
  VetCenterCapLocationInfo,
  VetCenterOutstationLocationInfo,
  CommonVetCenterFields,
} from '@/types/formatted/vetCenterLocationListing'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
  fetchAndConcatAllResourceCollectionPages,
} from '@/lib/drupal/query'
import { getHtmlFromDrupalContent } from '@/lib/utils/getHtmlFromDrupalContent'
import { formatter as formatImage } from '@/data/queries/mediaImage'
import { PAGE_SIZES } from '@/lib/constants/pageSizes'

// Define the query params for fetching node--vet_center_locations_list.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_office',
    'field_office.field_media',
    'field_office.field_media.image',
    'field_nearby_mobile_vet_centers',
    'field_nearby_mobile_vet_centers.field_media',
    'field_nearby_mobile_vet_centers.field_media.image',
  ])
}

// Define the option types for the data loader.
export type VetCenterLocationListingDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

type VetCenterLocationListingData = {
  entity: NodeVetCenterLocationListing
  caps: Array<NodeVetCenterCap>
  outstations: Array<NodeVetCenterOutstation>
  mobileVetCenters: Array<NodeVetCenterMobileVetCenter>
}

// Implement the data loader.
export const data: QueryData<
  VetCenterLocationListingDataOpts,
  VetCenterLocationListingData
> = async (opts): Promise<VetCenterLocationListingData> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.VET_CENTER_LOCATION_LISTING,
    params
  )) as NodeVetCenterLocationListing

  const relatedParams = new DrupalJsonApiParams()
    .addInclude(['field_media.image'])
    .addFilter('field_office.id', entity.field_office.id)
    .addFilter('status', '1')

  const { data: caps } =
    await fetchAndConcatAllResourceCollectionPages<NodeVetCenterCap>(
      RESOURCE_TYPES.VET_CENTER_CAP,
      relatedParams,
      PAGE_SIZES.MAX
    )

  const { data: outstations } =
    await fetchAndConcatAllResourceCollectionPages<NodeVetCenterOutstation>(
      RESOURCE_TYPES.VET_CENTER_OUTSTATION,
      relatedParams,
      PAGE_SIZES.MAX
    )

  const { data: mobileVetCenters } =
    await fetchAndConcatAllResourceCollectionPages<NodeVetCenterMobileVetCenter>(
      RESOURCE_TYPES.VET_CENTER_MOBILE_VET_CENTER,
      relatedParams,
      PAGE_SIZES.MAX
    )

  return {
    entity,
    caps,
    outstations,
    mobileVetCenters,
  }
}

// Common fields formatter for all Vet Center types
const formatCommonVetCenterFields = (
  entity:
    | NodeVetCenter
    | NodeVetCenterMobileVetCenter
    | NodeVetCenterCap
    | NodeVetCenterOutstation
): CommonVetCenterFields => {
  return {
    title: entity.title,
    path: entity.path?.alias || '',
    address: entity.field_address,
    geolocation: entity.field_geolocation ?? null,
    lastSavedByAnEditor: entity.field_last_saved_by_an_editor || null,
    image: entity.field_media ? formatImage(entity.field_media) : null,
    fieldFacilityLocatorApiId: entity.field_facility_locator_api_id,
  }
}

// Formatter for VetCenter entities
const formatVetCenterLocationInfo = (
  entity: NodeVetCenter
): VetCenterLocationInfo => {
  const baseFields = formatCommonVetCenterFields(entity)

  return {
    ...entityBaseFields(entity),
    ...baseFields,
    type: 'node--vet_center',
    officialName: entity.field_official_name,
    phoneNumber: entity.field_phone_number,
    officeHours: entity.field_office_hours || [],
    operatingStatusFacility: entity.field_operating_status_facility,
    operatingStatusMoreInfo: entity.field_operating_status_more_info
      ? getHtmlFromDrupalContent(entity.field_operating_status_more_info, {
          convertNewlines: true,
        })
      : null,
  }
}

// Formatter for VetCenterCap entities
const formatVetCenterCapLocationInfo = (
  entity: NodeVetCenterCap
): VetCenterCapLocationInfo => {
  const baseFields = formatCommonVetCenterFields(entity)

  return {
    ...entityBaseFields(entity),
    ...baseFields,
    type: 'node--vet_center_cap',
    geographicalIdentifier: entity.field_geographical_identifier,
    vetcenterCapHoursOptIn: entity.field_vetcenter_cap_hours_opt_in || false,
    operatingStatusFacility: entity.field_operating_status_facility,
    operatingStatusMoreInfo: entity.field_operating_status_more_info
      ? getHtmlFromDrupalContent(entity.field_operating_status_more_info, {
          convertNewlines: true,
        })
      : null,
  }
}

// Formatter for VetCenterOutstation entities
const formatVetCenterOutstationLocationInfo = (
  entity: NodeVetCenterOutstation
): VetCenterOutstationLocationInfo => {
  const baseFields = formatCommonVetCenterFields(entity)

  return {
    ...entityBaseFields(entity),
    ...baseFields,
    type: 'node--vet_center_outstation',
    operatingStatusFacility: entity.field_operating_status_facility,
    operatingStatusMoreInfo: entity.field_operating_status_more_info
      ? getHtmlFromDrupalContent(entity.field_operating_status_more_info, {
          convertNewlines: true,
        })
      : null,
    phoneNumber: entity.field_phone_number,
    officeHours: entity.field_office_hours || [],
    officialName: entity.field_official_name,
  }
}

// Formatter for MobileVetCenter entities
const formatMobileVetCenterLocationInfo = (
  entity: NodeVetCenterMobileVetCenter
): MobileVetCenterLocationInfo => {
  const baseFields = formatCommonVetCenterFields(entity)

  return {
    ...entityBaseFields(entity),
    ...baseFields,
    type: 'node--vet_center_mobile_vet_center',
    phoneNumber: entity.field_phone_number,
  }
}

/**
 * For some reason archived content is not fetched and rehydrated by the Drupal API. When
 * we come across one of these entities, we need to be able to ignore it.
 */
const isHydrated = (
  entity:
    | NodeVetCenter
    | NodeVetCenterMobileVetCenter
    | NodeVetCenterCap
    | NodeVetCenterOutstation
) => entity.status !== undefined

export const formatter: QueryFormatter<
  VetCenterLocationListingData,
  VetCenterLocationListing
> = ({
  entity,
  caps,
  outstations,
  mobileVetCenters,
}: VetCenterLocationListingData) => {
  const formattedOutstations = outstations.map(
    formatVetCenterOutstationLocationInfo
  )
  const formattedCaps = caps.map(formatVetCenterCapLocationInfo)
  const formattedMVCs = mobileVetCenters.map(formatMobileVetCenterLocationInfo)
  const formattedNearbyMVCs = entity.field_nearby_mobile_vet_centers
    .filter(isHydrated)
    .map(formatMobileVetCenterLocationInfo)

  const sortByTitle = (a: CommonVetCenterFields, b: CommonVetCenterFields) =>
    a.title.localeCompare(b.title)

  return {
    ...entityBaseFields(entity),
    title: entity.title,
    mainOffice: formatVetCenterLocationInfo(
      entity.field_office as NodeVetCenter
    ),
    // Sort the nearby mobile vet centers by title
    nearbyMobileVetCenters: formattedNearbyMVCs.sort(sortByTitle),
    // Sort the mobile vet centers by title
    mobileVetCenters: formattedMVCs.sort(sortByTitle),
    // Sort the satellite locations by title but with all the outstations first
    satelliteLocations: [
      ...formattedOutstations.sort(sortByTitle),
      ...formattedCaps.sort(sortByTitle),
    ],
  }
}
