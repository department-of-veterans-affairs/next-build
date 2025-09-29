import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { NodeVamcSystemDetailPage } from '@/types/drupal/node'
import { VamcSystemDetailPage } from './formatted-type'
import { formatter as formatListOfLinkTeasers } from '@/components/listOfLinkTeasers/query'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
  getMenu,
} from '@/lib/drupal/query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { Menu } from '@/types/drupal/menu'
import { buildSideNavDataFromMenu } from '@/lib/drupal/facilitySideNav'
import {
  getLovellVariantOfBreadcrumbs,
  getLovellVariantOfUrl,
  getOppositeChildVariant,
} from '@/lib/drupal/lovell/utils'
import { formatter as formatAdministration } from '@/components/administration/query'

export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams()
    .addFilter('type', RESOURCE_TYPES.VAMC_SYSTEM_DETAIL_PAGE)
    .addInclude([
      'field_administration',
      'field_office',
      'field_related_links',
      'field_related_links.field_va_paragraphs',
    ])
}

// Define the option types for the data loader.
export type VamcSystemDetailPageDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Define the data structure returned from the query.
type VamcSystemDetailPageData = {
  entity: NodeVamcSystemDetailPage
  menu: Menu | null
  lovell?: ExpandedStaticPropsContext['lovell']
}

// Implement the data loader.
export const data: QueryData<
  VamcSystemDetailPageDataOpts,
  VamcSystemDetailPageData
> = async (opts): Promise<VamcSystemDetailPageData> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.VAMC_SYSTEM_BILLING_INSURANCE,
    params
  )) as NodeVamcSystemDetailPage

  if (!entity) {
    throw new Error(
      `NodeVamcSystemDetailPage entity not found for id: ${opts.id}`
    )
  }

  // TODO: There seems to be some difference between a "facilitySidebar" and "outreachSidebar" in the original template

  // Fetch the menu name dynamically off of the field_region_page reference if available.
  const menu = await getMenu(
    entity.field_office.field_system_menu.resourceIdObjMeta
      .drupal_internal__target_id
  )

  return { entity, menu, lovell: opts.context?.lovell }
}

export const formatter: QueryFormatter<
  VamcSystemDetailPageData,
  VamcSystemDetailPage
> = ({ entity, menu, lovell }) => {
  return {
    ...entityBaseFields(entity),
    breadcrumbs: lovell?.isLovellVariantPage
      ? getLovellVariantOfBreadcrumbs(entity.breadcrumbs, lovell.variant)
      : entity.breadcrumbs,
    title: entity.title,
    path: entity.path.alias,
    introText: entity.field_intro_text,
    showTableOfContents: entity.field_table_of_contents_boolean,
    menu: buildSideNavDataFromMenu(entity.path.alias, menu),
    administration: formatAdministration(entity.field_administration),
    vamcEhrSystem: entity.field_office?.field_vamc_ehr_system || null,
    relatedLinks: entity.field_related_links
      ? formatListOfLinkTeasers(entity.field_related_links)
      : null,
    lovellVariant: lovell?.variant ?? null,
    lovellSwitchPath: lovell?.isLovellVariantPage
      ? getLovellVariantOfUrl(
          entity.path.alias,
          getOppositeChildVariant(lovell?.variant)
        )
      : null,
  }
}
