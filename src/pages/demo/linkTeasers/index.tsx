import { drupalClient } from '@/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import Container from '@/components/container'
import { ParagraphLinkTeaser } from '@/types/paragraph'
import { Paragraph } from '@/components/paragraph'

interface LinkTeaserPageProps {
  linkTeasers: ParagraphLinkTeaser[]
}

const LinkTeaserPage = ({ linkTeasers }: LinkTeaserPageProps) => {
  if (!linkTeasers) linkTeasers = []

  return (
    <>
      <Container className="container">
        <ul className="usa-unstyled-list">
          {linkTeasers.map((paragraph) => (
            <Paragraph
              key={paragraph.id}
              paragraph={paragraph}
              boldTitle={false}
              sectionHeader=""
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

  const linkTeasers = await drupalClient.getResourceCollectionFromContext<
    ParagraphLinkTeaser[]
  >('paragraph--link_teaser', context, {
    params: params.getQueryObject(),
  })
  return {
    props: {
      linkTeasers,
    },
  }
}
