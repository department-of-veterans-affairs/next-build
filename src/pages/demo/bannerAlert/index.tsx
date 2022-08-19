import { drupalClient } from '@/lib/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import {
  NodeFullWidthBannerAlert,
  NodeResourceType,
} from '@/types/dataTypes/drupal/node'
import Container from '@/templates/common/container'
import { FacilityBannerType } from '@/types/index'
import { FacilityBanner } from '@/templates/globals/banners/facilityBanner'

interface BannerAlertPageProps {
  bannerAlerts: FacilityBannerType[]
}

const BannerAlertPage = ({ bannerAlerts }: BannerAlertPageProps) => {
  return (
    <>
      <Container className="container">
        {bannerAlerts
          ? bannerAlerts.map((node) => (
              <FacilityBanner key={node.id} {...node} />
            ))
          : null}
      </Container>
    </>
  )
}

export default BannerAlertPage

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<BannerAlertPageProps>> {
  const params = new DrupalJsonApiParams()
  params.addInclude([
    'field_banner_alert_vamcs',
    'field_banner_alert_vamcs.field_office',
  ])

  params.addFilter('status', '1')
  params.addPageLimit(3)

  let bannerAlerts = await drupalClient.getResourceCollectionFromContext<
    NodeFullWidthBannerAlert[]
  >(NodeResourceType.BannerAlert, context, {
    params: params.getQueryObject(),
  })
  if (!bannerAlerts) bannerAlerts = []

  return {
    props: {
      bannerAlerts,
    },
  }
}
