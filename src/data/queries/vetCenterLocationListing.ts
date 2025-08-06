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
  satelliteLocations: Array<NodeVetCenterCap | NodeVetCenterOutstation>
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

  const { data: caps } =
    await fetchAndConcatAllResourceCollectionPages<NodeVetCenterCap>(
      RESOURCE_TYPES.VET_CENTER_CAP,
      new DrupalJsonApiParams()
        .addInclude(['field_media.image'])
        .addFilter('field_office.id', entity.id),
      PAGE_SIZES.MAX
    )

  const { data: outstations } =
    await fetchAndConcatAllResourceCollectionPages<NodeVetCenterOutstation>(
      RESOURCE_TYPES.VET_CENTER_OUTSTATION,
      new DrupalJsonApiParams()
        .addInclude(['field_media.image'])
        .addFilter('field_office.id', entity.id),
      PAGE_SIZES.MAX
    )

  const { data: mobileVetCenters } =
    await fetchAndConcatAllResourceCollectionPages<NodeVetCenterMobileVetCenter>(
      RESOURCE_TYPES.VET_CENTER_MOBILE_VET_CENTER,
      new DrupalJsonApiParams()
        .addInclude(['field_media.image'])
        .addFilter('field_office.id', entity.id),
      PAGE_SIZES.MAX
    )

  return {
    entity,
    satelliteLocations: [...caps, ...outstations],
    mobileVetCenters,
  }
}

// Single formatter function that handles all Vet Center variants
const formatVetCenterVariant = (
  entity: NodeVetCenter | NodeVetCenterMobileVetCenter | NodeVetCenterCap
): VetCenterInfoVariant => {
  const baseFields = {
    ...entityBaseFields(entity),
    title: entity.title,
    path: entity.path?.alias || '',
    address: entity.field_address,
    geolocation: entity.field_geolocation,
    lastSavedByAnEditor: entity.field_last_saved_by_an_editor || null,
    image: entity.field_media ? formatImage(entity.field_media) : null,
    fieldFacilityLocatorApiId: entity.field_facility_locator_api_id,
  }

  // Determine the type from the entity
  const entityType = entity.type

  switch (entityType) {
    case 'node--vet_center':
      return {
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

    case 'node--vet_center_cap':
      return {
        ...baseFields,
        type: 'node--vet_center_cap',
        geographicalIdentifier: entity.field_geographical_identifier,
        vetcenterCapHoursOptIn:
          entity.field_vetcenter_cap_hours_opt_in || false,
        operatingStatusFacility: entity.field_operating_status_facility,
        operatingStatusMoreInfo: entity.field_operating_status_more_info
          ? getHtmlFromDrupalContent(entity.field_operating_status_more_info, {
              convertNewlines: true,
            })
          : null,
      }

    case 'node--vet_center_mobile_vet_center':
      return {
        ...baseFields,
        type: 'node--vet_center_mobile_vet_center',
        phoneNumber: entity.field_phone_number,
      }

    default:
      throw new Error(`Unknown Vet Center entity type: ${entityType}`)
  }
}

export const formatter: QueryFormatter<
  VetCenterLocationListingData,
  VetCenterLocationListing
> = ({
  entity,
  satelliteLocations,
  mobileVetCenters,
}: VetCenterLocationListingData) => {
  return {
    ...entityBaseFields(entity),
    title: entity.title,
    fieldOffice: formatVetCenterVariant(
      entity.field_office as NodeVetCenter
    ) as VetCenterLocationInfo,
    nearbyMobileVetCenters: entity.field_nearby_mobile_vet_centers.map(
      formatVetCenterVariant
    ) as MobileVetCenterLocationInfo[],
    mobileVetCenters: mobileVetCenters.map(
      formatVetCenterVariant
    ) as MobileVetCenterLocationInfo[],
    satelliteLocations: satelliteLocations.map(formatVetCenterVariant) as (
      | VetCenterCapLocationInfo
      | VetCenterOutstationLocationInfo
    )[],
  }
}
