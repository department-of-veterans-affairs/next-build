import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeVamcSystemRegisterForCare } from '@/types/drupal/node'
import { VamcSystemRegisterForCare } from './formatted-type'
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
  entityFetchedParagraphsToNormalParagraphs,
  formatParagraph,
} from '@/lib/drupal/paragraphs'
import { ParagraphWysiwyg } from '@/types/drupal/paragraph'
import { Wysiwyg } from '../wysiwyg/formatted-type'
import { FieldCCText } from '@/types/drupal/field_type'

// Define the query params for fetching node--vamc_system_register_for_care.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams()
    .addFilter('type', RESOURCE_TYPES.VAMC_SYSTEM_REGISTER_FOR_CARE)
    .addInclude([
      'field_office',
      // TODO: Add more includes as needed
    ])
}

// Define the option types for the data loader.
export type VamcSystemRegisterForCareDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Define the data structure returned from the query.
type VamcSystemRegisterForCareData = {
  entity: NodeVamcSystemRegisterForCare
  menu: Menu | null
}

// Implement the data loader.
export const data: QueryData<
  VamcSystemRegisterForCareDataOpts,
  VamcSystemRegisterForCareData
> = async (opts): Promise<VamcSystemRegisterForCareData> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.VAMC_SYSTEM_REGISTER_FOR_CARE,
    params
  )) as NodeVamcSystemRegisterForCare

  if (!entity) {
    throw new Error(
      `NodeVamcSystemRegisterForCare entity not found for id: ${opts.id}`
    )
  }

  // Fetch the menu name dynamically off of the field_region_page reference if available.
  const menu = await getMenu(
    entity.field_office.field_system_menu.resourceIdObjMeta
      .drupal_internal__target_id
  )

  return { entity, menu }
}

// Implement the formatter.
export const formatter: QueryFormatter<
  VamcSystemRegisterForCareData,
  VamcSystemRegisterForCare
> = ({ entity, menu }): VamcSystemRegisterForCare => {
  const formatCcWysiwyg = (field: FieldCCText) => {
    return formatParagraph(
      entityFetchedParagraphsToNormalParagraphs({
        type: field.target_type,
        bundle: field.fetched_bundle,
        ...field.fetched,
      }) as ParagraphWysiwyg
    ) as Wysiwyg
  }

  return {
    ...entityBaseFields(entity),
    title: entity.title,
    vamcSystem: {
      id: entity.field_office.id,
      title: entity.field_office.title,
    },
    menu: buildSideNavDataFromMenu(entity.path.alias, menu),
    topOfPageContent: formatCcWysiwyg(entity.field_cc_top_of_page_content),
    bottomOfPageContent: formatCcWysiwyg(
      entity.field_cc_bottom_of_page_content
    ),
  }
}
