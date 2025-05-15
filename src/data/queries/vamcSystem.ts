import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import {
  NodeHealthCareLocalFacility,
  NodeVamcSystem,
} from '@/types/drupal/node'
import { VamcSystem } from '@/types/formatted/vamcSystem'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchAndConcatAllResourceCollectionPages,
  fetchSingleEntityOrPreview,
  getMenu,
} from '@/lib/drupal/query'
import { formatter as formatImage } from '@/data/queries/mediaImage'
import { Menu } from '@/types/drupal/menu'
import { buildSideNavDataFromMenu } from '@/lib/drupal/facilitySideNav'
import { PAGE_SIZES } from '@/lib/constants/pageSizes'
import { queries } from '.'

// Define the query params for fetching node--vamc_system.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
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

/**
 * The shape of the data from Drupal + `lovell` from the path context.
 * We're adding `lovell` from the context here to conditionally re-shape
 * the menu for Lovell facilities.
 */
type VamcSystemData = {
  entity: NodeVamcSystem
  menu: Menu | null
  lovell?: ExpandedStaticPropsContext['lovell']
  mainFacilities: NodeHealthCareLocalFacility[]
}

// Implement the data loader.
export const data: QueryData<VamcSystemDataOpts, VamcSystemData> = async (
  opts
): Promise<VamcSystemData> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.VAMC_SYSTEM,
    params
  )) as NodeVamcSystem

  if (!entity) {
    throw new Error(`NodeVamcSystem entity not found for id: ${opts.id}`)
  }

  // Fetch list of local facilities related to this VAMC System
  const { data: mainFacilities } =
    await fetchAndConcatAllResourceCollectionPages<NodeHealthCareLocalFacility>(
      RESOURCE_TYPES.VAMC_FACILITY,
      queries
        .getParams(RESOURCE_TYPES.VAMC_FACILITY)
        .addFilter('field_region_page.id', entity.id)
        .addFilter('field_main_location', '1'),
      PAGE_SIZES[RESOURCE_TYPES.VAMC_FACILITY]
    )

  // Fetch the menu name dynamically off of the field_region_page reference if available.
  const menu = await getMenu(
    entity.field_system_menu.resourceIdObjMeta.drupal_internal__target_id
  )

  return { entity, menu, mainFacilities }
}

export const formatter: QueryFormatter<VamcSystemData, VamcSystem> = ({
  entity,
  menu,
  mainFacilities,
}) => {
  const formattedMenu = buildSideNavDataFromMenu(entity.path.alias, menu)
  return {
    ...entityBaseFields(entity),
    title: entity.title,
    introText: entity.field_intro_text,
    image: formatImage(entity.field_media),
    administration: {
      id: entity.field_administration?.drupal_internal__tid || null,
      name: entity.field_administration?.name || null,
    },
    path: entity.path.alias,
    menu: formattedMenu,
    mainFacilities: mainFacilities.map((facility) => ({
      title: facility.title,
      path: facility.path.alias,
      operatingStatusFacility: facility.field_operating_status_facility,
      address: facility.field_address,
      phoneNumber: facility.field_phone_number,
      fieldTelephone: facility.field_telephone,
      vaHealthConnectPhoneNumber: entity.field_va_health_connect_phone,
      image: formatImage(facility.field_media),
    })),
    // vamcEhrSystem: entity.field_vamc_ehr_system,
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
  }
}
