import { drupalClient } from '@/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { BlockAlert, BlockContentResourceType } from '@/types/block'
import Container from '@/components/container'
import { BlockContent } from '@/components/block'

interface AlertPageProps {
  alerts: BlockAlert[]
}

const AlertPage = ({ alerts }: AlertPageProps) => {
  if (!alerts) alerts = []

  return (
    <>
      <Container className="container">
        {alerts.map((alert) => (
          <BlockContent key={alert.id} blockContent={alert} />
        ))}
      </Container>
    </>
  )
}

export default AlertPage

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<AlertPageProps>> {
  const params = new DrupalJsonApiParams().addInclude(['field_alert_content'])
  params.addPageLimit(30)

  const alerts = await drupalClient.getResourceCollectionFromContext<
    BlockAlert[]
  >(BlockContentResourceType.Alert, context, {
    params: params.getQueryObject(),
  })

  return {
    props: {
      alerts,
    },
  }
}
