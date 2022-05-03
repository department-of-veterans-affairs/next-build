import { v4 as uuidv4 } from 'uuid'
import { drupalClient } from '@/utils/drupalClient'
import {
  PersonProfile,
  StaffProfile,
  StaffNewsProfile,
} from '@/components/node/person_profile'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import Container from '@/components/container'

const PersonProfilePage = ({ nodes }) => {
  if (!nodes) return
  return (
    <>
      <Container className="container">
        {nodes.map((node) => (
          <div key={uuidv4()}>
            <PersonProfile node={node} />
            <StaffProfile node={node} />
            <StaffNewsProfile node={node} />
          </div>
        ))}
      </Container>
    </>
  )
}

export default PersonProfilePage

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
