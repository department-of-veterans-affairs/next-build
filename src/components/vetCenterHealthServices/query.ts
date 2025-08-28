import { VetCenterFieldHealthServicesArray } from '@/types/drupal/field_type'
import {
  VetCenterHealthService as FormattedHealthService,
  VetCenterHealthServices as FormattedHealthServices,
} from '@/components/vetCenterHealthServices/formatted-type'
import { QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { getHtmlFromField } from '@/lib/utils/getHtmlFromField'
import { getHtmlFromDrupalContent } from '@/lib/utils/getHtmlFromDrupalContent'

export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_service_name_and_descripti',
  ])
}

export const formatter: QueryFormatter<
  VetCenterFieldHealthServicesArray,
  FormattedHealthServices
> = (entities: VetCenterFieldHealthServicesArray): FormattedHealthServices => {
  const formattedServices = entities
    .map((item): FormattedHealthService => {
      // I think this does not fetch when the service is unpublished
      const serviceEntity = item.field_service_name_and_descripti
      if (!serviceEntity) return null

      return {
        name: serviceEntity.name || null,
        vetCenterTypeOfCare:
          serviceEntity.field_vet_center_type_of_care || null,
        vetCenterFriendlyName:
          serviceEntity.field_vet_center_friendly_name || null,
        alsoKnownAs: serviceEntity.field_also_known_as || null,
        vetCenterComConditions:
          serviceEntity.field_vet_center_com_conditions || null,
        commonlyTreatedCondition:
          serviceEntity.field_commonly_treated_condition || null,
        vetCenterServiceDescription:
          getHtmlFromDrupalContent(
            serviceEntity.field_vet_center_service_descrip
          ) || null,
        body: getHtmlFromField(item.field_body) || null,
      }
    })
    .filter(Boolean)

  // Sort services alphabetically by name
  formattedServices.sort((a, b) => {
    if (a.name && b.name) {
      return a.name.localeCompare(b.name)
    }
    return 0
  })

  return formattedServices
}
