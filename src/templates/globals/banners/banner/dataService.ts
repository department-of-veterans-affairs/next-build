import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { EntityMetaInfo } from '@/data/delegators/entityMetaProvider'
import { NodeResourceType } from '@/types/dataTypes/drupal/node'
import { Banner, BannerProps } from '@/templates/globals/banners/banner'

export const transformBannerDataService = (entity): BannerProps => {
  if (!entity.bannerData) {
    return null
  }
  return entity.bannerData.map((banner) => ({
    id: banner.id,
    title: banner.title,
    body: banner.body?.processed || null,
    alertType: banner.field_alert_type || null,
    dismiss: banner.field_dismissible_option || null,
  }))
}

/** All nodes end with NodeMetaInfo: the name of the resource, the name of the component, and the parameters necessary for calling the resource. */
const params = new DrupalJsonApiParams()

/** Export information necessary to identify the component and query it.
 * See {@link EntityMetaInfo}
 */
export const Meta: EntityMetaInfo = {
  resource: NodeResourceType.Banner,
  component: Banner,
  dataService: transformBannerDataService,
  params: params,
}
