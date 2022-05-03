import { v4 as uuidv4 } from 'uuid'
import { drupalClient } from '@/utils/drupalClient'
import {
  PersonProfile,
  StaffProfile,
  StaffNewsProfile,
} from '@/components/node/person_profile'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import Container from '@/components/container'

const PersonProfilePage = ({ staffProfiles, personProfiles }) => {
  return (
    <>
      <Container className="container">
        {personProfiles
          ? personProfiles.map((node) => (
              <div key={uuidv4()}>
                <PersonProfile node={node} />
                <StaffNewsProfile node={node} />
              </div>
            ))
          : null}

        {staffProfiles
          ? staffProfiles.map((paragraph) => (
              <div key={uuidv4()}>
                <StaffProfile paragraph={paragraph} />
              </div>
            ))
          : null}
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

  const personProfiles = await drupalClient.getResourceCollectionFromContext(
    'node--person_profile',
    context,
    {
      params: {
        include:
          'field_office, field_media, field_media.thumbnail, field_media.image',

        page: {
          limit: 5,
        },
      },
    }
  )

  const staffProfiles = await drupalClient.getResourceCollectionFromContext(
    'paragraph--staff_profile',
    context,
    {
      params: {
        include:
          'field_staff_profile, field_staff_profile.field_media, field_staff_profile.field_media.thumbnail, field_staff_profile.field_media.image',
        page: {
          limit: 5,
        },
      },
    }
  )

  return {
    props: {
      personProfiles: personProfiles || null,
      staffProfiles: staffProfiles || null,
    },
  }
}
