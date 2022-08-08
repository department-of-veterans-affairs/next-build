import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { EntityMetaInfo } from '@/lib/delegators/entityMetaProvider'
import { NodeResourceType } from '@/types/node'
import { Banner, BannerProps } from '@/components/banner'

export const transformBannerDataService = (entity): BannerProps => {
  if (!entity.bannerData) {
    return null
  }
  const [banner] = entity.bannerData
  const resources = {
    id: banner.id || '',
    title: banner.title || '',
    path: banner.path?.alias || '',
    body: banner.body?.processed || '',
    alertType: banner.field_alert_type || '',
    dismiss: banner.field_dismissible_option || true,
  }

  return {
    ...resources,
  }
}

/** All nodes end with NodeMetaInfo: the name of the resource, the name of the component, and the parameters necessary for calling the resource. */
const params = new DrupalJsonApiParams().addPageLimit(10)

/** Export information necessary to identify the component and query it.
 * See {@link EntityMetaInfo}
 */
export const Meta: EntityMetaInfo = {
  resource: NodeResourceType.Banner,
  component: Banner,
  dataService: transformBannerDataService,
  params: params,
}
