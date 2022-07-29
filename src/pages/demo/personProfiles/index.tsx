import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalNode } from 'next-drupal'
import { drupalClient } from '@/utils/drupalClient'
<<<<<<< HEAD
import { PersonProfile, StaffNewsProfile } from '@/components/person_profile'
=======
import {
  PersonProfile,
  StaffNewsProfile,
} from '@/components/person_profile'
>>>>>>> 89f8e04 (Refactor splitting components from data layer, first pass (fails tests).)
import Container from '@/components/container'
import { Paragraph } from '@/lib/delegators/Paragraph'
import { ParagraphResourceType, ParagraphStaffProfile } from '@/types/paragraph'
import { NodePersonProfile, NodeResourceType } from '@/types/node'

interface ProfilePageProps {
  staffProfiles: ParagraphStaffProfile[]
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
                <StaffNewsProfile node={node} />
              </div>
            ))
          : null}

        {staffProfiles
          ? staffProfiles.map((paragraphStaffProfile) => (
              <div key={paragraphStaffProfile.id}>
                <Paragraph
                  key={paragraphStaffProfile.id}
                  paragraph={paragraphStaffProfile}
                />
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

  return {
    props: {
      personProfiles,
      staffProfiles,
    },
  }
}
