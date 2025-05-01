import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { NodeVamcSystem } from '@/types/drupal/node'
import { VamcSystem } from '@/types/formatted/vamcSystem'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'
import { formatter as formatImage } from '@/data/queries/mediaImage'

// Define the query params for fetching node--vamc_system.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams()
    .addInclude([
      'field_media',
      'field_media.image',
      'field_administration',
      'field_clinical_health_services',
      'field_related_links',
    ])
}

// Define the option types for the data loader.
export type VamcSystemDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Implement the data loader.
export const data: QueryData<VamcSystemDataOpts, NodeVamcSystem> = async (
  opts
): Promise<NodeVamcSystem> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.VAMC_SYSTEM,
    params
  )) as NodeVamcSystem

  return entity
}

export const formatter: QueryFormatter<NodeVamcSystem, VamcSystem> = (
  entity: NodeVamcSystem
) => {
  return {
    ...entityBaseFields(entity),
    title: entity.title,
    introText: entity.field_intro_text,
    image: formatImage(entity.field_media),
    administration: {
      id: entity.field_administration?.drupal_internal__tid || null,
      name: entity.field_administration?.name || null,
    },
    // fieldVaHealthConnectPhone: entity.field_va_health_connect_phone,
    // fieldVamcEhrSystem: entity.field_vamc_ehr_system,
    // fieldVamcSystemOfficialName: entity.field_vamc_system_official_name,
    // fieldFacebook: entity.field_facebook,
    // fieldTwitter: entity.field_twitter,
    // fieldInstagram: entity.field_instagram,
    // fieldFlickr: entity.field_flickr,
    // fieldYoutube: entity.field_youtube,
    // fieldAppointmentsOnline: entity.field_appointments_online,
    // fieldClinicalHealthServices: entity.field_clinical_health_services,
    fieldRelatedLinks: entity.field_related_links,
    path: entity.entityPath || '',
  }
}
