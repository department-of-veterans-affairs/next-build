import { FieldHealthServicesArray } from '@/types/drupal/field_type';
import { HealthService, HealthServices } from '@/types/formatted/healthServices';
import { QueryFormatter } from 'next-drupal-query';

export const formatter: QueryFormatter<FieldHealthServicesArray, HealthServices> = (
  entities: FieldHealthServicesArray
): HealthServices => {
  return entities.map((entity): HealthService => {
    const { fieldBody, fieldServiceNameAndDescripti } = entity.entity;
    const { entity: serviceEntity } = fieldServiceNameAndDescripti;

    return {
      name: serviceEntity.name,
      vetCenterTypeOfCare: serviceEntity.fieldVetCenterTypeOfCare,
      vetCenterFriendlyName: serviceEntity.fieldVetCenterFriendlyName,
      alsoKnownAs: serviceEntity.fieldAlsoKnownAs,
      vetCenterComConditions: serviceEntity.fieldVetCenterComConditions,
      commonlyTreatedCondition: serviceEntity.fieldCommonlyTreatedCondition,
      vetCenterServiceDescription: serviceEntity.fieldVetCenterServiceDescrip,
      description: serviceEntity.description.processed,
      body: fieldBody?.processed || null
    };
  });
};
