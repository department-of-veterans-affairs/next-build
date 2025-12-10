import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeBenefitsDetailPage } from '@/types/drupal/node'
import { BenefitsDetailPage } from './formatted-type'
import {
  PARAGRAPH_RESOURCE_TYPES,
  RESOURCE_TYPES,
  // PARAGRAPH_RESOURCE_TYPES,
} from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import { fetchSingleEntityOrPreview } from '@/lib/drupal/query'
import { Menu } from '@/types/drupal/menu'
import { formatter as formatListOfLinkTeasers } from '@/components/listOfLinkTeasers/query'
import { formatter as formatAdministration } from '@/components/administration/query'
import { formatter as formatAlertBlock } from '@/components/alertBlock/query'
import { getNestedIncludes } from '@/lib/utils/queries'
import { getHtmlFromField } from '@/lib/utils/getHtmlFromField'
import { buildSideNavDataFromMenu } from '@/lib/drupal/facilitySideNav'
import { getBenefitsHubMenu } from './getBenefitsHubMenu'
import { entityBaseFields } from '@/lib/drupal/entityBaseFields'
import { formatParagraph } from '@/lib/drupal/paragraphs'

// Define the query params for fetching node--page (benefits detail page).
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_administration',
    'field_related_links',
    ...getNestedIncludes(
      'field_related_links',
      PARAGRAPH_RESOURCE_TYPES.LIST_OF_LINK_TEASERS
    ),
    ...getNestedIncludes('field_alert', 'block--alert'),
    ...getNestedIncludes('field_featured_content', PARAGRAPH_RESOURCE_TYPES.QA),
    ...getNestedIncludes('field_content_block', [
      PARAGRAPH_RESOURCE_TYPES.QA_SECTION,
      PARAGRAPH_RESOURCE_TYPES.LIST_OF_LINK_TEASERS,
      PARAGRAPH_RESOURCE_TYPES.COLLAPSIBLE_PANEL,
      PARAGRAPH_RESOURCE_TYPES.DOWNLOADABLE_FILE,
      PARAGRAPH_RESOURCE_TYPES.ALERT,
      PARAGRAPH_RESOURCE_TYPES.MEDIA,
    ]),
  ])
}

// Define the option types for the data loader.
export type BenefitsDetailPageDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

interface BenefitsDetailPageData {
  entity: NodeBenefitsDetailPage
  menu: Menu | null
  menuIcon: { name: string; backgroundColor: string } | null
}

// Implement the data loader.
export const data: QueryData<
  BenefitsDetailPageDataOpts,
  BenefitsDetailPageData
> = async (opts): Promise<BenefitsDetailPageData> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.BENEFITS_DETAIL_PAGE,
    params
  )) as NodeBenefitsDetailPage

  // Use the new getBenefitsHubMenu function that fetches the benefits hub node,
  // caches it, and extracts the menu and icon from the actual hub data
  const { menu, menuIcon } = await getBenefitsHubMenu(
    entity.path.alias,
    entity.field_administration?.name,
    opts.context
  )

  return { entity, menu, menuIcon }
}

export const formatter: QueryFormatter<
  BenefitsDetailPageData,
  BenefitsDetailPage
> = ({ entity, menu, menuIcon }) => {
  // TODO: There is an ownership problem with the related links for /education/benefit-rates/post-9-11-gi-bill-rates/past-rates-2021-2022.
  // This needs to be resolved in Drupal, but for now I'm just going to not show the related links
  // if it fails to fetch it.
  let relatedLinks = null
  if (
    entity.field_related_links &&
    entity.field_related_links.field_va_paragraphs
  ) {
    relatedLinks = formatListOfLinkTeasers(entity.field_related_links)
  }

  return {
    ...entityBaseFields(entity),
    title: entity.title,
    description: entity.field_description || null,
    introText: getHtmlFromField(entity.field_intro_text_limited_html) || null,
    showTableOfContents: entity.field_table_of_contents_boolean ?? false,
    alert: entity.field_alert ? formatAlertBlock(entity.field_alert) : null,
    featuredContent:
      entity.field_featured_content?.map((paragraph) =>
        formatParagraph(paragraph)
      ) || null,
    mainContent: entity.field_content_block.map((p) => formatParagraph(p)),
    relatedLinks,
    administration: entity.field_administration
      ? formatAdministration(entity.field_administration)
      : null,
    menu: menu ? buildSideNavDataFromMenu(entity.path.alias, menu) : null,
    menuIcon,
  }
}
