import { GetStaticPropsResult } from 'next'
import { queries } from '@/data/queries'
import { PersonProfileType } from '@/types/index'
import { NodeResourceType } from '@/types/dataTypes/drupal/node'
import { PersonProfile } from '@/templates/components/personProfile'
import Container from '@/templates/common/container'
interface ProfilePageProps {
  personProfileProps: PersonProfileType[]
}

const PersonProfilePage = ({ personProfileProps }: ProfilePageProps) => {
  return (
    <>
      <Container className="container">
        {personProfileProps
          ? personProfileProps.map((props) => (
              <div key={props.id}>
                <PersonProfile {...props} />
              </div>
            ))
          : null}
      </Container>
    </>
  )
}

export default PersonProfilePage

export async function getStaticProps(): Promise<
  GetStaticPropsResult<ProfilePageProps>
> {
  const personProfileCollection = await queries.getData(
    NodeResourceType.PersonProfile
  )

  return {
    props: {
      personProfileProps: personProfileCollection,
    },
  }
}
