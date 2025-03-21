import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeVamcSystemVaPolice } from '@/types/drupal/node'
import { FormattedVamcSystemVaPolice } from '@/types/formatted/vamcSystemVaPolice'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'
import { buildFormattedFaqs } from '../processors/buildFormattedFaqs'
import { processFeaturedContent } from '../processors/featuredContent'
import { processPhoneNumber } from '../processors/phoneNumber'
import { processWysiwyg } from '../processors/wysiwyg'
import { processCcTermExpander } from '../processors/ccTermExpander'

// Define the query params for fetching node--vamc_system_va_police.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams()
    .addFilter('published', '1')
    .addInclude(['field_phone_numbers_paragraph', 'field_office'])
}

// Define the option types for the data loader.
export type VamcSystemVaPoliceDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Implement the data loader.
export const data: QueryData<
  VamcSystemVaPoliceDataOpts,
  NodeVamcSystemVaPolice
> = async (opts): Promise<NodeVamcSystemVaPolice> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.VAMC_SYSTEM_VA_POLICE,
    params
  )) as NodeVamcSystemVaPolice
  return entity
}

export const formatter: QueryFormatter<
  NodeVamcSystemVaPolice,
  FormattedVamcSystemVaPolice
> = (entity: NodeVamcSystemVaPolice) => {
  const {
    field_office,
    path,
    title,
    field_cc_faq,
    field_cc_police_report,
    field_cc_term_definitions,
    field_cc_term_definitions_nation,
    field_cc_va_police_overview,
    field_phone_numbers_paragraph,
  } = entity
  const processed = {
    ...entityBaseFields(entity),
    path,
    title,
    field_office: field_office.title,
    field_cc_faq: buildFormattedFaqs(field_cc_faq),
    field_cc_police_report: processFeaturedContent(field_cc_police_report),
    field_cc_va_police_overview: processWysiwyg(
      field_cc_va_police_overview.fetched
    ),
    field_cc_term_definitions: processCcTermExpander(field_cc_term_definitions),
    field_cc_term_definitions_nation: processCcTermExpander(
      field_cc_term_definitions_nation
    ),
    field_phone_numbers_paragraph: processPhoneNumber(
      field_phone_numbers_paragraph[0]
    ),
  }
  return processed
}
