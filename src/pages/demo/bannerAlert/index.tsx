import { drupalClient } from '@/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeBannerAlert, NodeResourceType } from '@/types/node'
import safeJsonStringify from 'safe-json-stringify'
import Container from '@/components/container'
import BannerAlert from '@/components/node/banner_alert'

interface BannerAlertPageProps {
  parsedBannerAlerts: NodeBannerAlert[]
}

const BannerAlertPage = ({ parsedBannerAlerts }: BannerAlertPageProps) => {
  return (
    <>
      <Container className="container">
        {parsedBannerAlerts
          ? parsedBannerAlerts.map((node) => (
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
  params.addFilter('field_banner_alert_vamcs', null, 'IS NOT NULL')
  params.addFilter('status', '1')
  params.addPageLimit(50)

  const bannerAlerts = await drupalClient.getResourceCollectionFromContext<
    NodeBannerAlert[]
  >(NodeResourceType.BannerAlert, context, {
    params: params.getQueryObject(),
  })

  const stringifyData = safeJsonStringify(bannerAlerts)
  const parsedBannerAlerts = JSON.parse(stringifyData)

  return {
    props: {
      parsedBannerAlerts,
    },
  }
}
