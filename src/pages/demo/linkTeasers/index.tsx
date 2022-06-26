import { drupalClient } from '@/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import Container from '@/components/container'
import { ParagraphLinkTeaser, ParagraphResourceType } from '@/types/paragraph'
import { Paragraph } from '@/components/paragraph'

const linkTeaserParams = [{ boldTitle: false }, { sectionHeader: '' }]

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

  const linkTeasers = await drupalClient.getResourceCollectionFromContext<
    ParagraphLinkTeaser[]
  >(ParagraphResourceType.LinkTeaser, context, {
    params: params.getQueryObject(),
  })
  return {
    props: {
      linkTeasers,
    },
  }
}
