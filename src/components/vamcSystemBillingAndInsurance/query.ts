import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import {
  NodeVamcSystemBillingAndInsurance,
  NodeVhaFacilityNonclinicalService,
} from '@/types/drupal/node'
import { VamcSystemBillingAndInsurance } from './formatted-type'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
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
import { formatter as formatPhoneNumber } from '@/components/phoneNumber/query'
import {
  fetchVhaFacilityNonclinicalServices,
  formatter as formatVhaFacilityNonclinicalServices,
} from '@/components/vhaFacilityNonclinicalService/query'
import {
  getLovellVariantOfBreadcrumbs,
  getLovellVariantOfUrl,
  getOppositeChildVariant,
} from '@/lib/drupal/lovell/utils'

// Define the query params for fetching node--vamc_system_billing_and_insurance.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams()
    .addFilter('type', RESOURCE_TYPES.VAMC_SYSTEM_BILLING_INSURANCE)
    .addInclude(['field_office', 'field_telephone'])
}

// Define the option types for the data loader.
export type VamcSystemBillingAndInsuranceDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Define the data structure returned from the query.
type VamcSystemBillingAndInsuranceData = {
  entity: NodeVamcSystemBillingAndInsurance
  menu: Menu | null
  services: NodeVhaFacilityNonclinicalService[]
  lovell?: ExpandedStaticPropsContext['lovell']
}

// Implement the data loader.
export const data: QueryData<
  VamcSystemBillingAndInsuranceDataOpts,
  VamcSystemBillingAndInsuranceData
> = async (opts): Promise<VamcSystemBillingAndInsuranceData> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.VAMC_SYSTEM_BILLING_INSURANCE,
    params
  )) as NodeVamcSystemBillingAndInsurance

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

  const services = await fetchVhaFacilityNonclinicalServices(
    entity.field_office.id,
    'Billing and insurance'
  )

  return { entity, menu, services, lovell: opts.context?.lovell }
}

// Implement the formatter.
export const formatter: QueryFormatter<
  VamcSystemBillingAndInsuranceData,
  VamcSystemBillingAndInsurance
> = ({ entity, menu, services, lovell }) => {
  const formatCcWysiwyg = (field: FieldCCText) =>
    formatParagraph(normalizeEntityFetchedParagraphs(field)) as Wysiwyg

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
    aboveTopOfPageContent: entity.field_cc_above_top_of_page
      ? formatCcWysiwyg(entity.field_cc_above_top_of_page)
      : undefined,
    topOfPageContent: formatCcWysiwyg(entity.field_cc_top_of_page_content),
    bottomOfPageContent: formatCcWysiwyg(
      entity.field_cc_bottom_of_page_content
    ),
    relatedLinks: formatListOfLinkTeasers(
      normalizeEntityFetchedParagraphs(entity.field_cc_related_links)
    ),
    services: formatVhaFacilityNonclinicalServices(services),
    officeHours: entity.field_office_hours,
    phoneNumber: formatPhoneNumber(entity.field_telephone),
    lovellVariant: lovell?.variant ?? null,
    lovellSwitchPath: lovell?.isLovellVariantPage
      ? getLovellVariantOfUrl(
          entity.path.alias,
          getOppositeChildVariant(lovell?.variant)
        )
      : null,
  }
}
