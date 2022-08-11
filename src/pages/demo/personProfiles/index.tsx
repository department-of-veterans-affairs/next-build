import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { drupalClient } from '@/lib/utils/drupalClient'
import { PersonProfile, StaffNewsProfile } from '@/templates/components/personProfile'
import { StaffProfile, StaffProfileProps } from '@/templates/layouts/staffProfile'
import { transformStaffProfileData } from '@/templates/layouts/staffProfile/dataService'
import Container from '@/templates/common/container'
import { ParagraphResourceType, ParagraphStaffProfile } from '@/types/dataTypes/drupal/paragraph'
import { NodePersonProfile, NodeResourceType } from '@/types/dataTypes/drupal/node'

interface ProfilePageProps {
  staffProfiles: StaffProfileProps[]
  personProfiles: NodePersonProfile[]
}

const PersonProfilePage = ({
  staffProfiles,
  personProfiles,
}: ProfilePageProps) => {
  return (
    <>
      <Container className="container">
        {personProfiles
          ? personProfiles.map((node) => (
              <div key={node.id}>
                <PersonProfile node={node} />
                <StaffNewsProfile
                  title={node.title}
                  description={node.field_description}
                />
              </div>
            ))
          : null}

        {staffProfiles
          ? staffProfiles.map((paragraphStaffProfile) => (
              <div key={paragraphStaffProfile.id}>
                <StaffProfile {...paragraphStaffProfile} />
              </div>
            ))
          : null}
      </Container>
    </>
  )
}

export default PersonProfilePage

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<ProfilePageProps>> {
  const personProfiles = await drupalClient.getResourceCollectionFromContext<
    NodePersonProfile[]
  >(NodeResourceType.PersonProfile, context, {
    params: {
      include: 'field_media, field_media.thumbnail, field_media.image',
      sort: '-created',
      'filter[status][value]': '1',
      page: {
        limit: 5,
      },
    },
  })

  const staffProfiles = await drupalClient.getResourceCollectionFromContext<
    ParagraphStaffProfile[]
  >(ParagraphResourceType.StaffProfile, context, {
    params: {
      include:
        'field_staff_profile, field_staff_profile.field_media, field_staff_profile.field_media.thumbnail, field_staff_profile.field_media.image',
      page: {
        limit: 5,
      },
    },
  })

  const transformed = staffProfiles.map((profile) =>
    transformStaffProfileData(profile)
  )

  return {
    props: {
      personProfiles,
      staffProfiles: transformed,
    },
  }
}
