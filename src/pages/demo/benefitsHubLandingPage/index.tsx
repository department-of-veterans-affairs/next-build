import { drupalClient } from '@/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import Container from '@/components/container'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeResourceType, NodeSupportResourcesDetailPage } from '@/types/node'
import { BenefitsHubLandingPage } from '@/components/benefitsHubLandingPage'
import { generalEntityDataService } from '@/lib/delegators/generalEntityDataService'

interface BenefitsHubLandingPageProps {
  benefitsHubCollectionProps: any
}

const BenefitsHubPage = ({
  benefitsHubCollectionProps,
}: BenefitsHubLandingPageProps) => {
  if (!benefitsHubCollectionProps) benefitsHubCollectionProps = []

  return benefitsHubCollectionProps.map((benefitsHubProp) => (
    <>
      <Container className="container">
        <BenefitsHubLandingPage {...benefitsHubProp} />
        <hr />
      </Container>
    </>
  ))
}
export default BenefitsHubPage

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<BenefitsHubLandingPageProps>> {
  const params = new DrupalJsonApiParams()
  params
    .addFilter('status', '1')
    .addFilter('field_related_benefit_hubs', null, 'IS NOT NULL')
    .addSort('created', 'DESC')
    .addInclude(['field_related_benefit_hubs'])

  const benefitsHubCollection =
    await drupalClient.getResourceCollectionFromContext<
      NodeSupportResourcesDetailPage[]
    >(NodeResourceType.SupportResourcesDetailPage, context, {
      params: params.getQueryObject(),
    })

  const benefitsHubCollectionProps = generalEntityDataService(
    benefitsHubCollection
  )

  return {
    props: {
      benefitsHubCollectionProps,
    },
  }
}
