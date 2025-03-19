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
import { buildFormattedFaqs } from './buildFormattedFaqs'
import { processFeaturedContent } from '../processors/featuredContent'
import { processPhoneNumber } from '../processors/phoneNumber'
import { processWysiwyg } from '../processors/wysiwyg'

// Define the query params for fetching node--vamc_system_va_police.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_phone_numbers_paragraph',
    'field_office',
    'field_office.field_media',
  ])
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
    title,
    field_cc_faq,
    field_cc_police_report,
    field_cc_va_police_overview,
    field_office,
    field_phone_numbers_paragraph,
  } = entity
  return {
    ...entityBaseFields(entity),
    title,
    field_cc_faq: buildFormattedFaqs(field_cc_faq),
    field_cc_police_report: processFeaturedContent(field_cc_police_report),
    field_cc_va_police_overview: processWysiwyg(
      field_cc_va_police_overview.fetched
    ),
    field_office,
    field_phone_numbers_paragraph: processPhoneNumber(
      field_phone_numbers_paragraph[0]
    ),
  }
}
