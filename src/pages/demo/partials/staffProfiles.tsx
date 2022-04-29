import { drupalClient } from '@/utils/drupalClient'
import { PersonProfile } from '@/components/node/person_profile'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import Container from '@/components/container'

const StaffProfilePage = ({ nodes }) => {
  if (!nodes) return
  return (
    <>
      <Container className="container">
        <div id="content" className="interior">
          <main className="va-l-detail-page va-facility-page">
            <div className="usa-grid usa-grid-full">
              <div className="usa-width-three-fourths">
                {nodes.map((node, index) => (
                  <div key={index}>
                    <PersonProfile node={node} />
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </Container>
    </>
  )
}

export default StaffProfilePage

export async function getStaticProps(context) {
  const params = new DrupalJsonApiParams()
  params
    .addFilter('status', '1')
    .addFilter('field_office', null, 'IS NOT NULL')
    .addFilter('field_media', null, 'IS NOT NULL')
    .addInclude(['field_office', 'field_media'])

  const nodes = await drupalClient.getResourceCollectionFromContext(
    'node--person_profile',
    context,
    {
      params: {
        include:
          'field_office, field_media, field_media.thumbnail, field_media.image',
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
