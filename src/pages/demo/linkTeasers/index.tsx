import { drupalClient } from '@/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalParagraph } from 'next-drupal'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import Container from '@/components/container'
import LinkTeaser from '@/components/paragraph/button'

interface LinkTeaserPageProps {
  linkTeasers: DrupalParagraph[]
}

const LinkTeaserPage = ({ linkTeasers }: LinkTeaserPageProps) => {
  if (!linkTeasers) linkTeasers = []

  return (
    <>
      <Container className="container">
        {linkTeasers.map((paragraph) => (
          <LinkTeaser key={paragraph.id} paragraph={paragraph} />
        ))}
      </Container>
    </>
  )
}

export default LinkTeaserPage

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<LinkTeaserPageProps>> {
  const params = new DrupalJsonApiParams()
  params.addPageLimit(30)

  const linkTeasers = await drupalClient.getResourceCollectionFromContext<
    DrupalParagraph[]
  >('paragraph--link_teaser', context, {
    params: params.getQueryObject(),
  })
  return {
    props: {
      linkTeasers: linkTeasers || null,
    },
  }
}
