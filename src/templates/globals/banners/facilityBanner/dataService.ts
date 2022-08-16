import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { EntityMetaInfo } from '@/data/delegators/entityMetaProvider'
import { NodeResourceType } from '@/types/dataTypes/drupal/node'
import { FacilityBanner } from '@/templates/globals/banners/facilityBanner'
import { formatter } from '@/data/queries/banners'

/** All nodes end with NodeMetaInfo: the name of the resource, the name of the component, and the parameters necessary for calling the resource. */
const params = new DrupalJsonApiParams().addInclude([
  'field_banner_alert_vamcs.field_office',
])

/** Export information necessary to identify the component and query it.
 * See {@link EntityMetaInfo}
 */

export const Meta: EntityMetaInfo = {
  resource: NodeResourceType.BannerAlert,
  component: FacilityBanner,
  dataService: formatter,
  params: params,
}
