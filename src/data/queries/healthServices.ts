import { FieldHealthServicesArray } from '@/types/drupal/field_type'
import {
  HealthService as FormattedHealthService,
  HealthServices as FormattedHealthServices,
} from '@/types/formatted/healthServices'
import { QueryFormatter } from 'next-drupal-query'

export const formatter: QueryFormatter<
  FieldHealthServicesArray,
  FormattedHealthServices
> = (entities: FieldHealthServicesArray): FormattedHealthServices => {
  return entities.map((item): FormattedHealthService => {
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
}
