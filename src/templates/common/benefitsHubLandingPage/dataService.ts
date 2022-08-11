import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { EntityMetaInfo } from '@/data/delegators/entityMetaProvider'
import { NodeResourceType, NodeSupportResourcesDetailPage } from '@/types/dataTypes/drupal/node'
import { BenefitsHubLandingPage, RelatedBenefitHubProp } from './index'

export const transformBenefitsHubLandingPageDataService = function (
  entity: NodeSupportResourcesDetailPage
) {
  if (!entity.field_related_benefit_hubs) return null

  const relatedBenefitHubsCollection = entity.field_related_benefit_hubs.map(
    (relatedBenefitHub): RelatedBenefitHubProp => ({
      id: relatedBenefitHub.id,
      url: relatedBenefitHub.path?.alias || '',
      title: relatedBenefitHub.title || '',
      homePageHubLabel: relatedBenefitHub.field_home_page_hub_label || '',
      teaserText: relatedBenefitHub.field_teaser_text || '',
    })
  )

  return {
    id: entity.id,
    title: entity.title,
    introText: entity.field_intro_text_limited_html?.processed || '',
    relatedBenefitHubs: relatedBenefitHubsCollection,
  }
}

/** All nodes end with NodeMetaInfo: the name of the resource, the name of the component, and the parameters necessary for calling the resource. */
const params = new DrupalJsonApiParams()
  .addFilter('status', '1')
  .addFilter('field_related_benefit_hubs', null, 'IS NOT NULL')
  .addSort('created', 'DESC')
  .addInclude(['field_related_benefit_hubs'])

/** Export information necessary to identify the component and query it.
 * See {@link EntityMetaInfo}
 */
export const Meta: EntityMetaInfo = {
  resource: NodeResourceType.SupportResourcesDetailPage,
  component: BenefitsHubLandingPage,
  dataService: transformBenefitsHubLandingPageDataService,
  params: params,
}
