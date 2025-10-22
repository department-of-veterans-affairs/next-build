import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { NodeCampaignLandingPage } from '@/types/drupal/node'
import { CampaignLandingPage } from './formatted-type'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import { getFacebookLink, getXLink } from '@/lib/utils/social'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'
import { formatter as formatImage } from '@/components/mediaImage/query'

// Define the query params for fetching node--campaign_landing_page.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_primary_call_to_action',
    'field_secondary_call_to_action',
    'field_hero_image',
    'field_hero_image.image',
    'field_clp_audience',
    'field_connect_with_us',
  ])
}

// Define the option types for the data loader.
export type CampaignLandingPageDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Implement the data loader.
export const data: QueryData<
  CampaignLandingPageDataOpts,
  NodeCampaignLandingPage
> = async (opts): Promise<NodeCampaignLandingPage> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.CAMPAIGN_LANDING_PAGE,
    params
  )) as NodeCampaignLandingPage

  return entity
}

export const formatter: QueryFormatter<
  NodeCampaignLandingPage,
  CampaignLandingPage
> = (entity: NodeCampaignLandingPage) => {
  const pageUrl = entity.field_connect_with_us?.field_external_link?.url
    ? `${entity.field_connect_with_us.field_external_link.url.replace(/\/$/, '')}${entity.path.alias}`
    : null

  return {
    ...entityBaseFields(entity),
    breadcrumbs: null, // hide breadcrumb on the page
    hero: {
      blurb: entity.field_hero_blurb,
      image: {
        ...formatImage(entity.field_hero_image),

        /* Empty alt expected per requirements
         * https://github.com/department-of-veterans-affairs/va.gov-cms/issues/22439
         */
        alt: '',
      },
    },
    cta: {
      primary: entity.field_primary_call_to_action
        ? {
            href: entity.field_primary_call_to_action.field_button_link.url,
            label: entity.field_primary_call_to_action.field_button_label,
          }
        : null,
      secondary: entity.field_secondary_call_to_action
        ? {
            href: entity.field_secondary_call_to_action.field_button_link.url,
            label: entity.field_secondary_call_to_action.field_button_label,
          }
        : null,
    },
    whyThisMatters: entity.field_clp_why_this_matters,
    audience: entity.field_clp_audience.map((audience) => ({
      name: audience.name,
    })),
    socialLinks: entity.field_connect_with_us
      ? [getFacebookLink(pageUrl), getXLink(pageUrl, entity.title)]
      : [],
  }
}
