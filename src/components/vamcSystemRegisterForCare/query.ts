import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import {
  NodeVamcSystemRegisterForCare,
  NodeVhaFacilityNonclinicalService,
  NodeHealthCareLocalFacility,
} from '@/types/drupal/node'
import { VamcSystemRegisterForCare } from './formatted-type'
import {
  PARAGRAPH_RESOURCE_TYPES,
  RESOURCE_TYPES,
} from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchAndConcatAllResourceCollectionPages,
  fetchSingleEntityOrPreview,
  getMenu,
} from '@/lib/drupal/query'
import { Menu } from '@/types/drupal/menu'
import { buildSideNavDataFromMenu } from '@/lib/drupal/facilitySideNav'
import {
  normalizeEntityFetchedParagraphs,
  formatParagraph,
} from '@/lib/drupal/paragraphs'
import { Wysiwyg } from '../wysiwyg/formatted-type'
import { FieldCCText } from '@/types/drupal/field_type'
import { formatter as formatListOfLinkTeasers } from '@/components/listOfLinkTeasers/query'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { PAGE_SIZES } from '@/lib/constants/pageSizes'
import { getNestedIncludes } from '@/lib/utils/queries'
import { formatter as formatServiceLocation } from '@/components/serviceLocation/query'
import {
  getLovellVariantOfBreadcrumbs,
  getLovellVariantOfUrl,
  getOppositeChildVariant,
} from '@/lib/drupal/lovell/utils'

// Define the query params for fetching node--vamc_system_register_for_care.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams()
    .addFilter('type', RESOURCE_TYPES.VAMC_SYSTEM_REGISTER_FOR_CARE)
    .addInclude(['field_office'])
}

export const serviceParams: QueryParams<string[]> = (facilityIds: string[]) => {
  return new DrupalJsonApiParams()
    .addInclude([
      'field_facility_location',
      ...getNestedIncludes(
        'field_service_location',
        PARAGRAPH_RESOURCE_TYPES.SERVICE_LOCATION
      ),
    ])
    .addFilter('status', '1')
    .addFilter('field_service_name_and_descripti.name', 'Register for care')
    .addFilter('field_facility_location.id', facilityIds, 'IN')
    .addFilter('field_facility_location.status', '1')
}

// Define the option types for the data loader.
export type VamcSystemRegisterForCareDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Define the data structure returned from the query.
type VamcSystemRegisterForCareData = {
  entity: NodeVamcSystemRegisterForCare
  menu: Menu | null
  services: NodeVhaFacilityNonclinicalService[]
  lovell?: ExpandedStaticPropsContext['lovell']
}

// Implement the data loader.
export const data: QueryData<
  VamcSystemRegisterForCareDataOpts,
  VamcSystemRegisterForCareData
> = async (opts): Promise<VamcSystemRegisterForCareData> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.VAMC_SYSTEM_REGISTER_FOR_CARE,
    params
  )) as NodeVamcSystemRegisterForCare

  if (!entity) {
    throw new Error(
      `NodeVamcSystemRegisterForCare entity not found for id: ${opts.id}`
    )
  }

  // Fetch the menu name dynamically off of the field_region_page reference if available.
  const menu = await getMenu(
    entity.field_office.field_system_menu.resourceIdObjMeta
      .drupal_internal__target_id
  )

  // The URIs for the link teasers (fetched via entity_field_fetch) are not true URL paths,
  // so we need to translate them from Drupal entity paths.
  await Promise.all(
    entity.field_cc_related_links.fetched.field_va_paragraphs.map(
      async (linkTeaser) => {
        for (const link of linkTeaser.field_link) {
          if (link.uri.startsWith('entity:')) {
            const uri = link.uri.replace('entity:', '')
            const pathInfo = await drupalClient.translatePath(uri)
            link.uri = pathInfo.entity.path
          }
        }
      }
    )
  )

  // Step 1: Fetch facilities for this region_page (direct filter - much faster)
  const { data: facilities } =
    await fetchAndConcatAllResourceCollectionPages<NodeHealthCareLocalFacility>(
      RESOURCE_TYPES.VAMC_FACILITY,
      new DrupalJsonApiParams()
        .addFilter('status', '1')
        .addFilter('field_region_page.id', entity.field_office.id),
      PAGE_SIZES.MAX
    )

  // If no facilities found, return empty services array
  if (facilities.length === 0) {
    return { entity, menu, services: [], lovell: opts.context?.lovell }
  }

  // Step 2: Fetch services filtered by facility_location IDs (avoids nested relationship filter)
  // This replaces the slow nested filter: field_facility_location.field_region_page.id
  // with a direct filter on facility_location IDs, which should be much faster
  const facilityIds = facilities.map((f) => f.id)
  const { data: services } =
    await fetchAndConcatAllResourceCollectionPages<NodeVhaFacilityNonclinicalService>(
      RESOURCE_TYPES.VHA_FACILITY_NONCLINICAL_SERVICE,
      serviceParams(facilityIds),
      PAGE_SIZES.MAX
    )

  return { entity, menu, services, lovell: opts.context?.lovell }
}

// Implement the formatter.
export const formatter: QueryFormatter<
  VamcSystemRegisterForCareData,
  VamcSystemRegisterForCare
> = ({ entity, menu, services, lovell }) => {
  const formatCcWysiwyg = (field: FieldCCText) =>
    formatParagraph(normalizeEntityFetchedParagraphs(field)) as Wysiwyg

  const formattedServices = services.map((service) => ({
    id: service.id,
    title: service.field_facility_location.title,
    path: service.field_facility_location.path.alias,
    serviceLocations: service.field_service_location.map(formatServiceLocation),
    address: service.field_facility_location.field_address,
    phoneNumber: service.field_facility_location.field_phone_number,
  }))

  // The old page didn't sort them, but we want the order to be predictable
  formattedServices.sort((a, b) => a.title.localeCompare(b.title))

  return {
    ...entityBaseFields(entity),
    breadcrumbs: lovell?.isLovellVariantPage
      ? getLovellVariantOfBreadcrumbs(entity.breadcrumbs, lovell.variant)
      : entity.breadcrumbs,
    title: entity.title,
    vamcSystem: {
      id: entity.field_office.id,
      title: entity.field_office.title,
    },
    menu: buildSideNavDataFromMenu(entity.path.alias, menu),
    topOfPageContent: formatCcWysiwyg(entity.field_cc_top_of_page_content),
    bottomOfPageContent: formatCcWysiwyg(
      entity.field_cc_bottom_of_page_content
    ),
    relatedLinks: formatListOfLinkTeasers(
      normalizeEntityFetchedParagraphs(entity.field_cc_related_links)
    ),
    services: formattedServices,
    lovellVariant: lovell?.variant ?? null,
    lovellSwitchPath: lovell?.isLovellVariantPage
      ? getLovellVariantOfUrl(
          entity.path.alias,
          getOppositeChildVariant(lovell?.variant)
        )
      : null,
  }
}
