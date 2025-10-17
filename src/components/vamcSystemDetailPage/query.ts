import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { NodeVamcSystemDetailPage } from '@/types/drupal/node'
import { VamcSystemDetailPage } from './formatted-type'
import { formatter as formatListOfLinkTeasers } from '@/components/listOfLinkTeasers/query'
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
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { Menu } from '@/types/drupal/menu'
import { buildSideNavDataFromMenu } from '@/lib/drupal/facilitySideNav'
import {
  getLovellVariantOfBreadcrumbs,
  getLovellVariantOfUrl,
  getOppositeChildVariant,
} from '@/lib/drupal/lovell/utils'
import { formatter as formatAdministration } from '@/components/administration/query'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { formatParagraph } from '@/lib/drupal/paragraphs'
import { getNestedIncludes } from '@/lib/utils/queries'

export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_administration',
    'field_office',
    'field_related_links',
    'field_related_links.field_va_paragraphs',
    ...getNestedIncludes('field_featured_content', PARAGRAPH_RESOURCE_TYPES.QA),
  ])
  // I would like to be able to use just these recursive fields, but it doesn't seem to
  // work, at least with this version of Drupal. According to the documentation here
  // https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module/fetching-resources-get#s-get-article-media-entity-reference-field-image-url-uri-by-including-references
  // there's an "older syntax" and "new syntax" for the query string this produces.
  // .addFields('paragraph--list_of_link_teasers', ['field_va_paragraphs'])
  // .addFields('paragraph--collapsible_panel', ['field_va_paragraphs'])
  // .addFields('paragraph--q_a', ['field_answer'])
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
  hasLovellCounterpart: boolean
  lovell?: ExpandedStaticPropsContext['lovell']
}

// Implement the data loader.
export const data: QueryData<
  VamcSystemDetailPageDataOpts,
  VamcSystemDetailPageData
> = async (opts): Promise<VamcSystemDetailPageData> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.VAMC_SYSTEM_DETAIL_PAGE,
    params
  )) as NodeVamcSystemDetailPage

  if (!entity) {
    throw new Error(
      `NodeVamcSystemDetailPage entity not found for id: ${opts.id}`
    )
  }

  // TODO: There seems to be some difference between a "facilitySidebar" and "outreachSidebar" in the original template

  // Determine if there is a Lovell counterpart to this page so we can show or hide the Lovell switcher
  let hasLovellCounterpart = false
  if (opts.context?.lovell?.isLovellVariantPage) {
    try {
      const counterpartPath = getLovellVariantOfUrl(
        entity.path.alias,
        getOppositeChildVariant(opts.context?.lovell?.variant)
      )
      hasLovellCounterpart =
        (await drupalClient.translatePath(counterpartPath)) !== null
    } catch (error) {
      // If we're using proxy-fetcher, it'll actually throw an error for these
      if ([404, 403].includes(error.cause?.status)) {
        hasLovellCounterpart = false
      } else {
        throw error
      }
    }
  }

  // Fetch the menu name dynamically off of the field_region_page reference if available.
  const menu = await getMenu(
    entity.field_office.field_system_menu.resourceIdObjMeta
      .drupal_internal__target_id
  )

  return { entity, menu, lovell: opts.context?.lovell, hasLovellCounterpart }
}

export const formatter: QueryFormatter<
  VamcSystemDetailPageData,
  VamcSystemDetailPage
> = ({ entity, menu, lovell, hasLovellCounterpart }) => {
  // For this particular content type, which can be bifurcated, the entity path doesn't
  // always match the path of the page; it could be the opposite Lovell variant's path.
  const normalizedPath = lovell?.isLovellVariantPage
    ? getLovellVariantOfUrl(entity.path.alias, lovell.variant)
    : entity.path.alias

  return {
    ...entityBaseFields(entity),
    breadcrumbs: lovell?.isLovellVariantPage
      ? getLovellVariantOfBreadcrumbs(entity.breadcrumbs, lovell.variant)
      : entity.breadcrumbs,
    title: entity.title,
    path: normalizedPath,
    introText: entity.field_intro_text,
    showTableOfContents: entity.field_table_of_contents_boolean,
    menu: buildSideNavDataFromMenu(normalizedPath, menu),
    administration: formatAdministration(entity.field_administration),
    vamcEhrSystem: entity.field_office?.field_vamc_ehr_system || null,
    vamcSystem: {
      path: entity.field_office?.path.alias || null,
    },
    featuredContent:
      entity.field_featured_content?.map((paragraph) =>
        formatParagraph(paragraph)
      ) || null,
    relatedLinks: entity.field_related_links
      ? formatListOfLinkTeasers(entity.field_related_links)
      : null,
    lovellVariant: lovell?.variant ?? null,
    lovellSwitchPath: lovell?.isLovellVariantPage
      ? getLovellVariantOfUrl(
          normalizedPath,
          getOppositeChildVariant(lovell?.variant)
        )
      : null,
    showLovellSwitcher: hasLovellCounterpart,
  }
}
