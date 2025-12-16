import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { queries } from '@/lib/drupal/queries'
import { NodeVetCenterOutstation } from '@/types/drupal/node'
import { VetCenterOutstation as FormattedVetCenterOutstation } from './formatted-type'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import { fetchSingleEntityOrPreview } from '@/lib/drupal/query'
import { getNestedIncludes } from '@/lib/utils/queries'
import { entityBaseFields } from '@/lib/drupal/entityBaseFields'
import { getHtmlFromDrupalContent } from '@/lib/utils/getHtmlFromDrupalContent'

// Define the query params for fetching node--vet_center_outstation.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    ...getNestedIncludes('field_media', 'media--image'),
    'field_administration',
    ...getNestedIncludes(
      'field_health_services',
      RESOURCE_TYPES.VET_CENTER_HEALTH_SERVICES
    ),
  ])
}

// Define the option types for the data loader.
export type VetCenterOutstationDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Implement the data loader.
export const data: QueryData<
  VetCenterOutstationDataOpts,
  NodeVetCenterOutstation
> = async (opts): Promise<NodeVetCenterOutstation> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.VET_CENTER_OUTSTATION,
    params
  )) as NodeVetCenterOutstation
  return entity
}

export const formatter: QueryFormatter<
  NodeVetCenterOutstation,
  FormattedVetCenterOutstation
> = (entity: NodeVetCenterOutstation) => {
  // format health services / filter per category
  const healthServicesArray = queries.formatData(
    RESOURCE_TYPES.VET_CENTER_HEALTH_SERVICES,
    entity.field_health_services ?? []
  )
  const counselingServicesArray = healthServicesArray.filter(
    (h) => h?.vetCenterTypeOfCare === 'counseling'
  )
  const referralServicesArray = healthServicesArray.filter(
    (h) => h?.vetCenterTypeOfCare === 'referral'
  )
  const otherServicesArray = healthServicesArray.filter(
    (h) =>
      h?.vetCenterTypeOfCare !== 'counseling' &&
      h?.vetCenterTypeOfCare !== 'referral'
  )

  const outstationPath = entity.path?.alias ?? ''

  return {
    ...entityBaseFields(entity),
    address: entity.field_address,
    geolocation: entity.field_geolocation,
    introText: entity.field_intro_text ?? null,
    lastSavedByAnEditor: entity.field_last_saved_by_an_editor ?? null,
    officeHours: entity.field_office_hours ?? null,
    officialName: entity.field_official_name ?? null,
    operatingStatusFacility: entity.field_operating_status_facility ?? null,
    operatingStatusMoreInfo: entity.field_operating_status_more_info
      ? getHtmlFromDrupalContent(entity.field_operating_status_more_info, {
          convertNewlines: true,
        })
      : null,
    phoneNumber: entity.field_phone_number ?? '',
    timezone: entity.field_timezone ?? null,
    administration: entity.field_administration ?? null,

    healthServices: healthServicesArray,
    counselingHealthServices: counselingServicesArray,
    referralHealthServices: referralServicesArray,
    otherHealthServices: otherServicesArray,
    image: entity.field_media
      ? queries.formatData('media--image', entity.field_media)
      : null,
    fieldFacilityLocatorApiId: entity.field_facility_locator_api_id ?? '',
    path: outstationPath,
  }
}
