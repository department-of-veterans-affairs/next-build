import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeOffice } from '@/types/drupal/node'
import { OutreachHub } from './formatted-type'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import { fetchSingleEntityOrPreview, getMenu } from '@/lib/drupal/query'
import { Menu } from '@/types/drupal/menu'
import { buildSideNavDataFromMenu } from '@/lib/drupal/facilitySideNav'
import { getHtmlFromField } from '@/lib/utils/getHtmlFromField'
import { entityBaseFields } from '@/lib/drupal/entityBaseFields'

export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams()
}

export type OutreachHubDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

type OutreachHubData = {
  entity: NodeOffice
  menu: Menu | null
}

export const data: QueryData<OutreachHubDataOpts, OutreachHubData> = async (
  opts
): Promise<OutreachHubData> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.OFFICE,
    params
  )) as NodeOffice

  // Fetch the outreach-and-events menu
  const menu = await getMenu('outreach-and-events')

  return { entity, menu }
}

export const formatter: QueryFormatter<OutreachHubData, OutreachHub> = ({
  entity,
  menu,
}) => {
  return {
    ...entityBaseFields(entity),
    title: entity.title,
    description: entity.field_description || null,
    body: getHtmlFromField(entity.field_body),
    menu: menu ? buildSideNavDataFromMenu(entity.path.alias, menu) : null,
  }
}
