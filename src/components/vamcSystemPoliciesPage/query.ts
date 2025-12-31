import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeVamcSystemPoliciesPage } from '@/types/drupal/node'
import { VamcSystemPoliciesPage } from './formatted-type'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import { fetchSingleEntityOrPreview } from '@/lib/drupal/query'
import {
  getVamcSystemAndMenu,
  ShallowVamcSystem,
} from '@/components/vamcSystem/vamcSystemAndMenu'
import { getHtmlFromField } from '@/lib/utils/getHtmlFromField'
import {
  formatParagraph,
  normalizeEntityFetchedParagraphs,
} from '@/lib/drupal/paragraphs'
import { FieldCCText } from '@/types/drupal/field_type'
import { Wysiwyg } from '../wysiwyg/formatted-type'
import { Menu } from '@/types/drupal/menu'
import { buildSideNavDataFromMenu } from '@/lib/drupal/facilitySideNav'
import {
  getLovellVariantOfUrl,
  getOppositeChildVariant,
} from '@/lib/drupal/lovell/utils'
import { entityBaseFields } from '@/lib/drupal/entityBaseFields'

// Define the query params for fetching node--vamc_system_policies_page.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams()
}

// Define the option types for the data loader.
export type VamcSystemPoliciesPageDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

export type VamcSystemPoliciesPageData = {
  entity: NodeVamcSystemPoliciesPage
  vamcSystem: ShallowVamcSystem | null
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

export const formatter: QueryFormatter<
  VamcSystemPoliciesPageData,
  VamcSystemPoliciesPage
> = ({ entity, menu, lovell }) => {
  const formatCcWysiwyg = (field: FieldCCText) =>
    formatParagraph(normalizeEntityFetchedParagraphs(field)) as Wysiwyg

  const formattedMenu = buildSideNavDataFromMenu(entity.path.alias, menu)

  const formattedEntity: VamcSystemPoliciesPage = {
    ...entityBaseFields(entity, lovell),
    menu: formattedMenu,
    introText: formatCcWysiwyg(entity.field_cc_intro_text),
    topOfPageContent: formatCcWysiwyg(entity.field_cc_top_of_page_content),
    generalVisitationPolicy: formatCcWysiwyg(
      entity.field_cc_gen_visitation_policy
    ),
    visitationPolicy: getHtmlFromField(entity.field_vamc_visitation_policy),
    otherPolicies: getHtmlFromField(entity.field_vamc_other_policies),
    bottomOfPageContent: formatCcWysiwyg(
      entity.field_cc_bottom_of_page_content
    ),
    lovellVariant: lovell?.variant,
    lovellSwitchPath: lovell?.variant
      ? getLovellVariantOfUrl(
          entity.path.alias,
          getOppositeChildVariant(lovell?.variant)
        )
      : null,
  }

  return formattedEntity
}
