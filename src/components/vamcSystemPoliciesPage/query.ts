import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeVamcSystemPoliciesPage } from '@/types/drupal/node'
import { VamcSystemPoliciesPage } from './formatted-type'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
  getMenu,
} from '@/lib/drupal/query'
import { getHtmlFromField } from '@/lib/utils/getHtmlFromField'
import { Menu } from '@/types/drupal/menu'
import { buildSideNavDataFromMenu } from '@/lib/drupal/facilitySideNav'

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

export type VamcSystemPoliciesPageData = {
  entity: NodeVamcSystemPoliciesPage
  menu: Menu | null
  lovell?: ExpandedStaticPropsContext['lovell']
}

// Implement the data loader.
export const data: QueryData<
  VamcSystemPoliciesPageDataOpts,
  VamcSystemPoliciesPageData
> = async (opts): Promise<VamcSystemPoliciesPageData> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.VAMC_SYSTEM_POLICIES_PAGE,
    params
  )) as NodeVamcSystemPoliciesPage

  if (!entity) {
    throw new Error(
      `NodeVamcSystemPoliciesPage entity not found for id: ${opts.id}`
    )
  }

  // Fetch the menu name dynamically off of the field_office reference
  const menu = entity.field_office.field_system_menu
    ? await getMenu(
        entity.field_office.field_system_menu.resourceIdObjMeta
          ?.drupal_internal__target_id
      )
    : null

  return { entity, menu, lovell: opts.context?.lovell }
}

export const formatter: QueryFormatter<
  VamcSystemPoliciesPageData,
  VamcSystemPoliciesPage
> = ({ entity, menu, lovell }) => {
  const formattedMenu = buildSideNavDataFromMenu(entity.path.alias, menu)

  return {
    ...entityBaseFields(entity),
    menu: formattedMenu,
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
