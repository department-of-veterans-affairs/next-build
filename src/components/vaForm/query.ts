import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeVaForm } from '@/types/drupal/node'
import { VaForm } from './formatted-type'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'

// Define the query params for fetching node--va_form.
export const params: QueryParams<null> = () => {
  return (
    new DrupalJsonApiParams()
      // uncomment to add referenced entity data to the response
      .addInclude(['field_va_form_link_teasers'])
  )
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
    numPages: entity.field_va_form_num_pages,
    revisionDate: entity.field_va_form_revision_date,
    issueDate: entity.field_va_form_issue_date,
    formUrl: entity.field_va_form_url,
    toolUrl: entity.field_va_form_tool_url,
    toolIntro: entity.field_va_form_tool_intro,
    usage: entity.field_va_form_usage,
    linkTeasers: entity.field_va_form_link_teasers?.map((teaser) => ({
      link: teaser.field_link,
      summary: teaser.field_link_summary,
    })),
    relatedForms: entity.field_va_form_related_forms?.map((form) => ({
      id: form.id,
      formNumber: form.field_va_form_number,
      formName: form.field_va_form_name,
    })),
  }
}
