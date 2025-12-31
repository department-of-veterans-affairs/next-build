import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeVamcSystemVaPolice } from '@/types/drupal/node'
import { VamcSystemVaPolice } from './formatted-type'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import { fetchSingleEntityOrPreview } from '@/lib/drupal/query'
import {
  getVamcSystemAndMenu,
  ShallowVamcSystem,
} from '@/components/vamcSystem/vamcSystemAndMenu'
import { Menu } from '@/types/drupal/menu'
import { buildSideNavDataFromMenu } from '@/lib/drupal/facilitySideNav'
import { getHtmlFromField } from '@/lib/utils/getHtmlFromField'
import { ParagraphCCQaSection } from '@/types/drupal/paragraph'
import {
  normalizeEntityFetchedParagraphs,
  formatParagraph,
} from '@/lib/drupal/paragraphs'
import { QaSection } from '@/components/qaSection/formatted-type'
import { entityBaseFields } from '@/lib/drupal/entityBaseFields'

// Define the query params for fetching node--vamc_system_va_police.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_administration',
    'field_phone_numbers_paragraph',
  ])
}

// Define the option types for the data loader.
export type VamcSystemVaPoliceDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

type VamcSystemVaPoliceData = {
  entity: NodeVamcSystemVaPolice
  vamcSystem: ShallowVamcSystem | null
  menu: Menu | null
  lovell?: ExpandedStaticPropsContext['lovell']
}

// Implement the data loader.
export const data: QueryData<
  VamcSystemVaPoliceDataOpts,
  VamcSystemVaPoliceData
> = async (opts): Promise<VamcSystemVaPoliceData> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.VAMC_SYSTEM_VA_POLICE,
    params
  )) as NodeVamcSystemVaPolice

  // Fetch the VAMC system and menu separately for caching
  let vamcSystem: ShallowVamcSystem | null = null
  let menu: Menu | null = null

  if (entity.field_office?.id) {
    const result = await getVamcSystemAndMenu(
      entity.field_office.id,
      opts.context
    )
    vamcSystem = result.vamcSystem
    menu = result.menu
  }

  return { entity, vamcSystem, menu, lovell: opts.context?.lovell }
}

// Similarly, this formats centralized content FAQs to match what our QA components are expecting
const formatFaq = (faqs: ParagraphCCQaSection) =>
  formatParagraph(normalizeEntityFetchedParagraphs(faqs)) as QaSection

export const formatter: QueryFormatter<
  VamcSystemVaPoliceData,
  VamcSystemVaPolice
> = ({ entity, vamcSystem, menu, lovell }) => {
  const formattedMenu = buildSideNavDataFromMenu(entity.path.alias, menu)

  return {
    ...entityBaseFields(entity, lovell),
    path: entity.path.alias,
    menu: formattedMenu,
    policeOverview: {
      type: 'paragraph--wysiwyg',
      id: entity.field_cc_va_police_overview.target_id ?? '',
      html:
        getHtmlFromField(
          entity.field_cc_va_police_overview?.fetched?.field_wysiwyg?.[0]
        ) || '',
    },
    system: vamcSystem?.title || '',
    phoneNumber: {
      extension:
        entity.field_phone_numbers_paragraph?.[0]?.field_phone_extension || '',
      number:
        entity.field_phone_numbers_paragraph?.[0]?.field_phone_number || '',
      phoneType:
        entity.field_phone_numbers_paragraph?.[0]?.field_phone_number_type ||
        '',
      id: entity.field_phone_numbers_paragraph?.[0]?.id ?? '',
      type: 'paragraph--phone_number',
    },
    policeReport: {
      id: entity.field_cc_police_report?.[0]?.target_id ?? '',
      type: 'paragraph--featured_content',
      title:
        entity.field_cc_police_report?.fetched?.field_section_header?.[0]
          ?.value || '',
      description:
        entity.field_cc_police_report?.fetched?.field_description?.[0]
          ?.processed || '',
      link: {
        id: entity.field_cc_police_report?.fetched?.field_cta?.[0]?.id ?? '',
        type: 'paragraph--button',
        label:
          entity.field_cc_police_report?.fetched?.field_cta?.[0]
            ?.field_button_label?.[0]?.value || '',
        url:
          entity.field_cc_police_report?.fetched?.field_cta?.[0]
            ?.field_button_link?.[0]?.uri || '',
      },
    },
    faqs: Array.isArray(entity.field_cc_faq)
      ? entity.field_cc_faq.length > 0
        ? formatFaq(entity.field_cc_faq[0])
        : null
      : entity.field_cc_faq
        ? formatFaq(entity.field_cc_faq)
        : null,
  }
}
