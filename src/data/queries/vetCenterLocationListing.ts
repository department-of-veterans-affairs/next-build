import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import {
  NodeVetCenter,
  NodeVetCenterCap,
  NodeVetCenterLocationListing,
  NodeVetCenterMobileVetCenter,
} from '@/types/drupal/node'
import {
  VetCenterLocationListing,
  VetCenterInfoVariant,
  VetCenterMobileVetCenterInfo,
  VetCenterInfo,
} from '@/types/formatted/vetCenterLocationListing'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'
import { getHtmlFromDrupalContent } from '@/lib/utils/getHtmlFromDrupalContent'
import { formatter as formatImage } from '@/data/queries/mediaImage'

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

// Implement the data loader.
export const data: QueryData<
  VetCenterLocationListingDataOpts,
  NodeVetCenterLocationListing
> = async (opts): Promise<NodeVetCenterLocationListing> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.VET_CENTER_LOCATION_LISTING,
    params
  )) as NodeVetCenterLocationListing

  return entity
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
    image: formatImage(entity.field_media),
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
  NodeVetCenterLocationListing,
  VetCenterLocationListing
> = (entity: NodeVetCenterLocationListing) => {
  return {
    ...entityBaseFields(entity),
    title: entity.title,
    // Note to future Patrick: The field office is a node--vet_center, but all the
    // satellite locations are made up of both field_nearby_mobile_vet_centers and a
    // reverse lookup of associated "node--vet_center_outstation", "node--vet_center_cap"
    // (community access point), and "node--vet_center_mobile_vet_center" (but I'm
    // guessing these would already be included in the field_nearby_mobile_vet_centers)
    // according to the original graphql query.

    fieldOffice: formatVetCenterVariant(
      entity.field_office as NodeVetCenter
    ) as VetCenterInfo,
    fieldNearbyMobileVetCenters: entity.field_nearby_mobile_vet_centers.map(
      formatVetCenterVariant
    ) as VetCenterMobileVetCenterInfo[],
  }
}
