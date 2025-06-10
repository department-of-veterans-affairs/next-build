import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeVamcSystemVaPolice } from '@/types/drupal/node'
import { VamcSystemVaPolice } from '@/types/formatted/vamcSystemVaPolice'
import {
  PARAGRAPH_RESOURCE_TYPES,
  RESOURCE_TYPES,
} from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
  getMenu,
} from '@/lib/drupal/query'
import { Menu } from '@/types/drupal/menu'
import { buildSideNavDataFromMenu } from '@/lib/drupal/facilitySideNav'
import { getHtmlFromField } from '@/lib/utils/getHtmlFromField'
import { QaSection as FormattedQaSection } from '@/types/formatted/qaSection'
import { buildFaqs } from '@/data/utils/ccFaqs'

// Define the query params for fetching node--vamc_system_va_police.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_administration',
    'field_office',
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
  menu: Menu | null
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

  if (!entity) {
    throw new Error(
      `NodeVamcSystemVaPolice entity not found for id: ${opts.id}`
    )
  }

  // Fetch the menu name dynamically off of the field_office reference
  const menu = entity.field_office.field_system_menu
    ? await getMenu(
        entity.field_office.field_system_menu.resourceIdObjMeta
          ?.drupal_internal__target_id
      )
    : null

  return { entity, menu }
}

export const formatter: QueryFormatter<
  VamcSystemVaPoliceData,
  VamcSystemVaPolice
> = ({ entity, menu }) => {
  const formattedMenu = buildSideNavDataFromMenu(entity.path.alias, menu)

  return {
    ...entityBaseFields(entity),
    title: entity.title,
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
    system: entity.field_office?.title || '',
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
    faqs: buildFaqs(entity.field_cc_faq),
  }
}
