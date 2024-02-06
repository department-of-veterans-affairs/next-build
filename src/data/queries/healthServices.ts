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
  return entities.map((entity): FormattedHealthService => {
    const serviceEntity = entity.entity.field_service_name_and_descripti

    return {
      name: serviceEntity.name,
      vetCenterTypeOfCare: serviceEntity.field_vet_center_type_of_care,
      vetCenterFriendlyName: serviceEntity.field_vet_center_friendly_name,
      alsoKnownAs: serviceEntity.field_also_known_as,
      vetCenterComConditions: serviceEntity.field_vet_center_com_conditions,
      commonlyTreatedCondition: serviceEntity.field_commonly_treated_Condition,
      vetCenterServiceDescription:
        serviceEntity.field_vet_center_service_descrip,
      description: serviceEntity.description?.processed,
      body: entity.entity.field_body?.processed,
    }
  })
}
