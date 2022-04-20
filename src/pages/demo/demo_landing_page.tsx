import { drupalClient } from '@/utils/drupalClient'
import BenefitsHubLink from '@/components/node/landing_page'

const DemoPage = ({ node }) => {
    if (!node) node = {}
    return <BenefitsHubLink node={node} />
}
export default DemoPage

export async function getStaticProps(context) {
    const nodes = await drupalClient.getResourceCollectionFromContext(
        'node--landing_page',
        context,
        {
            params: {
                sort: '-created',
                'filter[status][value]': '1',
            },
        }
    )
    return {
        props: {
            node: nodes[0] || null,
        },
    }
}
