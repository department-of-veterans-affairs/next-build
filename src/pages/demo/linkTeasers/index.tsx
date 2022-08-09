import { drupalClient } from '@/lib/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import Container from 'templates/container'
import { ParagraphLinkTeaser, ParagraphResourceType } from '@/types/paragraph'
import { LinkTeaser } from 'templates/linkTeaser'
import { generalEntityDataService } from 'data/delegators/generalEntityDataService'
const linkTeaserParams = { boldTitle: false, sectionHeader: '' }

interface LinkTeaserPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  LinkTeaserCollectionProps: any
  componentParams?: {
    boldTitle: boolean
    sectionHeader: string
  }
}

const LinkTeaserPage = ({ LinkTeaserCollectionProps }: LinkTeaserPageProps) => {
  if (!LinkTeaserCollectionProps) LinkTeaserCollectionProps = []

  return (
    <>
      <Container className="container">
        <ul className="usa-unstyled-list">
          {LinkTeaserCollectionProps.map((LinkTeaserProps) => (
            <LinkTeaser
              key={LinkTeaserProps.id}
              {...LinkTeaserProps}
              componentParams={linkTeaserParams}
            />
          ))}
        </ul>
      </Container>
    </>
  )
}

export default LinkTeaserPage

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<LinkTeaserPageProps>> {
  const params = new DrupalJsonApiParams()
  params.addPageLimit(3)

  const LinkTeaserCollection =
    await drupalClient.getResourceCollectionFromContext<ParagraphLinkTeaser[]>(
      ParagraphResourceType.LinkTeaser,
      context,
      {
        params: params.getQueryObject(),
      }
    )

  const LinkTeaserCollectionProps =
    generalEntityDataService(LinkTeaserCollection)

  return {
    props: {
      LinkTeaserCollectionProps,
    },
  }
}
