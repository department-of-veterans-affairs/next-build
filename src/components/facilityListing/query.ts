import { QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeHealthCareLocalFacility } from '@/types/drupal/node'
import { MinimalLocalFacility } from '../vamcSystem/formatted-type'

// Define the query params for fetching node--health_care_local_facility--teaser.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams()
    .addInclude(['field_telephone', 'field_image'])
}

export const formatter: QueryFormatter<NodeHealthCareLocalFacility, MinimalLocalFacility> = (
  entity: NodeHealthCareLocalFacility
) => {
  return {
    title: entity.title,
    path: entity.path.alias,
    operatingStatusFacility: entity.field_operating_status_facility,
    address: entity.field_location_address,
    mainPhoneString: entity.field_main_phone_string,
    mentalHealthPhoneNumber: entity.field_mental_health_phone_number,
    vaHealthConnectPhoneNumber: entity.field_va_health_connect_phone_number,
    image: entity.field_image,
  }
}

