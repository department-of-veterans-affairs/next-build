import { drupalClient } from '@/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalNode } from 'next-drupal'
import { BenefitsHubLinks } from '@/components/partials/benefitHubsLinks'
import Container from '@/components/container'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

interface BenefitsHubLinksProps {
  nodes: DrupalNode[]
}

const DemoPage = ({ nodes }: BenefitsHubLinksProps) => {
  return nodes.map((node) => (
    <div key={node?.id}>
      <Container className="container">
        (on <strong>{node?.title}</strong>)
        <BenefitsHubLinks nodes={node?.field_related_benefit_hubs} />
        <hr />
      </Container>
    </div>
  ))
}
export default DemoPage

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<BenefitsHubLinksProps>> {
  const params = new DrupalJsonApiParams()
  params
    .addFilter('status', '1')
    .addFilter('field_related_benefit_hubs', null, 'IS NOT NULL')
    .addSort('created', 'DESC')
    .addInclude(['field_related_benefit_hubs'])

  const nodes = await drupalClient.getResourceCollectionFromContext<
    DrupalNode[]
  >('node--support_resources_detail_page', context, {
    params: params.getQueryObject(),
  })
  return {
    props: {
      nodes: nodes || null,
    },
  }
}
