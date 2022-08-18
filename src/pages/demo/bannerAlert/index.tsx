import { drupalClient } from '@/lib/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import {
  NodeBannerAlert,
  NodeResourceType,
} from '@/types/dataTypes/drupal/node'
import Container from '@/templates/common/container'
import { BannerAlert } from '@/templates/globals/banners/facilityBanner'

interface BannerAlertPageProps {
  bannerAlerts: NodeBannerAlert[]
}

const BannerAlertPage = ({ bannerAlerts }: BannerAlertPageProps) => {
  return (
    <>
      <Container className="container">
        {bannerAlerts
          ? bannerAlerts.map((node) => (
              <div key={node.id}>
                <BannerAlert node={node} />
              </div>
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
    NodeBannerAlert[]
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
