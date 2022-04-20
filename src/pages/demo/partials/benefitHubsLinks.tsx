import { drupalClient } from '@/utils/drupalClient'
import BenefitsHubLinks from '@/components/partials/benefitHubsLinks'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

const DemoPage = ({ nodes }) => {
  return nodes.map((node) => (
    <>
      (for <strong>{node.title}</strong>)
      <BenefitsHubLinks
        key={node.uuid}
        nodes={node.field_related_benefit_hubs}
      />
      <hr />
    </>
  ))
}
export default DemoPage

export async function getStaticProps(context) {
  const params = new DrupalJsonApiParams()
  params
    .addFilter('status', '1')
    .addFilter('field_related_benefit_hubs', null, 'IS NOT NULL')
    .addInclude(['field_related_benefit_hubs'])

  const nodes = await drupalClient.getResourceCollectionFromContext(
    'node--support_resources_detail_page',
    context,
    {
      params: {
        include: 'field_related_benefit_hubs',
        sort: '-created',
        'filter[status][value]': '1',
      },
    }
  )
  return {
    props: {
      nodes: nodes || null,
    },
  }
}
