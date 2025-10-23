import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeBenefitsDetailPage } from '@/types/drupal/node'
import { BenefitsDetailPage } from './formatted-type'
import {
  RESOURCE_TYPES,
  // PARAGRAPH_RESOURCE_TYPES,
} from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'
import { formatter as formatListOfLinkTeasers } from '@/components/listOfLinkTeasers/query'
import { formatter as formatAdministration } from '@/components/administration/query'
import { formatter as formatAlertBlock } from '@/components/alertBlock/query'
import { formatParagraph } from '@/lib/drupal/paragraphs'
// import { getNestedIncludes } from '@/lib/utils/queries'
import { getHtmlFromField } from '@/lib/utils/getHtmlFromField'

// Define the query params for fetching node--page (benefits detail page).
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_administration',
    'field_alert',
    'field_related_links',
    'field_related_links.field_va_paragraphs',
    // ...getNestedIncludes('field_content_block', PARAGRAPH_RESOURCE_TYPES.QA),
    // ...getNestedIncludes('field_featured_content', PARAGRAPH_RESOURCE_TYPES.QA),
  ])
}

// Define the option types for the data loader.
export type BenefitsDetailPageDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Implement the data loader.
export const data: QueryData<
  BenefitsDetailPageDataOpts,
  NodeBenefitsDetailPage
> = async (opts): Promise<NodeBenefitsDetailPage> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.BENEFITS_DETAIL_PAGE,
    params
  )) as NodeBenefitsDetailPage

  return entity
}

export const formatter: QueryFormatter<
  NodeBenefitsDetailPage,
  BenefitsDetailPage
> = (entity: NodeBenefitsDetailPage) => {
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
    // featuredContent:
    //   entity.field_featured_content?.map((paragraph) =>
    //     formatParagraph(paragraph)
    //   ) || null,
    // contentBlock:
    //   entity.field_content_block?.map((paragraph) =>
    //     formatParagraph(paragraph)
    //   ) || null,
    relatedLinks,
    administration: entity.field_administration
      ? formatAdministration(entity.field_administration)
      : null,
  }
}
