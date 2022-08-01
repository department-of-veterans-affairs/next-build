import { drupalClient } from '@/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { BlockAlert, BlockContentResourceType } from '@/types/block'
import Container from '@/components/container'
import { AlertBlock } from '@/components/alert'
import { generalEntityDataService } from '@/lib/delegators/generalEntityDataService'

interface AlertPageProps {
  alerts: any
}

const AlertPage = ({ alerts }: AlertPageProps) => {
  return (
    <>
      <Container className="container">
        {alerts.map((alert) => (
          <AlertBlock key={alert.id} {...alert} />
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

  const alertCollection = await drupalClient.getResourceCollectionFromContext<
    BlockAlert[]
  >(BlockContentResourceType.Alert, context, {
    params: params.getQueryObject(),
  })

  const alerts = generalEntityDataService(alertCollection)

  return {
    props: {
      alerts,
    },
  }
}
