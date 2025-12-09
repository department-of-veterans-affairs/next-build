import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeVaForm } from '@/types/drupal/node'
import { Alert as AlertParagraph } from '@/components/alert/formatted-type'
import { VaForm } from './formatted-type'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import { fetchSingleEntityOrPreview } from '@/lib/drupal/query'
import { getHtmlFromField } from '@/lib/utils/getHtmlFromField'
import { formatter as formatLinkTeaser } from '@/components/linkTeaser/query'
import { entityBaseFields } from '@/lib/drupal/entityBaseFields'
import { formatter as formatAlertBlock } from '@/components/alertBlock/query'

// Define the query params for fetching node--va_form.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_va_form_link_teasers',
    'field_va_form_administration',
    'field_benefit_categories',
    'field_va_form_related_forms',
    'field_alert.field_alert_content',
  ])
}

// Define the option types for the data loader.
export type VaFormDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Implement the data loader.
export const data: QueryData<VaFormDataOpts, NodeVaForm> = async (
  opts
): Promise<NodeVaForm> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.VA_FORM,
    params
  )) as NodeVaForm

  return entity
}

export const formatter: QueryFormatter<NodeVaForm, VaForm> = (
  entity: NodeVaForm
) => {
  return {
    ...entityBaseFields(entity),
    formName: entity.field_va_form_name,
    formNumber: entity.field_va_form_number,
    formTitle: entity.field_va_form_title,
    formLanguage: entity.field_va_form_language ?? null,
    revisionDate: entity.field_va_form_revision_date,
    issueDate: entity.field_va_form_issue_date,
    formType: entity.field_va_form_type,
    benefitCategories: entity.field_benefit_categories?.map(
      (category) => category.field_home_page_hub_label
    ),
    administration: entity.field_va_form_administration?.name,
    // alertBlock: coerceAlertBlockContentToParagraph(entity.field_alert),
    alertBlock: formatAlertBlock(entity.field_alert),
    formUrl: entity.field_va_form_url,
    toolUrl: entity.field_va_form_tool_url ?? null,
    toolIntro: entity.field_va_form_tool_intro ?? null,
    usage: getHtmlFromField(entity.field_va_form_usage),
    linkTeasers: entity.field_va_form_link_teasers?.map(formatLinkTeaser),
    relatedForms: entity.field_va_form_related_forms?.map((form) => ({
      id: form.id,
      formNumber: form.field_va_form_number ?? null,
      formName: form.field_va_form_name ?? null,
    })),
  }
}
