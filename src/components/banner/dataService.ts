import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
// import { generalEntityDataService } from '@/lib/delegators/generalEntityDataService'
import { EntityMetaInfo } from '@/lib/delegators/entityMetaProvider'
import { NodeResourceType } from '@/types/node'
import { Banner, BannerProps } from '@/components/banner'

export const transformBannerDataService = (entity): BannerProps => {
  if (!entity.bannerData) {
    return null
  }
  entity = entity.bannerData[0]
  const resources = {
    id: entity.id,
    title: entity.title,
    path: entity.path?.alias,
    body: entity.body?.processed,
    alertType: entity.field_alert_type,
    dismiss: entity.field_dismissible_option,
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
