import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import {
  NodeRegionalHealthCareServiceDes,
  NodeVamcHealthServicesListing,
} from '@/types/drupal/node'
import { VamcHealthServicesListing, HealthService } from './formatted-type'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  fetchAndConcatAllResourceCollectionPages,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'
import {
  getVamcSystemAndMenu,
  ShallowVamcSystem,
} from '@/components/vamcSystem/vamcSystemAndMenu'
import {
  getLovellVariantOfUrl,
  getOppositeChildVariant,
} from '@/lib/drupal/lovell/utils'
import { formatter as formatAdministration } from '@/components/administration/query'
import { buildSideNavDataFromMenu } from '@/lib/drupal/facilitySideNav'
import { Menu } from '@/types/drupal/menu'
import { queries } from '@/lib/drupal/queries'
import { PARAGRAPH_RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { formatHealthService, groupHealthServicesByType } from './query-utils'
import { PAGE_SIZES } from '@/lib/constants/pageSizes'
import { entityBaseFields } from '@/lib/drupal/entityBaseFields'

// Define the query params for fetching node--health_services_listing.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams()
    .addInclude(['field_administration', 'field_featured_content_healthser'])
    .addFields('paragraph--link_teaser', ['field_link', 'field_link_summary'])
}

export const serviceParams: QueryParams<string> = (vamcSystemId: string) => {
  return new DrupalJsonApiParams()
    .addInclude([
      'field_service_name_and_descripti',
      'field_local_health_care_service_',
      'field_local_health_care_service_.field_facility_location',
    ])
    .addFilter('status', '1')
    .addFilter('field_region_page.id', vamcSystemId)
}

// Define the option types for the data loader.
export type VamcHealthServicesListingDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

type VamcHealthServicesListingData = {
  entity: NodeVamcHealthServicesListing
  vamcSystem: ShallowVamcSystem
  services: NodeRegionalHealthCareServiceDes[]
  menu: Menu | null
  lovell?: ExpandedStaticPropsContext['lovell']
}

// Implement the data loader.
export const data: QueryData<
  VamcHealthServicesListingDataOpts,
  VamcHealthServicesListingData
> = async (opts): Promise<VamcHealthServicesListingData> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.VAMC_HEALTH_SERVICES_LISTING,
    params
  )) as NodeVamcHealthServicesListing

  const { vamcSystem, menu } = await getVamcSystemAndMenu(
    entity.field_office.id,
    opts.context
  )

  const { data: services } =
    await fetchAndConcatAllResourceCollectionPages<NodeRegionalHealthCareServiceDes>(
      RESOURCE_TYPES.VAMC_SYSTEM_SERVICE_DES,
      serviceParams(vamcSystem.id),
      PAGE_SIZES.MAX
    )

  return {
    entity,
    vamcSystem,
    services,
    menu,
    lovell: opts.context?.lovell,
  }
}

export const formatter: QueryFormatter<
  VamcHealthServicesListingData,
  VamcHealthServicesListing
> = ({ entity, vamcSystem, services, menu, lovell }) => {
  const administration = formatAdministration(entity.field_administration)

  // Process health services - these come from the reverse relationship
  // In the GraphQL query, this is reverseFieldRegionPageNode
  const healthServices =
    services
      ?.map((service) => formatHealthService(service, administration))
      .filter((service): service is HealthService => service !== null) || []

  const healthServiceGroups = groupHealthServicesByType(healthServices)

  return {
    ...entityBaseFields(entity, lovell),
    introText: entity.field_intro_text,
    lovellVariant: lovell?.variant ?? null,
    lovellSwitchPath: lovell?.isLovellVariantPage
      ? getLovellVariantOfUrl(
          entity.path.alias,
          getOppositeChildVariant(lovell?.variant)
        )
      : null,
    path: entity.path.alias,
    administration,
    vamcEhrSystem: vamcSystem.field_vamc_ehr_system,
    menu: buildSideNavDataFromMenu(entity.path.alias, menu),
    featuredContent:
      entity.field_featured_content_healthser?.map((item) => {
        const formattedItem = queries.formatData(
          PARAGRAPH_RESOURCE_TYPES.LINK_TEASER,
          item
        )

        // to accomodate undefined values that cause serialization issues
        // AND preserve the URL preference logic
        return {
          ...formattedItem,
          entityId: formattedItem.entityId || null,
          uri: item.field_link?.url || formattedItem.uri,
        }
      }) || [],
    systemTitle: vamcSystem.title,
    healthServiceGroups,
  }
}
