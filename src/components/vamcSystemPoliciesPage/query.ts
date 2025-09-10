import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeVamcSystemPoliciesPage } from '@/types/drupal/node'
import { VamcSystemPoliciesPage } from './formatted-type'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'
import { getHtmlFromField } from '@/lib/utils/getHtmlFromField'

// Define the query params for fetching node--vamc_system_policies_page.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_administration',
    'field_office',
  ])
}

// Define the option types for the data loader.
export type VamcSystemPoliciesPageDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Implement the data loader.
export const data: QueryData<
  VamcSystemPoliciesPageDataOpts,
  NodeVamcSystemPoliciesPage
> = async (opts): Promise<NodeVamcSystemPoliciesPage> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.VAMC_SYSTEM_POLICIES_PAGE,
    params
  )) as NodeVamcSystemPoliciesPage

  return entity
}

export const formatter: QueryFormatter<
  NodeVamcSystemPoliciesPage,
  VamcSystemPoliciesPage
> = (entity: NodeVamcSystemPoliciesPage) => {
  return {
    ...entityBaseFields(entity),
    introText: getHtmlFromField(
      entity.field_cc_intro_text?.fetched?.field_wysiwyg?.[0]
    ),
    topOfPageContent: getHtmlFromField(
      entity.field_cc_top_of_page_content?.fetched?.field_wysiwyg?.[0]
    ),
    generalVisitationPolicy: getHtmlFromField(
      entity.field_cc_gen_visitation_policy?.fetched?.field_wysiwyg?.[0]
    ),
    visitationPolicy: getHtmlFromField(entity.field_vamc_visitation_policy),
    otherPolicies: getHtmlFromField(entity.field_vamc_other_policies),
    bottomOfPageContent: getHtmlFromField(
      entity.field_cc_bottom_of_page_content?.fetched?.field_wysiwyg?.[0]
    ),
  }
}
