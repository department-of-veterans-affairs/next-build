import { VetCenterFieldHealthServicesArray } from '@/types/drupal/field_type'
import {
  VetCenterHealthService as FormattedHealthService,
  VetCenterHealthServices as FormattedHealthServices,
} from '@/types/formatted/vetCenterHealthServices'
import { QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_service_name_and_descripti',
  ])
}

export const formatter: QueryFormatter<
  VetCenterFieldHealthServicesArray,
  FormattedHealthServices
> = (entities: VetCenterFieldHealthServicesArray): FormattedHealthServices => {
  const formattedServices = entities.map((item): FormattedHealthService => {
    const serviceEntity = item.field_service_name_and_descripti
    if (!serviceEntity) return null

    return {
      name: serviceEntity.name || null,
      vetCenterTypeOfCare: serviceEntity.field_vet_center_type_of_care || null,
      vetCenterFriendlyName:
        serviceEntity.field_vet_center_friendly_name || null,
      alsoKnownAs: serviceEntity.field_also_known_as || null,
      vetCenterComConditions:
        serviceEntity.field_vet_center_com_conditions || null,
      commonlyTreatedCondition:
        serviceEntity.field_commonly_treated_condition || null,
      vetCenterServiceDescription:
        serviceEntity.field_vet_center_service_descrip || null,
      description: serviceEntity.description?.processed || null,
      body: item.field_body?.processed || null,
    }
  })

  // Sort services alphabetically by name
  formattedServices.sort((a, b) => {
    if (a.name && b.name) {
      return a.name.localeCompare(b.name)
    }
    return 0
  })

  return formattedServices
}
