import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import {
  NodeVamcSystemMedicalRecordsOffice,
  NodeVhaFacilityNonclinicalService,
} from '@/types/drupal/node'
import { VamcSystemMedicalRecordsOffice } from './formatted-type'
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
import {
  fetchVhaFacilityNonclinicalServices,
  formatter as formatVhaFacilityNonclinicalServices,
} from '@/components/vhaFacilityNonclinicalService/query'
import {
  getLovellVariantOfBreadcrumbs,
  getLovellVariantOfUrl,
  getOppositeChildVariant,
} from '@/lib/drupal/lovell/utils'
import { formatter as formatReactWidget } from '@/components/reactWidget/query'
import { formatter as formatQaSection } from '@/components/qaSection/query'

// Define the query params for fetching node--vamc_system_medical_records_office.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams()
    .addFilter('type', RESOURCE_TYPES.VAMC_SYSTEM_MEDICAL_RECORDS_OFFICE)
    .addInclude(['field_office'])
}

// Define the option types for the data loader.
export type VamcSystemMedicalRecordsOfficeDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Define the data structure returned from the query.
export type VamcSystemMedicalRecordsOfficeData = {
  entity: NodeVamcSystemMedicalRecordsOffice
  menu: Menu | null
  services: NodeVhaFacilityNonclinicalService[]
  lovell?: ExpandedStaticPropsContext['lovell']
}

// Implement the data loader.
export const data: QueryData<
  VamcSystemMedicalRecordsOfficeDataOpts,
  VamcSystemMedicalRecordsOfficeData
> = async (opts): Promise<VamcSystemMedicalRecordsOfficeData> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.VAMC_SYSTEM_MEDICAL_RECORDS_OFFICE,
    params
  )) as NodeVamcSystemMedicalRecordsOffice

  if (!entity) {
    throw new Error(
      `NodeVamcSystemMedicalRecordsOffice entity not found for id: ${opts.id}`
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

  const services = await fetchVhaFacilityNonclinicalServices(
    entity.field_office.id,
    'Medical records'
  )

  return { entity, menu, services, lovell: opts.context?.lovell }
}

// Implement the formatter.
export const formatter: QueryFormatter<
  VamcSystemMedicalRecordsOfficeData,
  VamcSystemMedicalRecordsOffice
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
    topOfPageContent: formatCcWysiwyg(entity.field_cc_top_of_page_content),
    getRecordsInPersonContent: formatCcWysiwyg(
      entity.field_cc_get_records_in_person
    ),
    howWeShareRecordsContent: formatCcWysiwyg(
      entity.field_cc_how_we_share_records
    ),
    faqsContent: formatQaSection(
      normalizeEntityFetchedParagraphs(entity.field_cc_faqs)
    ),
    reactWidget: formatReactWidget(
      normalizeEntityFetchedParagraphs(entity.field_cc_react_widget)
    ),
    relatedLinks: formatListOfLinkTeasers(
      normalizeEntityFetchedParagraphs(entity.field_cc_related_links)
    ),
    services: formatVhaFacilityNonclinicalServices(services),
    getRecordsMailOrFaxContent: formatCcWysiwyg(
      entity.field_cc_get_records_mail_or_fax
    ),
    mailingAddress: entity.field_vamc_med_records_mailing,
    faxNumber: entity.field_fax_number,
    lovellVariant: lovell?.variant ?? null,
    lovellSwitchPath: lovell?.isLovellVariantPage
      ? getLovellVariantOfUrl(
          entity.path.alias,
          getOppositeChildVariant(lovell?.variant)
        )
      : null,
  }
}
